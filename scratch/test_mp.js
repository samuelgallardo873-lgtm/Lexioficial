import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.ACCESS_TOKEN || 'TEST-8260173256053336-052620-e291cc7f407a51cc24de63004bb15e21-1829038237';
console.log('Testing MP with Token starting with:', token.substring(0, 15));

const mpClient = new MercadoPagoConfig({ 
  accessToken: token 
});

const body = {
  items: [
    {
      title: "Anticipo de Consulta Legal (TEST)",
      quantity: 1,
      unit_price: 100,
      currency_id: "ARS",
    },
  ],
  back_urls: {
    success: "http://localhost:5173/confirmation",
    failure: "http://localhost:5173/payment",
    pending: "http://localhost:5173/payment",
  },
  // auto_return: "approved",
};

const preference = new Preference(mpClient);
preference.create({ body })
  .then(result => {
    console.log('Success! Preference ID:', result.id);
    console.log('init_point:', result.init_point);
    console.log('sandbox_init_point:', result.sandbox_init_point);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error creating preference:', err);
    process.exit(1);
  });
