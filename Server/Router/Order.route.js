import express from 'express';
import { getAllOrders, postOrder, updateOrder } from '../Controller/Orders.controller.js';

const route = express.Router();

route.get('/orders', getAllOrders);
route.post('/place-order', postOrder);
route.patch('/:orderId', updateOrder)


export default route;