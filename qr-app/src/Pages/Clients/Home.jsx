import React, { useEffect, useState } from 'react';
import './Home.css';
import { CardItem } from '../../components/CardItem';
import { CardDetails } from '../../components/CardDetails';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, onload } from '../../Redux/Cart/index';
import PrivateAxios from '../../Services/PrivateAxios';

export const Home = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart.cartItems);
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);


    // console.log("fetch", fetchedData)
    // console.log("products", products)

    // Fetching data from backend
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const response = await PrivateAxios.get('/products');

                if (response.status !== 200) {
                    throw new Error('Response is not okay');
                }
                setProducts(response.data.data);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error.message);
                } else {
                    console.error('Fetch error:', error.message);
                }
            }
        };

        fetchData();

        // Cleanup function
        return () => {
            controller.abort();
        };
    }, []);

    const groupedProducts = products.reduce((acc, product) => {
        const categoryName = product.categoryId?.name || 'Uncategorized';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {});


    // Load cart from localStorage
    useEffect(() => {
        const storedCartData = localStorage.getItem('cart');
        if (storedCartData) {
            const parsedCartData = JSON.parse(storedCartData);
            dispatch(onload(parsedCartData)); // Load cart items into Redux state
        }
    }, [dispatch]);

    // Save cart in localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);


    const addToCarts = async (product) => {
        dispatch(addToCart(product));
    };

    // Calculate total quantity in cart
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0); // Fixed the issue with cartItems structure
    console.log('Total quantity:', totalQty);


    const filteredGroupedProducts = Object.keys(groupedProducts).reduce((acc, categoryName) => {
        const filteredProducts = groupedProducts[categoryName].filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.categoryId?.name.toLowerCase().includes(search.toLowerCase())
        );
        if (filteredProducts.length > 0) {
            acc[categoryName] = filteredProducts;
        }
        return acc;
    }, {});


    return (
        <div className='home-container'>
            <div>
                <img src='/assets/image1.jpg' alt='coverimage' width={375} height={250} />
            </div>

            <div className='search-container w-[82% ]'>
                <p>Choose the best dish for you</p>
                <div>
                    <input
                        type='search'
                        name='search'
                        placeholder='Search'
                        onChange={(e) => setSearch(e.target.value)}
                        className='search-input overflow-x-hidden flex-shrink-0'
                    />
                </div>
            </div>

            {search && Object.keys(filteredGroupedProducts).map((categoryName) => (
                <div key={categoryName} className='category-section mb-6'>
                    <div className='flex justify-between px-4 py-2'>
                        <h2 className='text-xl font-semibold'>{categoryName}</h2>
                        <Link to={`/${categoryName}`} state={{ items: filteredGroupedProducts[categoryName] }} className='text-blue-500'>
                            See More
                        </Link>
                    </div>

                    <div className='flex overflow-x-auto h-[200px] space-x-4 px-4'>
                        {filteredGroupedProducts[categoryName].map((product) => (
                            <div key={product._id} className='min-w-[150px] flex-shrink-0'>
                                <CardDetails
                                    id={product._id}
                                    category={product.categoryId?.name}
                                    dishName={product.name}
                                    price={product.price || 100}
                                    qty={product.quantity} // Adjusted to use `quantity`
                                    image={product.imageUrl}
                                    onAddToCart={() => addToCarts(product)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className='food-items'>
                {products.map((product) => (
                    <CardItem name={product.categoryId?.name} imgPath={`http://localhost:5000/${product.imageUrl}`} />
                ))}
            </div>

            {Object.keys(groupedProducts).map((categoryName) => (
                <div key={categoryName} className='category-section mb-6'>
                    <div className='flex justify-between px-4 py-2'>
                        <h2 className='text-xl font-semibold'>{categoryName}</h2>
                        <Link to={`/${categoryName}`} state={{ items: groupedProducts[categoryName] }} className='text-blue-500'>
                            See More
                        </Link>
                    </div>

                    <div className='flex overflow-x-auto h-[200px] space-x-4 px-4'>
                        {groupedProducts[categoryName].map((product) => (
                            <div key={product._id} className='min-w-[150px] flex-shrink-0'>
                                <CardDetails
                                    id={product._id}
                                    category={product.categoryId?.name}
                                    dishName={product.name}
                                    price={product.price || 100}
                                    qty={product.quantity} // Adjusted to use `quantity`
                                    image={product.imageUrl}
                                    onAddToCart={() => addToCarts(product)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            <div className='flex w-[300px] bg-yellow-400 text-center justify-center items-center fixed bottom-2 h-[35px] left-6 rounded-md'>
                <Link className='px-4 flex items-center ' to={'/cart'} state={{ cartItems }}><span><img src="/assets/cart.png" alt="cart" className='w-[18px] h-[18px]' /></span >Orders<span className='font-bold ml-1'> {totalQty}</span></Link>
            </div>
        </div>
    );
};
