import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer', required: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  clientAge: { type: String },
  caseType: { type: String },
  caseDescription: { type: String },
  consultationType: { type: String, required: true },
  selectedDate: { type: String, required: true },
  selectedTime: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
  status: { type: String, default: 'pending' }, // pending, confirmed, completed, cancelled
  createdAt: { type: Date, default: Date.now }
});

export const Booking = mongoose.model('Booking', bookingSchema);
