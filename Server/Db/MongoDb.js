import mongoose from 'mongoose';

const db = async () => {
    try {
        await mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Db Connected Successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

export default db;
