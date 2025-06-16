import mongoose from 'mongoose';
import { Product } from './Schema.js';
import fs from 'fs';

const adminId =new mongoose.Types.ObjectId('684f2990ba8d47e214a1ee00');

// Load JSON manually using fs
const rawData = fs.readFileSync('./Schema.json');
const products = JSON.parse(rawData);

const updatedProducts = products.map(product => ({
  ...product,
  addedBy: adminId
}));

mongoose.connect('mongodb://localhost:27017/shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connected to DB');

  const inserted = await Product.insertMany(updatedProducts);

  console.log(`✅ Inserted ${inserted.length} products`);
  process.exit();
}).catch(err => {
  console.error('❌ Error inserting products:', err);
});
