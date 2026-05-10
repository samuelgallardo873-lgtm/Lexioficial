import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  experience: { type: Number },
  consultationType: [{ type: String }],
  price: {
    'oral-presencial': { type: Number },
    'escrita-presencial': { type: Number },
    'oral-videollamada': { type: Number },
    'escrita-videollamada': { type: Number },
  },
  availability: { type: String },
  image: { type: String },
  description: { type: String },
  languages: [{ type: String }],
  email: { type: String, unique: true }, // Added for lawyer identification
}, { timestamps: true });

export const Lawyer = mongoose.model('Lawyer', lawyerSchema);
