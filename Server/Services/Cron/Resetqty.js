import corn from 'node-cron';
import Products from '../../Model/Product.model.js';
import User from '../../Model/User.model.js';


corn.schedule('0 0 * * *', async () => {
    try {
        const fixedQty = 10;

        await Products.updateMany({}, { $set: { qty: fixedQty } });

        console.log('✅ Product qty reset to', fixedQty);
    } catch (err) {
        console.error('❌ Error resetting qty:', err);
    }
});