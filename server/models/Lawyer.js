import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  specialty: [{ type: String }],
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
  email: { type: String, unique: true },
  reviews: [
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Lawyer = mongoose.model('Lawyer', lawyerSchema);
