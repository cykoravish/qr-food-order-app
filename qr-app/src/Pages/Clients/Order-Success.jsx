import { CheckCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import publicAxios from '../../Services/PublicAxios';
import { Bounce, toast } from 'react-toastify';

export const OrderSuccess = () => {
    const [AllOrder, setAllOrder] = useState([]);
    const [lastOrder, setLastOrder] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchedData = async () => {
            const res = await publicAxios.get('/orders/orders');
            if (res.status !== 200) {
                throw new Error({ message: 'Responce Failed' })
            };

            setAllOrder(res.data.content)
        };
        fetchedData()
        const user = JSON.parse(localStorage.getItem('user'));
        const filterOrder = AllOrder.filter((order) => {
            const today = new Date().toISOString().split('T')[0];

            if (order.userId?._id === user?._id) {
                return new Date(order.placedAt).toISOString().split('T')[0] == today
            }
        })
        const recentorder = filterOrder.length > 0 && filterOrder[filterOrder.length - 1];
        setLastOrder(recentorder)
        if (recentorder.status === 'delivered') {
            localStorage.removeItem('user');
            toast.info('🦄 Thankyou Give us a second chance to serve you!', {
                position: "top-center",
                autoClose: 10000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: 1,
                theme: "colored",
                transition: Bounce,
            });
            navigate('/')
        };

    }, [AllOrder, navigate]);



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
