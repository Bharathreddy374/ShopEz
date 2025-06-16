import mongoose from 'mongoose';
import { Product } from './Schema.js'; // adjust path if needed

const adminId = new mongoose.Types.ObjectId('684f2990ba8d47e214a1ee00');

mongoose.connect('mongodb://localhost:27017/shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to DB');

  const result = await Product.deleteMany({});

  console.log(`🗑️ Deleted ${result.deletedCount} products added by admin`);
  process.exit();
}).catch(err => {
  console.error('❌ Error deleting products:', err);
});
