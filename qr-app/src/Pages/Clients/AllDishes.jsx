import React from 'react'
import { CardDetailsCate } from '../../components/CardDetailsCate'
import { Link, useLocation } from 'react-router-dom'
import { CardDetails } from '../../components/CardDetails';

export const AllDishes = () => {
    const location = useLocation();
    const items = location.state.items;

    return (
        <div className='burger-container'>
            <div className='item-cards'>
                <Link className='flex' to={'/'}>
                    <img src='/assets/back.png' alt='back' />
                    <span>Best Seller </span>
                </Link>
            </div>
            <div className='burger-item-list'>
                <div className='burger-item-list'>
                    {items.map((item) => <CardDetails dishName={item.name} price={item.price} />)}
                </div>

            </div>
        </div>
    )
}
