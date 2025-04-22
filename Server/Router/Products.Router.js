import express from 'express'
import upload from '../Services/Multer.js';
import { getAllCategory, getAllProducts, getCategory, getProduct, postCategory, postNewProduct } from '../Controller/Products.controller.js';
import ProtectedRoute from '../Service/ProtectedRoute.js';
const route = express.Router();

route.get('/', getAllProducts);
route.post('/new-product', ProtectedRoute, upload.single('picture'), postNewProduct);
route.post('/new-category', ProtectedRoute, upload.single('picture'), postCategory);
route.get('/category', getAllCategory);
route.get('/:category', getCategory);
route.get('/:productId', getProduct);


export default route;