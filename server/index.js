// Server entry point!
// Fixed env
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { Lawyer } from './models/Lawyer.js';
import { Booking } from './models/Booking.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { MercadoPagoConfig, Preference } from 'mercadopago';
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Configuración de Mercado Pago
const mpClient = new MercadoPagoConfig({ 
  accessToken: process.env.ACCESS_TOKEN || 'TEST-8260173256053336-052620-e291cc7f407a51cc24de63004bb15e21-1829038237' 
});

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
    let query = { status: 'approved', rating: { $exists: true } }; // fallback for existing records

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

    if (!lawyerData.consultationType || lawyerData.consultationType.length === 0) {
      return res.status(400).json({ error: 'Debes seleccionar al menos un tipo de consulta' });
    }

    if (!lawyerData.price) {
      return res.status(400).json({ error: 'Faltan los precios de consulta' });
    }

    for (const type of lawyerData.consultationType) {
      if (lawyerData.price[type] === undefined || lawyerData.price[type] === null || lawyerData.price[type] < 0) {
        return res.status(400).json({ error: `Debes definir un precio válido para el tipo de consulta seleccionado.` });
      }
    }

    const lawyer = await Lawyer.findOneAndUpdate(
      { email },
      { $set: { ...lawyerData, status: 'pending' } },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ message: 'Datos guardados correctamente', lawyer });
  } catch (error) {
    console.error('❌ Error al guardar abogado:', error);
    const msg = error.message || 'Error desconocido al guardar los datos';
    res.status(500).json({ error: msg });
  }
});

// Admin endpoints
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ error: 'Token no proporcionado' });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.user = user;
    next();
  });
};

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

  if (username === adminUsername && password === adminPassword) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

app.get('/api/admin/lawyers', authenticateToken, async (req, res) => {
  try {
    const lawyers = await Lawyer.find({});
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener abogados pendientes' });
  }
});

app.post('/api/admin/lawyers/:id/approve', authenticateToken, async (req, res) => {
  try {
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!lawyer) return res.status(404).json({ error: 'Abogado no encontrado' });
    res.json({ message: 'Abogado aprobado', lawyer });
  } catch (error) {
    res.status(500).json({ error: 'Error al aprobar abogado' });
  }
});

app.post('/api/admin/lawyers/:id/reject', authenticateToken, async (req, res) => {
  try {
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!lawyer) return res.status(404).json({ error: 'Abogado no encontrado' });
    res.json({ message: 'Abogado rechazado', lawyer });
  } catch (error) {
    res.status(500).json({ error: 'Error al rechazar abogado' });
  }
});

app.delete('/api/admin/lawyers/:id', authenticateToken, async (req, res) => {
  try {
    const lawyer = await Lawyer.findByIdAndDelete(req.params.id);
    if (!lawyer) return res.status(404).json({ error: 'Abogado no encontrado' });
    res.json({ message: 'Abogado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar abogado' });
  }
});

app.get('/api/admin/bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('lawyerId').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' });
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

app.post('/api/confirm-booking', async (req, res) => {
  try {
    const { 
      lawyer, consultationType, caseDescription, clientName, 
      clientAge, caseType, selectedDate, selectedTime, paymentAmount 
    } = req.body;

    const newBooking = new Booking({
      lawyerId: lawyer._id,
      clientName,
      clientAge,
      caseType,
      caseDescription,
      consultationType,
      selectedDate,
      selectedTime,
      paymentAmount
    });

    await newBooking.save();

    // Enviar correo al abogado
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'lexi.plataforma@gmail.com',
        pass: process.env.EMAIL_PASS || 'password_de_aplicacion'
      }
    });

    const mailOptions = {
      from: '"Lexi Consultas" <lexi.plataforma@gmail.com>',
      to: lawyer.email,
      subject: `Nueva Consulta Reservada: ${clientName} - ${selectedDate}`,
      html: `
        <h2>¡Tienes una nueva consulta reservada en Lexi!</h2>
        <p>Un cliente ha realizado el pago del anticipo y agendado una cita contigo.</p>
        <hr/>
        <h3>Detalles del Cliente</h3>
        <ul>
          <li><strong>Nombre:</strong> ${clientName}</li>
          <li><strong>Edad:</strong> ${clientAge || 'No especificada'}</li>
          <li><strong>Tipo de Consulta:</strong> ${consultationType}</li>
        </ul>
        <h3>Agenda</h3>
        <ul>
          <li><strong>Fecha:</strong> ${selectedDate}</li>
          <li><strong>Hora:</strong> ${selectedTime}</li>
        </ul>
        <h3>Descripción del Caso</h3>
        <p>${caseDescription || 'El cliente no proveyó detalles previos.'}</p>
        <hr/>
        <p>Por favor, prepárate para la consulta. El cliente pagó un anticipo de $${paymentAmount} ARS a través de Mercado Pago.</p>
        <p>Atentamente,<br/>El equipo de Lexi</p>
      `
    };

    // Intentamos enviar el correo, pero no detenemos la respuesta si falla por falta de configuración real
    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.warn("No se pudo enviar el correo (posiblemente falta configurar credenciales en .env):", mailError.message);
    }

    res.status(201).json({ message: 'Reserva confirmada', booking: newBooking });
  } catch (error) {
    console.error('Error al confirmar reserva:', error);
    res.status(500).json({ error: 'Error interno del servidor al confirmar reserva' });
  }
});

// Mercado Pago Integration
app.post('/api/create_preference', async (req, res) => {
  try {
    const { title, price, quantity } = req.body;
    
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const successUrl = `${clientUrl}/confirmation`;
    const failureUrl = `${clientUrl}/payment`;
    const pendingUrl = `${clientUrl}/payment`;

    const body = {
      items: [
        {
          title: title || "Anticipo de Consulta Legal",
          quantity: Number(quantity) || 1,
          unit_price: Number(price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
    };

    // Mercado Pago strictly requires a public URL for auto_return: "approved"
    // If the success URL contains "localhost" or "127.0.0.1", we must omit auto_return to avoid 400 Bad Request errors.
    if (!successUrl.includes("localhost") && !successUrl.includes("127.0.0.1")) {
      body.auto_return = "approved";
    }

    const preference = new Preference(mpClient);
    const result = await preference.create({ body });
    
    // Intelligently select between live checkout (init_point) and sandbox checkout (sandbox_init_point)
    const isProduction = process.env.ACCESS_TOKEN && process.env.ACCESS_TOKEN.startsWith('APP_USR');
    const paymentUrl = isProduction ? result.init_point : (result.sandbox_init_point || result.init_point);

    res.json({ id: result.id, init_point: paymentUrl });
  } catch (error) {
    console.error("Error al crear la preferencia de Mercado Pago:", error);
    res.status(500).json({ error: "No se pudo generar el link de pago", details: error.message || error });
  }
});

app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});

export default app;
