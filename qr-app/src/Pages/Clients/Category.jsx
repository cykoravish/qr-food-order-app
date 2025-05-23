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
    const categoryFromPath = decodeURIComponent(location.pathname.replace('/', '').toLowerCase());


    useEffect(() => {
        const rawItems = location.state?.items;
        const items = Array.isArray(rawItems) ? rawItems : [rawItems];

        const categoryFromPath = decodeURIComponent(location.pathname.replace('/', '').toLowerCase());
        console.log(categoryFromPath)
        const filteredItems = items.filter(
            (item) =>
                item?.categoryId?.name?.trim().toLowerCase() === categoryFromPath
        );

        setItems(filteredItems);
    }, [location]);



    function handleAddToCart(product) {
        dispatch(addToCartAction(product));
    };


    return (
        <div className='burger-container p-1'>
            <div className='w-[100%] h-[58px] flex items-center'>
                <ReverseButton route={'/'} routeName={categoryFromPath} />
            </div>
            <div className=" mx-auto gap-4 grid grid-cols-2 sm:flex sm:flex-wrap ">
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
