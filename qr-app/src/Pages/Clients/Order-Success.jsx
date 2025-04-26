import { CheckCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import publicAxios from '../../Services/PublicAxios';
import { Bounce } from 'react-toastify';
// import { socket } from '../../Services/Socket';

export const OrderSuccess = () => {
    const [AllOrder, setAllOrder] = useState([]);
    const [lastOrder, setLastOrder] = useState([]);
    const [render, setRender] = useState(false);
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
        fetchedData(); // Initial fetch

        // Listen for socket events
        // socket.on('order-status-updated', () => {
        //     console.log('Order status updated');
        //     setRender(true)
        // });
        // render && fetchedData(); // Fetch data again when event is received

        // Clean up on component unmount
        return () => {
            // socket.off('order-status-updated'); // Remove the event listener
        };

    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const filterOrder = AllOrder.filter((order) => {
            const today = new Date().toISOString().split('T')[0];

            if (order.userId?._id === user?._id) {
                return new Date(order.placedAt).toISOString().split('T')[0] == today
            }
        })
        const recentorder = filterOrder.length > 0 && filterOrder[filterOrder.length - 1];
        setLastOrder(recentorder);
    }, [AllOrder])

    useEffect(() => {
        if (lastOrder.status === 'delivered') {
            localStorage.removeItem('user')
        }
    }, [lastOrder.status])

    return (
        <div className="w-[375px] mx-auto min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
            <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
            <h1 className="text-xl font-bold text-green-700 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                Thank you for your order. Here are your order details:
            </p>

            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mb-6">
                <p className="text-sm text-gray-500 mb-2">Order ID:</p>

                <p className="text-sm text-gray-700 mb-4">{lastOrder._id}</p>
                <h2><span>Status: </span>{lastOrder.status}</h2>



                <div className="mt-4 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{lastOrder.totalAmount}</span>
                </div>
            </div>

            <Link
                to="/"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md transition"
            >
                Go to Home
            </Link>

        </div>
    );
};
