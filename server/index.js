import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { Lawyer } from './models/Lawyer.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Node.js en funcionamiento' });
});

// Get all lawyers with optional filters
app.get('/api/lawyers', async (req, res) => {
  try {
    const { specialty, consultationType, language } = req.query;
    let query = {};

    if (specialty) query.specialty = specialty;
    if (consultationType) query.consultationType = consultationType;
    if (language) query.languages = language;

    const lawyers = await Lawyer.find(query);
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener abogados' });
  }
});

// Get lawyer by ID
app.get('/api/lawyers/:id', async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) {
      return res.status(404).json({ error: 'Abogado no encontrado' });
    }
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el abogado' });
  }
});

// Create or Update lawyer (for the "link" functionality)
app.post('/api/lawyers/update', async (req, res) => {
  try {
    const lawyerData = req.body;
    const { email, matricula } = lawyerData;

    if (!email) {
      return res.status(400).json({ error: 'El email es requerido' });
    }

    if (!matricula) {
      return res.status(400).json({ error: 'La matrícula profesional es requerida' });
    }

    const lawyer = await Lawyer.findOneAndUpdate(
      { email },
      { $set: lawyerData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: 'Datos guardados correctamente', lawyer });
  } catch (error) {
    console.error('❌ Error al guardar abogado:', error);
    const msg = error.message || 'Error desconocido al guardar los datos';
    res.status(500).json({ error: msg });
  }
});

// Add a review to a lawyer
app.post('/api/lawyers/:id/reviews', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const lawyer = await Lawyer.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({ error: 'Abogado no encontrado' });
    }

    const newReview = { name, rating: Number(rating), comment, date: new Date() };
    lawyer.reviews.push(newReview);

    // Update average rating
    const totalRating = lawyer.reviews.reduce((acc, rev) => acc + rev.rating, 0);
    lawyer.rating = Number((totalRating / lawyer.reviews.length).toFixed(1));
    lawyer.reviewsCount = lawyer.reviews.length;

    await lawyer.save();
    res.status(201).json({ message: 'Reseña añadida correctamente', review: newReview, rating: lawyer.rating, reviewsCount: lawyer.reviewsCount });
  } catch (error) {
    console.error('❌ Error al añadir reseña:', error);
    res.status(500).json({ error: 'Error al procesar la reseña' });
  }
});

app.post('/api/bookings', (req, res) => {
  const booking = req.body;
  res.status(201).json({ message: 'Reserva recibida', booking });
});

app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});
