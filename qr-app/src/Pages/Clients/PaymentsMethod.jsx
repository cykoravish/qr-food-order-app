import React from 'react'
import './Home.css'
import { Link, useSearchParams } from 'react-router-dom'
import './Home.css'
import PrivateAxios from '../../Services/PrivateAxios'
import { useSelector } from 'react-redux'
import { ReverseButton } from '../../components/Client/ReverseButton'
export const PaymentsMethod = () => {
    const cart = useSelector((state) => state.cart.cartItems);
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId')

    // const [order, setOrder] = useState('');
    // console.log("order", order.productId)
    console.log(cart)

    // totel Price
    const totalPrice = cart?.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    ) || 0;

    console.log(totalPrice);


    return (
        <div className='payment-method'>
            <div className='item-cards'>
                <ReverseButton route={`/user-info?userId=${userId}`} routeName={'Payment-Methods'} />
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
                        {cart?.map((item) => (<tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>Rs.{item.price}</td>
                            <td>{(item.price * item.quantity)}</td>
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
            <div className=' shadow-xl rounded-md bg-yellow-500 w-[95%] h-[35px] flex items-center justify-center  md:ml-5 lg:ml-8'>
                <Link className='' to={`/payment?userId=${userId}`} >Pay & Call Waiter</Link>
            </div>


        </div>
    )
}
