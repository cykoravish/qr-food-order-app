import React from 'react'
import './Home.css'
import { Link, useLocation } from 'react-router-dom'
import { CardDetailsCate } from '../../components/CardDetailsCate'
export const Burger = () => {
    const location = useLocation();
    const items = location.state.items;

    return (
        <div className='burger-container'>
            <div className='item-cards'>
                <Link className='flex' to={'/'}>
                    <img src='/assets/back.png' alt='back' />
                    <span>Burger </span>
                </Link>
            </div>
            <div className='burger-item-list'>
                {items.map((item) => <CardDetailsCate dishName={item.name} price={item.price} />)}
            </div>
        </div>
    )
}
