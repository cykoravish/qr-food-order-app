import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    phone: Number,
    table: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { Timestamp: true });

const User = mongoose.model('User', userSchema);
export default User;