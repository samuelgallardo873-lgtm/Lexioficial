// Server entry point!
// Fixed env
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { Lawyer } from './models/Lawyer.js';
import { Booking } from './models/Booking.js';
import { User } from './models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { MercadoPagoConfig, Preference } from 'mercadopago';
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    console.warn("No se pudo configurar dns.setServers:", e.message);
  }
}
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

// Get authenticated lawyer profile
app.get('/api/lawyers/me', authenticateToken, async (req, res) => {
  try {
    const lawyer = await Lawyer.findOne({ email: req.user.email });
    if (!lawyer) {
      return res.status(404).json({ error: 'Perfil de abogado no encontrado' });
    }
    if (lawyer.status === 'rejected') {
      return res.status(403).json({ error: 'Tu perfil de abogado ha sido rechazado por un administrador.' });
    }
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil de abogado' });
  }
});

// Update lawyer schedule
app.put('/api/lawyers/me/schedule', authenticateToken, async (req, res) => {
  try {
    const { schedule } = req.body;
    
    if (!schedule) {
      return res.status(400).json({ error: 'El horario es requerido' });
    }

    const lawyer = await Lawyer.findOneAndUpdate(
      { email: req.user.email },
      { $set: { schedule } },
      { new: true }
    );

    if (!lawyer) {
      return res.status(404).json({ error: 'Perfil de abogado no encontrado' });
    }

    res.json({ message: 'Horario actualizado correctamente', lawyer });
  } catch (error) {
    console.error('❌ Error al actualizar horario:', error);
    res.status(500).json({ error: 'Error al actualizar el horario' });
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

    // Enviar correo al administrador notificando el nuevo registro
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'lexi.plataforma@gmail.com',
          pass: process.env.EMAIL_PASS || 'password_de_aplicacion'
        }
      });

      // Obtener todos los administradores de la base de datos
      const adminUsers = await User.find({ role: 'admin' });
      const adminEmails = adminUsers.map(user => user.email);
      
      // Añadir específicamente el correo solicitado
      if (!adminEmails.includes('agusmatas@gmail.com')) {
        adminEmails.push('agusmatas@gmail.com');
      }

      const toEmails = adminEmails.join(', ');
      
      const mailToAdmin = {
        from: '"Lexi Plataforma" <' + (process.env.EMAIL_USER || 'lexi.plataforma@gmail.com') + '>',
        to: toEmails,
        subject: `NUEVO ABOGADO PARA REVISAR: ${lawyer.name}`,
        html: `
          <h2>¡Un nuevo abogado se ha registrado en Lexi!</h2>
          <p>Un abogado ha completado su perfil y está esperando aprobación.</p>
          <hr/>
          <h3>Detalles del Abogado</h3>
          <ul>
            <li><strong>Nombre:</strong> ${lawyer.name}</li>
            <li><strong>Correo:</strong> ${lawyer.email}</li>
            <li><strong>Matrícula:</strong> ${lawyer.matricula}</li>
            <li><strong>Experiencia:</strong> ${lawyer.experience} años</li>
          </ul>
          <hr/>
          <p>Por favor, ingresa al <a href="${process.env.CLIENT_URL || 'https://www.abogadoslexi.com'}/admin/login">Panel de Control de Admin</a> para revisar y aprobar o rechazar su solicitud.</p>
        `
      };

      await transporter.sendMail(mailToAdmin);
      console.log(`Correo de notificación de nuevo abogado enviado a admins (${toEmails})`);
    } catch (mailError) {
      console.warn("No se pudo enviar el correo de notificación a admin:", mailError.message);
    }

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

// --- Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'usuario' // Default role
    });

    await newUser.save();

    // Create token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    // req.user has the token payload, but let's get fresh user data just in case
    // Note: older admin login used { username } as payload, we need to handle that gracefully
    if (req.user.username) {
      // It's the hardcoded admin token
      return res.json({
        id: 'admin-hardcoded',
        name: 'Administrador Principal',
        email: 'admin@lexi.com',
        role: 'admin'
      });
    }

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del usuario' });
  }
});
// --- End Auth Routes ---

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

// Get booked slots for a lawyer
app.get('/api/lawyers/:id/booked-slots', async (req, res) => {
  try {
    const bookings = await Booking.find({
      lawyerId: req.params.id,
      status: { $nin: ['cancelled', 'rejected'] }
    }).select('selectedDate selectedTime -_id');
    
    res.json(bookings);
  } catch (error) {
    console.error('❌ Error al obtener turnos reservados:', error);
    res.status(500).json({ error: 'Error al obtener disponibilidad' });
  }
});

// Mercado Pago Integration & Booking Creation
app.post('/api/create-booking-intent', async (req, res) => {
  try {
    const { bookingData } = req.body;
    
    if (!bookingData || !bookingData.lawyer) {
      return res.status(400).json({ error: 'Datos de reserva incompletos' });
    }

    const { 
      lawyer, consultationType, caseDescription, clientName, clientEmail, clientPhone,
      clientAge, caseType, selectedDate, selectedTime, paymentAmount 
    } = bookingData;

    // 0. Verify slot is still available
    const existingBooking = await Booking.findOne({
      lawyerId: lawyer._id || lawyer.id,
      selectedDate,
      selectedTime,
      status: { $nin: ['cancelled', 'rejected'] }
    });

    if (existingBooking) {
      return res.status(409).json({ error: 'El turno seleccionado ya no está disponible. Por favor, elige otro horario.' });
    }

    // 1. Save booking as 'pending'
    const newBooking = new Booking({
      lawyerId: lawyer._id || lawyer.id,
      clientName,
      clientEmail,
      clientPhone,
      clientAge,
      caseType,
      caseDescription,
      consultationType,
      selectedDate,
      selectedTime,
      paymentAmount,
      status: 'pending' // Will be updated to confirmed by Webhook
    });

    await newBooking.save();

    // 2. Prepare Mercado Pago Preference
    let clientUrl = process.env.CLIENT_URL;
    const referer = req.headers.referer || req.headers.origin;
    if (!clientUrl && referer) {
      try {
        const urlObj = new URL(referer);
        clientUrl = urlObj.origin;
      } catch (e) {
        // Fallback
      }
    }
    if (!clientUrl) {
      clientUrl = "http://localhost:5173";
    }

    const successUrl = `${clientUrl}/confirmation`;
    const failureUrl = `${clientUrl}/payment`;
    const pendingUrl = `${clientUrl}/payment`;

    const body = {
      items: [
        {
          title: `Anticipo de Consulta Legal - Abogado ${lawyer.name}`,
          quantity: 1,
          unit_price: Number(paymentAmount),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      external_reference: newBooking._id.toString(), // CRITICAL for Webhook tracking
      notification_url: (process.env.WEBHOOK_URL || 'https://www.abogadoslexi.com') + '/api/webhook/mercadopago',
    };

    const isLocalOrInsecure = successUrl.includes("localhost") || 
                              successUrl.includes("127.0.0.1") || 
                              successUrl.includes("192.168.") || 
                              !successUrl.startsWith("https://");
    
    if (!isLocalOrInsecure) {
      body.auto_return = "approved";
    }

    const preference = new Preference(mpClient);
    const result = await preference.create({ body });
    
    const isProduction = process.env.ACCESS_TOKEN && process.env.ACCESS_TOKEN.startsWith('APP_USR');
    const paymentUrl = isProduction ? result.init_point : (result.sandbox_init_point || result.init_point);

    res.json({ id: result.id, init_point: paymentUrl, bookingId: newBooking._id });
  } catch (error) {
    console.error("Error al crear intención de reserva:", error);
    res.status(500).json({ error: "No se pudo generar el link de pago", details: error.message || error });
  }
});

// Webhook de Mercado Pago
app.post('/api/webhook/mercadopago', async (req, res) => {
  try {
    const { action, data } = req.body;
    
    if (action === 'payment.created' || req.query.topic === 'payment') {
      const paymentId = data?.id || req.query.id;
      if (!paymentId) return res.status(400).send('No payment ID');

      // 1. Get payment details from MP API manually (since mpClient.payment is sometimes tricky, use fetch)
      const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${process.env.ACCESS_TOKEN}` }
      });
      const paymentData = await mpResponse.json();

      if (paymentData.status === 'approved') {
        const bookingId = paymentData.external_reference;
        
        // 2. Find booking and update status
        const booking = await Booking.findById(bookingId).populate('lawyerId');
        if (booking && booking.status !== 'confirmed') {
          booking.status = 'confirmed';
          await booking.save();

          // 3. Send emails
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER || 'lexi.plataforma@gmail.com',
              pass: process.env.EMAIL_PASS || 'password_de_aplicacion'
            }
          });

          // Email for Lawyer
          const mailToLawyer = {
            from: '"Lexi Consultas" <lexi.plataforma@gmail.com>',
            to: booking.lawyerId.email,
            subject: `Nueva Consulta Reservada: ${booking.clientName} - ${booking.selectedDate}`,
            html: `
              <h2>¡Tienes una nueva consulta reservada en Lexi!</h2>
              <p>Un cliente ha realizado el pago del anticipo y agendado una cita contigo.</p>
              <hr/>
              <h3>Detalles del Cliente</h3>
              <ul>
                <li><strong>Nombre:</strong> ${booking.clientName}</li>
                <li><strong>Correo:</strong> ${booking.clientEmail}</li>
                <li><strong>Teléfono:</strong> ${booking.clientPhone}</li>
                <li><strong>Edad:</strong> ${booking.clientAge || 'No especificada'}</li>
                <li><strong>Tipo de Consulta:</strong> ${booking.consultationType}</li>
              </ul>
              <h3>Agenda</h3>
              <ul>
                <li><strong>Fecha:</strong> ${booking.selectedDate}</li>
                <li><strong>Hora:</strong> ${booking.selectedTime}</li>
              </ul>
              <h3>Descripción del Caso</h3>
              <p>${booking.caseDescription || 'El cliente no proveyó detalles previos.'}</p>
              <hr/>
              <p>Por favor, comunícate con el cliente para coordinar el encuentro o enviarle el enlace de la videollamada.</p>
              <p>Atentamente,<br/>El equipo de Lexi</p>
            `
          };

          // Email for Client
          const mailToClient = {
            from: '"Lexi Soporte" <lexi.plataforma@gmail.com>',
            to: booking.clientEmail,
            subject: `Confirmación de Reserva - Abogado ${booking.lawyerId.name}`,
            html: `
              <h2>¡Tu reserva está confirmada!</h2>
              <p>Hola ${booking.clientName}, tu pago de $${booking.paymentAmount} ARS ha sido procesado exitosamente.</p>
              <hr/>
              <h3>Detalles de tu cita</h3>
              <ul>
                <li><strong>Abogado:</strong> ${booking.lawyerId.name}</li>
                <li><strong>Tipo de Consulta:</strong> ${booking.consultationType}</li>
                <li><strong>Fecha:</strong> ${booking.selectedDate}</li>
                <li><strong>Hora:</strong> ${booking.selectedTime}</li>
              </ul>
              <hr/>
              <p><strong>¿Qué sigue?</strong></p>
              <p>El abogado ha sido notificado y se comunicará contigo próximamente al correo <strong>${booking.clientEmail}</strong> para coordinar los detalles (lugar físico o enlace de videollamada).</p>
              <p>Si tienes algún problema o el abogado no se contacta, por favor comunícate con nosotros respondiendo a este correo o escribiendo a <a href="mailto:soporte@lexi.com">soporte@lexi.com</a>.</p>
              <p>Gracias por confiar en Lexi.</p>
            `
          };

          try {
            await transporter.sendMail(mailToLawyer);
            await transporter.sendMail(mailToClient);
            console.log(`Correos enviados para la reserva ${bookingId}`);
          } catch (mailError) {
            console.warn("No se pudo enviar el correo:", mailError.message);
          }
        }
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error("Error procesando webhook de Mercado Pago:", error);
    res.status(500).send('Error');
  }
});

app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});

export default app;
