import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PrivateAxios from '../../Services/PrivateAxios';

export const PaymentPage = ({ cart, totalPrice, setOrder }) => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();

    // const handlePlaceOrder = async () => {
    //     try {
    //         const mappedItems = cart.map(item => ({
    //             productId: item.productId?._id,
    //             quantity: item.quantity,
    //             price: item.productId?.price,
    //         }));

    //         const orderData = {
    //             userId,
    //             items: mappedItems,
    //             totalAmount: totalPrice,
    //             paymentMethod
    //         };

    //         const response = await PrivateAxios.post('/orders/place-order', orderData);

    //         if (response.status === 200) {
    //             setOrder(response.data.order);
    //             navigate('/order-success');
    //         } else {
    //             console.error('Order failed');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //     }
    // };

    const handlePlaceOrder = async () => {
        try {
            const mappedItems = cart.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            }));

            const orderData = {
                userId,
                items: mappedItems,
                totalAmount: totalPrice,
            };

            // 1. Create Razorpay Order from backend
            const res = await PrivateAxios.post('/payment/create-order', orderData);
            const razorpayOrder = res.data;

            // 2. Open Razorpay Checkout
            const options = {
                key: 'YOUR_RAZORPAY_KEY_ID', // Get from Razorpay dashboard
                amount: razorpayOrder.amount,
                currency: 'INR',
                name: 'Food Ordering App',
                description: 'Test Payment',
                order_id: razorpayOrder.id,
                handler: async function (response) {
                    // 3. Payment success - call backend to confirm
                    const paymentData = {
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                        userId,
                        paymentMethod: 'UPI',
                        items: mappedItems,
                        totalAmount: totalPrice,
                    };

                    const confirmRes = await PrivateAxios.post('/payment/verify', paymentData);

                    if (confirmRes.status === 200) {
                        setOrder(confirmRes.data.order);
                        navigate('/order-success');
                    }
                },
                theme: { color: '#F37254' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Razorpay Error:", error);
        }
    };


    return (
        <div className="mx-4 my-6">
            <Link to={`/user-info?userId=${userId}`} className="flex items-center gap-2 mb-4 text-blue-600">
                <img src="/assets/back.png" alt="back" className="w-5 h-5" />
                <span>Back to User Details</span>
            </Link>

            <h2 className="text-2xl text-center font-semibold mb-4">Payment Methods</h2>

            <div className="flex flex-col items-center gap-4">
                <div
                    className={`w-[90%] h-12 flex items-center justify-center rounded cursor-pointer
                    ${paymentMethod === 'Cash' ? 'bg-yellow-400' : 'bg-gray-200'}`}
                    onClick={() => setPaymentMethod('Cash')}
                >
                    💵 Cash on Delivery
                </div>

                <div
                    className={`w-[90%] h-12 flex items-center justify-center rounded cursor-pointer
                    ${paymentMethod === 'UPI' ? 'bg-yellow-400' : 'bg-green-400'}`}
                    onClick={() => setPaymentMethod('UPI')}
                >
                    🏦 UPI Payment
                </div>
            </div>

            <div className="fixed bottom-2 w-[95%] flex justify-between gap-2 mx-auto left-0 right-0">
                <div className="w-1/2 py-2 text-center bg-gray-300 rounded">Discard</div>
                <button
                    onClick={handlePlaceOrder}
                    disabled={!paymentMethod}
                    className={`w-1/2 py-2 text-center rounded ${paymentMethod ? 'bg-amber-400' : 'bg-gray-300'}`}
                >
                    Save
                </button>
            </div>
        </div>
    );
};
