import React from 'react'
import { CardDetailsCate } from '../../components/CardDetailsCate'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { CardDetails } from '../../components/CardDetails';

export const Category = () => {
    const location = useLocation();
    const category = location.pathname.replace(/^\/+/, '')
    const items = location.state.items;

    const dispatch = useDispatch();

    function addToCarts(product) {
        dispatch(addToCarts(product))
    }
    return (
        <div className='burger-container'>
            <div className='item-cards'>
                <Link className='flex' to={'/'}>
                    <img src='/assets/back.png' alt='back' />
                    <span>{category}</span>
                </Link>
            </div>
            <div className='burger-item-list'>
                {items.items.map((product) => <CardDetails
                    id={product._id}
                    category={category}
                    dishName={product.name}
                    price={product.price || 100}
                    qty={product.quantity} // Adjusted to use `quantity`
                    image={product.image}
                    onAddToCart={() => addToCarts(product)}
                />)}

            </div>
        </div>
    )
}
