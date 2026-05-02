import express from 'express';
import cors from 'cors';
import { lawyers } from './data/lawyers.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend Node.js en funcionamiento' });
});

app.get('/api/lawyers', (req, res) => {
  res.json(lawyers);
});

app.get('/api/lawyers/:id', (req, res) => {
  const lawyer = lawyers.find((lawyer) => lawyer.id === req.params.id);
  if (!lawyer) {
    return res.status(404).json({ error: 'Abogado no encontrado' });
  }
  res.json(lawyer);
});

app.post('/api/bookings', (req, res) => {
  const booking = req.body;
  // Aquí se podrá conectar con MongoDB más adelante.
  res.status(201).json({ message: 'Reserva recibida', booking });
});

app.listen(port, () => {
  console.log(`Servidor Node.js escuchando en http://localhost:${port}`);
});
