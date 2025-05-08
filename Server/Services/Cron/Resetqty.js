import cron from 'node-cron';
import Product from '../../Model/Product.model.js';

// Run every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  try {
    // Fetch all products
    const products = await Product.find();

    // Loop through each product and reset its quantity to totelQuantity
    for (const product of products) {
      if (typeof product.totelQuantity === 'number') {
        product.quantity = product.totelQuantity;
        await product.save();
      }
    }

    console.log('✅ All product quantities have been reset successfully!');
  } catch (err) {
    console.error('❌ Error while resetting product quantities:', err.message);
  }
});
