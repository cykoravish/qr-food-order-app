import React, { useEffect, useState } from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import './Home.css'
import axios from 'axios'
export const PaymentsMethod = () => {
    const [cart, setCart] = useState([]);
    const [order, setOrder] = useState('');
    useEffect(() => {
        async function fetchOrders() {
            try {
                const responce = await axios.get('http://localhost:5000/api/v1/carts', { withCredentials: true });
                console.log(responce)
                if (responce) {
                    setCart(responce.data.data)
                }
            } catch (error) {
                throw new Error({ message: 'Responce failed', error })
            }
        }
        fetchOrders();
    }, []);


    useEffect(() => {

    }, [])
    const totalPrice = cart?.items?.reduce(
        (acc, item) => acc + item.productId.price * item.quantity,
        0
    ) || 0;


    const mappedItems = cart.items?.map((item) => ({
        productId: item.productId?._id,
        quantity: item.quantity,
        price: item.productId?.price
    }));
    const productData = {
        items: mappedItems,
        totalAmount: totalPrice,
    }
    console.log(mappedItems)
    async function handleCartData() {
        try {
            const responce = await axios.post('http://localhost:5000/api/v1/orders/place-order/', productData, { withCredentials: true });
            console.log("responcw", responce.data.order._id)
            if (responce.status === 201) {
                setOrder(responce.data.order)
                alert("🛒 Order placed successfully!");
            }
        } catch (error) {
            throw new Error({ message: 'responce failed', error })
        }
    }

    return (
        <div className='payment-method'>
            <div className='item-cards'>
                <Link className='flex' to={'/cart'}>
                    <img src='/assets/back.png' alt='back' />
                    <span>Payment-Methods </span>
                </Link>
            </div>
            <div className="amount">
                <p>Totel Amount</p>
                <b>Rs.{totalPrice}</b>/
                <p>Hundred Rupees</p>
            </div>
            <div className="order-details">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <td>Order-item</td>
                            <td>QTY</td>
                            <td>Price</td>
                            <td>Value</td>
                        </tr>
                    </thead>
                    <tbody>
                        {cart?.items?.map((item) => (<tr key={item.productId?._id}>
                            <td>{item.productId.name}</td>
                            <td>{item.quantity}</td>
                            <td>Rs.{item.productId.price}</td>
                            <td>{(item.productId.price * item.quantity)}</td>
                        </tr>))}



                    </tbody>
                </table>
            </div>
            <div className="payment-details mt-3">
                <div className='order-calc'>
                    <div>
                        <p>SubTotel</p>
                        <b>{totalPrice}</b>
                    </div>
                    <div>
                        <p>Discount</p>
                        <b>0%</b>
                    </div>
                    <div>
                        <p>Texex</p>
                        <b>0%</b>
                    </div>
                    <div>
                        <p>Totel</p>
                        <b>Rs. {totalPrice}</b>
                    </div>
                </div>
            </div>
            <div className=' shadow-xl rounded-md bg-yellow-500 w-[90%] h-[35px] flex items-center justify-center  ml-5'>
                <Link className='' to={`/order-success/${order._id}`} state={{ order: order }} onClick={handleCartData}>Call Waiter</Link>
            </div>


        </div>
    )
}
