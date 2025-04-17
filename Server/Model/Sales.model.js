import mongoose, { mongo } from "mongoose";

const salesSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    totelOrders: Number,
    totelRevenue: Number,
    bestSellingItems: {
        productId: {
            type: String,
            ref: 'Product'
        },
        name: String,
        quantitySold: Number
    }
});

const Sales = mongoose.model('Sales', salesSchema);
export default Sales;