import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['client', 'admin'],
        default: 'client'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { Timestamp: true });

const User = mongoose.model('User', userSchema);
export default User;
