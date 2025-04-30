import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { incrementCart, removeFromCart, } from '../../Redux/Cart';
import { ReverseButton } from '../../components/Client/ReverseButton';

export const CartPage = () => {
    const cartstate = useSelector((state) => state.cart.cartItems);

    // const [cart, setCart] = useState([])
    const dispatch = useDispatch();
    // console.log("cart", cart)


    const total = Array.isArray(cartstate)
        ? cartstate.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0)
        : 0;

    function handleMinusQuanity(id) {
        dispatch(removeFromCart(id))
    }

    function handlePlusQuantity(id) {
        dispatch(incrementCart(id))
    }

    return (

        <div className='order-container'>
            <div className='item-cards flex justify-between'>
                <ReverseButton route={'/'} routeName={'Home'} />

                <Link to={'/'} className='flex'>
                    <img src='/assets/plus.png' alt='plus' width={20} height={20} />
                    Add Item
                </Link>
            </div>
            <div className='min-w-[343px] min-h-[120px] mt-4 m-2'>
                {Array.isArray(cartstate) && cartstate.map((item) => (
                    <div key={item._id} className='order-detils-card flex justify-between items-center p-3 rounded-xl shadow-sm mb-4'>

                        <div className='left text-xl space-y-1'>
                            <h4 className=' text-base font-semibold'>{item.name}</h4>
                            <p className='text-sm text-gray-600 mb-4'>{item.description}</p>
                            <b className='text-black mt-[20px] font-bold'>Rs. {item.price}/-</b>
                        </div>

                        <div className='right flex flex-col items-center gap-2'>
                            <img src='/assets/pizza.png' alt='pizza' className='w-[85px] h-[64px] object-cover rounded-md' />

                            <div className='flex items-center justify-between w-[120px] h-[32px] rounded-md mt-6 bg-yellow-300 mr-2'>
                                <button onClick={() => handleMinusQuanity(item._id)} className="p-1">
                                    <img src='/assets/minus.png' alt='minus' className="w-4 h-4 object-cover" />
                                </button>

                                <span className='text-base font-semibold'>{item.quantity || item.qty}</span>

                                <button onClick={() => handlePlusQuantity(item._id)} className="p-1">
                                    <img src='/assets/plus.png' alt='plus' className="w-4 h-4 object-cover" />
                                </button>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

            <div className='' >
                <div className='order-calc'>
                    <div>
                        <p>SubTotel</p>
                        <b>{total}</b>
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
                        <b>Rs. {total}</b>
                    </div>
                </div>
                <Link to={`/user-info`} className='bg-yellow-300 h-[40px] rounded-sm mx-auto my-0 w-[95%] items-center flex justify-center mr-2' >Place Order</Link >
            </div>

        </div >
    )
}
