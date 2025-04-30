import { CheckCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import publicAxios from '../../Services/PublicAxios';
import { Bounce } from 'react-toastify';
import { socket } from '../../Services/Socket';
// import { socket } from '../../Services/Socket';

export const OrderSuccess = () => {
    const [AllOrder, setAllOrder] = useState([]);
    const [lastOrder, setLastOrder] = useState([]);
    // const [render, setRender] = useState(false);
    // const navigate = useNavigate();

    const fetchedData = async () => {
        try {
            const res = await publicAxios.get('/orders/orders');
            if (res.status !== 200) {
                throw new Error('Response Failed');
            }
            setAllOrder(res.data.content); // Set state with fetched data
        } catch (error) {
            console.error('Error fetching orders:', error.message); // Catch any errors
        }
    };


    useEffect(() => {

        fetchedData()
        if (!socket) return; // protect

        socket.emit('join-admin'); // 🛠 Admin joins 'admin-room'

        const handleOrderUpdate = (data) => {
            console.log('Admin received order update:', data);
            fetchedData();
        };

        socket.on('order-updated-status', handleOrderUpdate);

        return () => {
            socket.off('order-updated-status', handleOrderUpdate);
        };
    }, []);


    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const filterOrder = AllOrder.filter((order) => {
            if (order.userId?._id === user?._id) {
                return order
            }
        })
        const recentorder = filterOrder.length > 0 && filterOrder[filterOrder.length - 1];
        setLastOrder(recentorder);
    }, [AllOrder]);

    console.log(lastOrder)
    useEffect(() => {
        if (lastOrder.status === 'delivered') {
            localStorage.removeItem('user')
            localStorage.removeItem('cart')
        }
    }, [lastOrder.status]);

    console.log(lastOrder.items)
    if (lastOrder.length == 0 && lastOrder.length < 1) {
        lastOrder?.items?.productId?.name
    }

    return (
        <div className="w-[98%] mx-auto flex flex-col items-center justify-center bg-green-50 p-4">
            <CheckCircle className="text-green-500 w-15 h-15 mb-4" />
            <h1 className="text-xl font-bold text-green-700 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                Thank you for your order. Here are your order details:
            </p>

            {Array.isArray(lastOrder)
                ? lastOrder.map(order => (
                    <p key={order._id}>{order._id}</p>
                ))
                : (<div key={lastOrder._id} className="border rounded-lg p-4 mb-4 shadow-md">
                    <h2 className="font-medium   mb-2">Order ID: {lastOrder._id}</h2>
                    <p><span className="font-medium">Customer:</span> {lastOrder.userId?.name}</p>
                    <p><span className="font-medium">Phone:</span> {lastOrder.userId?.phone}</p>
                    <p><span className="font-medium">Status:</span> {lastOrder.status}</p>
                    <p><span className="font-medium">Payment:</span> {lastOrder.paymentMethod}</p>
                    <p><span className="font-medium">Total:</span> ₹{lastOrder.totalAmount}</p>
                    <p><span className="font-medium">Tax:</span> ₹{lastOrder.tax}</p>
                    <p><span className="font-medium">Delivery Charge:</span> ₹{lastOrder.deliveryCharge}</p>
                    <p><span className="font-medium">Placed At:</span> {new Date(lastOrder.placedAt).toLocaleString()}</p>

                    <div className="mt-2">
                        <p className="font-medium">Items:</p>
                        <ul className="list-disc pl-6">
                            {lastOrder.items?.map((item, index) => (
                                <li key={index}>
                                    {item.productId.name} — ₹{item.price} x {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                )
            }

            <Link
                to="/"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md transition"
            >
                Go to Home
            </Link>

        </div>
    );
};
