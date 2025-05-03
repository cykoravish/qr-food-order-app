import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingCard } from '../../components/LoadingCard';
import PrivateAxios from '../../Services/PrivateAxios';
import { CardDetails } from '../../components/CardDetails';
import publicAxios from '../../Services/PublicAxios';
import { BsBoxArrowInDownLeft, BsBoxArrowInUp } from "react-icons/bs";
import { TbCategoryPlus } from "react-icons/tb";
import { MdAttachMoney } from "react-icons/md";
import { StatCard } from '../../components/Admin/StatCard';
import { socket } from '../../Services/Socket';
import DoughnutChart from '../../components/DoughnutChart';

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
        fetchData()
    }, []);

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
        socket.emit('join-admin'); // Tell server "Hey, I'm admin!"

        function handleOrderUpdate(data) {
            console.log('Order update received by Admin:', data);
            fetchedOrder()

        }
        socket.on('placed-order', handleOrderUpdate);

        return () => {
            controller.abort();
            socket.off('placed-order', handleOrderUpdate);
        }
    }, []);

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


    // fetch category
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
    }, []);


    // Today ORders
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = AllOrders.filter(order => {
        const orderDate = new Date(order.placedAt).toISOString().split('T')[0];
        return orderDate === today;
    });

    const categorywise = todaysOrders?.reduce((acc, item) => {
        const orderStatus = item.status;

        if (!acc[orderStatus]) {
            acc[orderStatus] = []
        };

        acc[orderStatus].push(item);
        return acc
    }, {});


    // Pending Orders
    const pendingOrders = AllOrders.filter((order) => order.status === 'pending' || order.status === 'processing');


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
        <div className='w-[100%] min-w-[375px] ]  '>
            <div>

                <img src='/assets/image1.jpg' alt='logo' className='w-full h-full object-cover min-w-[100%] max-h-[250px]' >
                </img>
            </div>

            {/* Stats section */}
            {/* <div className='w-full  min-w-[250px] min-h-[160px] m-4 mt-[25px] gap-4 my-0 mx-auto mb-5'> */}
            <div className='mt-[20px] grid mb-4 grid-cols-2  md:grid-cols-4  sm:gap-6'>
                <StatCard
                    name={'Today Orders'}
                    value={todaysOrders}
                    imageName={<BsBoxArrowInUp size={40} />}
                    route={'/admin/today-orders'}
                    items={categorywise}
                />
                <StatCard
                    name={'Pending Orders'}
                    value={pendingOrders}
                    imageName={<BsBoxArrowInDownLeft size={40} />}
                    route={'/admin/pending-orders'}
                />
                <StatCard
                    name={'Total Sale'}
                    value={AllSales ? AllSales : 0}
                    imageName={<MdAttachMoney size={40} />}
                    route={'/admin/totelsale'}
                />
                <StatCard
                    name={'Total Category'}
                    value={AllCategory ? AllCategory : 0}
                    imageName={<TbCategoryPlus size={40} />}
                    route={'/admin/Category'}
                />
            </div>


            <Link to={'/admin/data-visualize'}>
                <h2 className='flex flex-row text-center bg-green-200 h-9 justify-center items-center'>Graphical Persentation</h2>
            </Link>

            {
                Object.keys(groupedProducts).map((categoryName) => (
                    <div key={categoryName} className='category-section mb-3'>
                        <div className='flex justify-between px-4 py-2'>
                            <h2 className='text-xl font-semibold'>{categoryName}</h2>
                            <Link to={`/admin/${categoryName}`} state={{ items: groupedProducts[categoryName] }} className='text-blue-500'>
                                See More
                            </Link>
                        </div>

                        <div className='w-full flex overflow-x-auto  lg:h-[250px] space-x-4 px-4 gap-3' style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {groupedProducts[categoryName].map((product) => (
                                <div key={product._id} className=' min-w-[150px] flex-shrink-0 lg:1/4'>
                                    <CardDetails
                                        key={product._id}
                                        id={product._id}
                                        category={product.categoryId?.name}
                                        dishName={product.name}
                                        price={product.price || 100}
                                        qty={product.quantity} // Adjusted to use `quantity`
                                        image={product.imageUrl}
                                        product={product}
                                        button={true}
                                        css='lg:w-[250px] lg:h-[200px]'
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }


            {/* Admin Actions */}
            <div className='min-w-[343px] h-[112px] gap-[16px] lg:w-[99%] overflow-hidden mb-5 ml-2 mr-2  '>
                <div className='w-full bg-[#F9D718] h-[48px] text-center p-2'>
                    <Link to='/admin/createProduct'>Create New Item</Link>
                </div>
                <div className='w-full h-[48px] text-center p-2 mb-11'>
                    <Link to='/admin/category'>Create New Category</Link>
                </div>
            </div>
        </div >
    );
};

