import express from 'express';
import { getAllOrders, getOrder, postOrder, updateOrder } from '../Controller/Orders.controller.js';

const route = express.Router();

route.get('/orders', getAllOrders);
route.post('/place-order', postOrder);
route.patch('/:orderId', updateOrder)
route.get('/:id', getOrder)


export default route;