import mongoose from "mongoose";

const CategorySchema = mongoose.Schema({
    name: String,
    description: String,
    imageUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;