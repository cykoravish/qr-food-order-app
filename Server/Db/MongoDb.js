import mongoose from "mongoose";


const db = async (srv) => {
    try {
        await mongoose.connect(srv);
        console.log('Db Connected Successfully')
    } catch (error) {
        console.log(error)
    }
};

export default db;