import { CheckCircle } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const OrderSuccess = () => {

    return (
        <div className="w-[375px] mx-auto min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
            <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
            <h1 className="text-xl font-bold text-green-700 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6 text-center max-w-md">
                Thank you for your order. Here are your order details:
            </p>

            {/* <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mb-6">
                <p className="text-sm text-gray-500 mb-2">Order ID:</p>
                <p className="text-sm text-gray-700 mb-4">{order._id}</p>

                <div className="space-y-3">
                    {order.items?.map((item, index) => (
                        <div key={index} className="border-b pb-2">
                            <p className="text-sm text-gray-600 font-semibold">Product ID: {item.productId}</p>
                            <p className="text-sm text-gray-600 font-semibold">Quantity: {item.quantity}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{order.totalAmount}</span>
                </div>
            </div> */}

            <Link
                to="/"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl shadow-md transition"
            >
                Go to Home
            </Link>
        </div>
    );
};
