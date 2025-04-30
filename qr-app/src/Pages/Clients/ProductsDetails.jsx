import React from 'react'
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { addToCart } from '../../Redux/Cart';
import { ReverseButton } from '../../components/Client/ReverseButton';

export const ProductsDetails = () => {
    const location = useLocation();
    const product = location.state.item;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cartItems)
    console.log(cart)
    function handleAddtoCart(product) {
        if (cart._id === product._id) {
            alert('Product Already Added')
        }
        dispatch(addToCart(product));
    }
    return (
        <div className='flex flex-col max-w-[375px] w-[375px] '>
            <div className='flex m-1 text-xl mb-4 mt-3 '>
                <ReverseButton route={'/'} routeName={'Admin'} />
            </div>
            <div className="rounded-2xl mx-1 mt-6 shadow-lg bg-white p-4  max-w-[365px] w-[365px] overflow-scroll">
                {/* Image Section */}
                <div className="flex justify-center items-center">
                    <img
                        src={`${backendUrl}/${product.imageUrl}`}
                        alt="image"
                        className="w-[250px] h-[200px] object-contain my-3 rounded-full shadow-md"
                        style={{ width: '100px', height: '100px' }}
                    />
                </div>

                {/* Product Details */}
                <div className="text-center mt-6 space-y-3 w-full overflow-hidden">
                    <h1 className="text-2xl font-bold text-gray-800">
                        <span className="font-light text-gray-500 mr-2">Name:</span>
                        {product.name}
                    </h1>
                    <p className="text-xl text-gray-700 leading-relaxed ">
                        <span className="font-light text-gray-500 mr-2">Descr:</span>
                        {product.description}
                    </p>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-6 flex justify-center">
                    <button onClick={handleAddtoCart} className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md shadow-md transition-all duration-200">
                        Add to Cart
                    </button>
                </div>
            </div>

        </div >
    )
}
