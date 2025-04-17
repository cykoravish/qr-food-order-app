import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: Number,
    imageUrl: String,
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    available: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { Timestamp: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
