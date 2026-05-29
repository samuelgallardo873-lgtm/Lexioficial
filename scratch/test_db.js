import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

console.log('Testing connection to:', process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
