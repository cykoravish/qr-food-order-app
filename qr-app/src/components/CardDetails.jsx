import React from 'react'
import '../Pages/Clients/Home.css'
import { Link } from 'react-router-dom';
export const CardDetails = ({ dishName, price, category, id, onAddToCart, image, product }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    return (
        <div className=' max-w-[100px] flex flex-col justify-center shadow-md hover:bg-amber-500'>
            <Link to={`/product/${product._id}`} state={{ item: product }}>
                <img src={`${backendUrl}/${image}`} alt='food' className='w-[97px] h-[85px] object-center rounded-full' />
            </Link>
            <h3 className='ml-1'>{dishName}</h3>
            <p className='ml-1'>Rs. {price}</p>
            <button className='bg-yellow-300 max-w-[70px] px-1 h-10 flex justify-center items-center rounded-md mt-2' onClick={() => onAddToCart(category, id, price)}>Add to cart</button>
        </div>

    )
}
