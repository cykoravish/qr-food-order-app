import React, { useEffect, useState } from 'react';
import { CardDetails } from '../../components/CardDetails';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart as addToCartAction } from '../../Redux/Cart/index.js';
import { ReverseButton } from '../../components/Client/ReverseButton.jsx';

export const Category = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [itemArray, setItems] = useState([]);
    const category = location.pathname.replace(/^\/+/, '');
    console.log('client')

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
            <div className='w-[100%] h-[58px] flex items-center'>
                <ReverseButton route={'/'} routeName={category} />
            </div>
            <div className="burger-item-list mx-auto gap-4 grid sm:flex sm:overflow-x-auto">
                {itemArray.map((product) => (
                    <CardDetails
                        key={product._id}
                        id={product._id}
                        dishName={product.name}
                        description={product.description}
                        price={product.price}
                        image={product.imageUrl}
                        onAddToCart={() => handleAddToCart(product)}
                        product={product} c
                        css={''}
                    />
                ))}
            </div>
        </div>
    );
};
