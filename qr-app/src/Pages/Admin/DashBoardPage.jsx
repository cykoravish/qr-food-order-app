import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingCard } from '../../components/LoadingCard';
import PrivateAxios from '../../Services/PrivateAxios';
import { CardDetails } from '../../components/CardDetails';
import publicAxios from '../../Services/PublicAxios';
import { BsBoxArrowInDownLeft, BsBoxArrowInUp } from "react-icons/bs";
import { TbCategoryPlus } from "react-icons/tb";
import { MdAttachMoney } from "react-icons/md";

export const DashBoardPage = () => {
    const [products, setProducts] = useState([]);
    const [AllOrders, setAllOrders] = useState([]);
    const [AllSales, setAllSales] = useState([]);
    const [AllCategory, setAllCategory] = useState([]);


    // fetch All Products
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responce = await PrivateAxios.get('/products');
                if (responce.status !== 200) {
                    throw new Error({ message: 'responce failed' })
                }
                setProducts(responce.data.data); // Set fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [])


    // Fetch All orders
    useEffect(() => {
        const controller = new AbortController();
        const fetchedOrder = async () => {
            const responce = await publicAxios.get('/orders/orders', { signal: controller.signal });
            if (responce.status !== 200) {
                throw new Error({ message: 'responce failed' })
            };
            setAllOrders(responce.data.content)
        };
        fetchedOrder();
        return () => {
            controller.abort()
        }
    }, []);
    console.log(AllOrders);

    // Fetch sale
    useEffect(() => {
        const controller = new AbortController();
        const fetchedOrder = async () => {
            const responce = await publicAxios.get('/sales', { signal: controller.signal });
            if (responce.status !== 200) {
                throw new Error({ message: 'responce failed' })
            };
            setAllSales(responce.data.content)
        };
        fetchedOrder();
        return () => {
            controller.abort()
        }
    }, []);
    console.log(AllSales)

    useEffect(() => {
        const controller = new AbortController();
        const fetchedOrder = async () => {
            const responce = await publicAxios.get('/products/category', { signal: controller.signal });
            if (responce.status !== 200) {
                throw new Error({ message: 'responce failed' })
            };
            setAllCategory(responce.data.content)
        };
        fetchedOrder();
        return () => {
            controller.abort()
        }
    }, [])


    // Today ORders
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = AllOrders.filter(order => {
        const orderDate = new Date(order.placedAt).toISOString().split('T')[0];
        return orderDate === today;
    });

    // Pending Orders
    const pendingOrders = AllOrders.filter((order) => order.status === 'pending');


    // set deta According category
    const groupedProducts = products.reduce((acc, product) => {
        const categoryName = product.categoryId?.name || 'Uncategorized';
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(product);
        return acc;
    }, {});

    return (
        <div className='max-w-screen-md w-[375px] h-auto] overflow-x-hidden overflow-y-scroll '>
            <div>
                <img src='/assets/image1.jpg' alt='logo' />
            </div>

            {/* Stats section */}
            <div className='w-[344px] h-[171px] m-4 overflow-x-hidden overflow-y-hidden '>
                <div className='flex justify-between mb-4'>
                    <div className='w-[164px] h-[75px] flex flex-col shadow-md  p-2 '>
                        <Link>
                            <div className='flex flex-row gap-24 justify-center text-center items-center text-xl'>{todaysOrders.length}<span><BsBoxArrowInUp size={25} /></span> </div>

                            <p>Orders today</p>


                        </Link>
                    </div>
                    <div className='w-[164px] h-[75px] flex flex-col shadow-md p-2'>
                        <Link to={'/admin/pending-orders'}>
                            <div className='flex flex-row gap-24 justify-center text-center items-center text-xl'>{pendingOrders.length}<span><BsBoxArrowInDownLeft size={25} /></span></div>
                            <p>Pending Orders</p>
                        </Link>
                    </div>
                </div>
                <div className='flex justify-between mb-4 '>
                    <div className='w-[164px] h-[75px] flex flex-col shadow-md p-2 overflow-y-hidden'>
                        <Link to={'/admin/totelsale'}>
                            <div className='flex flex-row gap-24 justify-center text-center items-center text-xl'>{AllSales ? AllSales.length : 0}<span><MdAttachMoney size={25} /></span></div>
                            <p>Total Sale</p>
                        </Link>
                    </div>
                    <div className='w-[164px] h-[75px] flex flex-col shadow-md p-2'>
                        <Link>
                            <div className='flex flex-row gap-24 justify-center text-center items-center text-xl'>{AllCategory ? AllCategory.length : 0}<span><TbCategoryPlus size={25} /></span></div>
                            <p>Total Category</p>
                        </Link>
                    </div>
                </div>
            </div>
            <Link to={'/admin/data-visualize'}>
                <h2 className='flex flex-row text-center bg-green-200 h-9 justify-center items-center'>Graphical Persentation</h2>
            </Link>

            {
                Object.keys(groupedProducts).map((categoryName) => (
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
                                    // onAddToCart={() => addToCarts(product)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }


            {/* Admin Actions */}
            <div className='w-[343px] h-[112px] gap-[16px]    overflow-hidden mb-5 '>
                <div className='w-full bg-[#F9D718] m-4 h-[48px] text-center p-2'>
                    <Link to='/admin/createProduct'>Create New Item</Link>
                </div>
                <div className='w-full m-4 h-[48px] text-center p-2'>
                    <Link to='/admin/category'>Create New Category</Link>
                </div>
            </div>
        </div >
    );
};
