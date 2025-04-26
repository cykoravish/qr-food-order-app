import React, { useEffect, useState } from 'react';
import './Home.css';
import { CardItem } from '../../components/CardItem';
import { CardDetails } from '../../components/CardDetails';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../Redux/Cart/index';
import PrivateAxios from '../../Services/PrivateAxios';
import EventEmitter from 'events';
import { Bounce, toast } from 'react-toastify';
import { CategoryCard } from '../../components/Client/CategoryCard';
// import { socket } from '../../Services/Socket';

export const Home = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state ? state.cart.cartItems : []);
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const [clickCount, setClickCount] = useState(0);

    // useEffect(() => {
    //     const data = { name: 'gaurav kumar' }
    //     socket.emit('order-updated', (data));
    //     socket.on('order-updated', (data) => {
    //         console.log(data)
    //     })
    // }, [])


    const handleAdminAccess = () => {
        setClickCount(prev => {
            const newCount = prev + 1;

            if (newCount === 10) {
                toast('🦄 Admin Mode Activated', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: 1,
                    theme: "colored",
                    transition: Bounce,
                });
                navigate('/signup')

                return 0;
            }

            return newCount;
        });
    };


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

    const groupedProducts = products?.reduce((acc, product) => {
        const categoryName = product.categoryId?.name || 'Uncategorized';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {});

    const uniqueCategories = [
        ...new Map(products.map(item => [item.categoryId.name, item.categoryId])).values()
    ];


    const addToCarts = async (product) => {
        dispatch(addToCart(product));
    };

    // Calculate total quantity in cart
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0); // Fixed the issue with cartItems structure

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
        <div className=' max-w-[100%] '>
            <button onClick={handleAdminAccess} className='w-full'>
                <img src='/assets/image1.jpg' alt='coverimage' className='w-full h-full object-cover min-w-[100%] max-h-[500px]' />
            </button>

            <div className='search-container min-w-[90% ]'>
                <p>Choose the best dish for you</p>
                <div>
                    <input
                        type='search'
                        name='search'
                        placeholder='Search'
                        onChange={(e) => setSearch(e.target.value)}
                        className='overflow-x-hidden flex-shrink-0 border border-gray-500 min-w-[100%] min-h-12 text-center rounded-xl '
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

            {/* category Items */}
            <CategoryCard uniqueCategories={uniqueCategories} products={products} />

            {Object.keys(groupedProducts).map((categoryName) => (
                <div key={categoryName} className='category-section mb-6'>
                    <div className='flex justify-between px-4 py-2'>
                        <h2 className='text-xl font-semibold'>{categoryName}</h2>
                        <Link to={`/${categoryName}`} state={{ items: groupedProducts[categoryName] }} className='text-blue-500'>
                            See More
                        </Link>
                    </div>

                    <div className='flex overflow-x-auto min-h-[200px]  space-x-4 px-4'>
                        {groupedProducts[categoryName].map((product) => (
                            <div className='min-w-[150px] flex-shrink-0'>
                                {console.log(product)}
                                <CardDetails
                                    key={product._id}
                                    id={product._id}
                                    category={product.categoryId?.name}
                                    dishName={product.name}
                                    price={product.price || 100}
                                    qty={product.quantity} // Adjusted to use `quantity`
                                    image={product.imageUrl}
                                    onAddToCart={() => addToCarts(product)}
                                    product={product}
                                />

                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className='fixed  bottom-0 bg-yellow-300 min-w-[300px] w-[100%] min-h-8 m-auto justify-center text-center items-center rounded-md '>
                <Link className='px-4 flex items-center justify-center text-center ' to={'/cart'} state={{ cartItems }}><span><img src="/assets/cart.png" alt="cart" className='w-[18px] h-[18px]' /></span >Cart<span className='font-bold ml-1 text-center flex justify-center'> {totalQty}</span></Link>
            </div >
        </div >
    );
};
