import React from 'react'
import '../Pages/Clients/Home.css'
export const CardDetails = ({ dishName, price, category, id, onAddToCart, image }) => {
    return (
        <card className='mb-2'>
            <img src={`http://localhost:5000/${image}`} alt='food' className='w-[97px] h-[85px] object-center rounded-full' />
            <h3>{dishName}</h3>
            <p>Rs. {price}</p>
            <button className='bg-yellow-300 px-4 h-9 mt-2 shadow-md rounded-md' onClick={() => onAddToCart(category, id, price)}>Add to cart</button>
        </card>
    )
}