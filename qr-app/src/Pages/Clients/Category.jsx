import React, { useEffect, useState } from 'react';
import { CardDetails } from '../../components/CardDetails';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart as addToCartAction } from '../../Redux/Cart/index.js';

export const Category = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [itemArray, setItems] = useState([]);
    const category = location.pathname.replace(/^\/+/, '');

    useEffect(() => {
        const rawItems = location.state?.items;
        const items = Array.isArray(rawItems) ? rawItems : [rawItems];

        const categoryFromPath = location.pathname.replace(/^\/+/, '').toLowerCase();

        const filteredItems = items.filter(
            (item) =>
                item?.categoryId?.name?.trim().toLowerCase() === categoryFromPath
        );

        setItems(filteredItems);
    }, [location]);


    console.log(itemArray)

    function handleAddToCart(product) {
        dispatch(addToCartAction(product));
    }
    console.log(itemArray)
    return (
        <div className='burger-container p-1'>
            <div className='item-cards mb-4'>
                <Link className='flex items-center gap-2 text-lg font-semibold' to={'/'}>
                    <img src='/assets/back.png' alt='back' className='w-6 h-6' />
                    <span className='capitalize'>{category}</span>
                </Link>
            </div>


            <div className='burger-item-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {itemArray.map((product) => (
                    <CardDetails
                        key={product._id}
                        id={product._id}
                        dishName={product.name}
                        description={product.description}
                        price={product.price}
                        image={product.imageUrl}
                        onAddToCart={() => handleAddToCart(product)}
                    />
                ))}
            </div>
        </div>
    );
};
