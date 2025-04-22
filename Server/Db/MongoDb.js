import mongoose from 'mongoose';

const db = async (srv) => {
    try {
        await mongoose.connect(srv); // Only this line is enough in latest versions
        console.log('Db Connected Successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
    }
};

export default db;
