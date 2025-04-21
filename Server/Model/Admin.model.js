import mongoose from "mongoose";

const AdminSchema = mongoose.Schema({
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

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;
