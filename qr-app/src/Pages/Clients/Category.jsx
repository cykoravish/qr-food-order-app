import React, { useEffect, useState } from 'react';
import { CardDetails } from '../../components/CardDetails';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart as addToCartAction } from '../../Redux/Cart/index.js';
import { ReverseButton } from '../../components/Client/ReverseButton.jsx';
import getCookies from '../../Services/ProtectedRoutes.jsx';

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

    const token = getCookies('token');
    console.log(token, 'token')
    return (
        <div className='burger-container p-1'>
            <div className='my-2 ml-2 '>
                {token ? <ReverseButton route={'/admin'} routeName={category} /> : <ReverseButton route={'/'} routeName={category} />}
            </div>
            <div className='burger-item-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7'>
                {itemArray.map((product) => (
                    <CardDetails
                        key={product._id}
                        id={product._id}
                        dishName={product.name}
                        description={product.description}
                        price={product.price}
                        image={product.imageUrl}
                        onAddToCart={() => handleAddToCart(product)}
                        product={product}
                    />
                ))}
            </div>
        </div>
    );
};
