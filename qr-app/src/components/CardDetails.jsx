import React from 'react';
import '../Pages/Clients/Home.css';
import { Link } from 'react-router-dom';

export const CardDetails = ({ dishName, price, category, id, onAddToCart, image, product, css, button, stock, fixedStock }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const totelStock = fixedStock ? fixedStock : 0;
    console.log(totelStock)
    let stockTag;
    if (totelStock <= (totelStock / 100) * 10) {
        stockTag = 'lowStock';
    } if (totelStock === 0) {
        stockTag = 'OutOfStock';
    } else {
        stockTag = 'InStock';
    }
    console.log('stockName', stockTag);


    return (
        <div className={`min-w-[120px] min-h-[169px] flex flex-col justify-center shadow-md hover:scale-105 ${css}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className='justify-start pl-3 relative'>
                {stock >= 0 && <div className={`${!stock === 0 ? 'hidden' : ''}
                ${stockTag === 'OutOfStock' ? 'bg-red-200' :
                        stockTag === 'lowStock' ? 'bg-amber-300' :
                            'bg-green-700'} absolute right-0 -top-6 z-0  bg-amber-300 rounded-xl px-2 py-1.5 text-xs font-semibold`}>{stockTag}
                    <span className='font-bold'>({stock})</span>
                </div>}
                <Link to={`/product/${id}`} state={{ item: product }} className='flex justify-center'>
                    <img
                        src={`${backendUrl}/${image}`}
                        alt="food"
                        className='w-[80px] h-[80px] min-w-[80px] min-h-[80px] object-cover rounded-full '
                    />
                </Link>
                <h3 className="ml-1 text-sm font-medium min-w-[108] min-h-[23] tracking-tighter">{dishName}</h3>
                <p className="ml-1 font-bold text-xs ">Rs. {price}/-</p>
            </div>
            <button
                className={`${button ? 'hidden' : ''} w-[85%] font-semibold bg-yellow-300 mb-2 rounded-sm h-[35px] justify-center mx-auto mt-1`}
                onClick={() => onAddToCart(category, id, price)}
            >
                Add to cart
            </button>
        </div>
    );
};
