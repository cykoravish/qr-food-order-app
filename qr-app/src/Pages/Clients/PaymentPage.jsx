import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import publicAxios from '../../Services/PublicAxios';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, syncCartFromLocalStorage } from '../../Redux/Cart/index';
import { ReverseButton } from '../../components/Client/ReverseButton';
// import { socket } from '../../App';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:5000'); // Or your live URL

export const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const [PaymentMethod, setPaymentMethod] = useState('');
    const [order, setOrder] = useState(null);
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cartItems);
    const navigate = useNavigate();
    // Sync localStorage when the component loads
    useEffect(() => {
        dispatch(syncCartFromLocalStorage());
    }, [dispatch]);

    const totalPrice = Array.isArray(cart)
        ? cart.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0)
        : 0;

    const HandleplaceOrder = async () => {
        try {
            const mappedItems = cart.map(item => ({
                productId: item._id,
                quantity: item.quantity,
                price: item.price
            }));

            const productData = {
                userId,
                items: mappedItems,
                totalAmount: totalPrice,
                paymentMethod: PaymentMethod
            };

            const response = order ? null : await publicAxios.post('/orders/place-order', productData);

            if (response.status === 200 || response.status === 201) {
                setOrder(response.data.order);
                dispatch(clearCart()); // Clear Redux and localStorage
                alert('Order placed successfully!');
                navigate('/order-success')
                // const orderId = response.data.order._id;
                // socket.emit('order-placed', () => orderId);
                // socket.off('order-placed');
            } else {
                console.error("Failed to place order");
            }
        } catch (error) {
            console.error("Error placing order:", error);
        }
    };

    return (
        <div className='mx-2'>
            {/* Back to user details link */}
            <div className='my-2'>
                <ReverseButton route={`/user-info?userId=${userId}`} routeName={'User Details'} />
            </div>

            {/* Payment methods */}
            <div className='mt-4 flex flex-col gap-2 mx-2 items-center'>
                <h2 className='text-2xl text-center'>Payment Methods</h2>

                <div className='flex justify-center w-[90%] h-12 bg-gray-200 text-center mt-4 items-center rounded'>
                    <button onClick={() => setPaymentMethod('Cash')} className='w-full'>Cash</button>
                </div>

                <div className='flex justify-center w-[90%] h-12 bg-green-400 text-center items-center rounded'>
                    <button onClick={() => setPaymentMethod('UPI')} className='w-full'>UPI</button>
                </div>
            </div>

            {/* Bottom action buttons */}
            <div className='flex fixed bottom-1 w-[95%] gap-1 h-12 px-2'>
                <Link
                    to={`/user-info?userId=${userId}`}
                    className='w-[50%] flex items-center justify-center bg-gray-200 rounded'
                >
                    Discard
                </Link>

                {PaymentMethod ? (
                    <button
                        className='w-[50%] flex items-center justify-center bg-amber-300 rounded'
                        onClick={HandleplaceOrder}
                    >
                        Save
                    </button>
                ) : (
                    <div className='w-[50%] flex items-center justify-center bg-red-200 text-sm text-gray-700 rounded'>
                        Select Payment Method
                    </div>
                )}
            </div>
        </div>
    );
};
