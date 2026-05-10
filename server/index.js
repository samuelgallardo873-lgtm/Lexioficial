import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Lawyer } from './models/Lawyer.js';

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
    const { email } = lawyerData;

    if (!email) {
      return res.status(400).json({ error: 'El email es requerido' });
    }

    const lawyer = await Lawyer.findOneAndUpdate(
      { email },
      lawyerData,
      { new: true, upsert: true }
    );

    res.json({ message: 'Datos guardados correctamente', lawyer });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar los datos' });
  }
});

app.post('/api/bookings', (req, res) => {
  const booking = req.body;
  res.status(201).json({ message: 'Reserva recibida', booking });
});

app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});
