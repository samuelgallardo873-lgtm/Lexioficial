import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { lawyers } from './data/lawyers.js';
import { Lawyer } from './models/Lawyer.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB para migración');

    // Remove existing data to avoid duplicates (optional, based on preference)
    // await Lawyer.deleteMany({});

    for (const lawyerData of lawyers) {
      const { id, reviews, ...data } = lawyerData;
      // Use email as a unique identifier for migration if possible, 
      // but here we just create them. Adding a dummy email based on name.
      const email = `${data.name.toLowerCase().replace(/ /g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@example.com`;
      
      await Lawyer.findOneAndUpdate(
        { email },
        { ...data, reviewsCount: reviews, reviews: [], email },
        { upsert: true, new: true }
      );
      console.log(`Migrado: ${data.name}`);
    }

    console.log('Migración completada');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
}

migrate();
