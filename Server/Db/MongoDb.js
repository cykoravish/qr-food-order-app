import mongoose from "mongoose";


const db = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/QrOrder');
        console.log('Db Connected Successfully')
    } catch (error) {
        console.log(error)
    }
};

export default db;