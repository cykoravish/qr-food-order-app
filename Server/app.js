import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import db from './Db/MongoDb.js';
import AuthRoutes from './Router/User.Router.js'
import ProductsRoute from './Router/Products.Router.js'
import CartRoutes from './Router/Cart.router.js'
import OrderRoutes from './Router/Order.route.js'
import PaymentRoutes from './Router/Payment.router.js'
import SalesRouter from './Router/Sales.router.js'
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'
import path from 'path';
import './Services/Cron/Resetqty.js';
import ProtectedRoute from './Service/ProtectedRoute.js';
import Product from './Model/Product.model.js';
import { createServer } from 'node:http'
import http from 'http'
import { Server } from 'socket.io'
import socketIo from './Socket/Socket.js';
dotenv.config();
const __Filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__Filename);



const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'PUT'],
    // allowedHeaders: true,
    credentials: true

}));

const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});


io.on('connection', (socket) => {
    console.log('user connected', socket.id);

    socket.on('join-admin', () => {
        socket.join('admin-room');
        console.log('Admin joined admin-room');
    });

    socket.on('order-placed', (orderId) => {
        console.log('order placed', orderId);
        io.to('admin-room').emit('placed-order', orderId); // Only send to Admins
    });

    socket.on('order-updated', (data) => {
        console.log("order update status", data);
        io.to('admin-room').emit('order-updated-status', data); // Only send to Admins
    });

    socket.on('disconnect', () => {
        console.log('user disconnect', socket.id);
    });
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, '/uploads')))

db();
app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/products', ProductsRoute);
app.use('/api/v1/carts', CartRoutes);
app.use('/api/v1/orders', OrderRoutes);
app.use('/api/v1/sales', SalesRouter);


app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err); // Pass to default handler if response already sent
    }

    console.error("❌ Error caught by middleware:", err);

    res.status(500).json({
        message: 'Internal Server Error',
        error: err.message || 'Unexpected error'
    });
});


server.listen(5000, () => console.log('server connected 5000'))