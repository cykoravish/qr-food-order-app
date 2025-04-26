import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingCard } from '../../components/LoadingCard';
import PrivateAxios from '../../Services/PrivateAxios';
import { CardDetails } from '../../components/CardDetails';
import publicAxios from '../../Services/PublicAxios';
import { BsBoxArrowInDownLeft, BsBoxArrowInUp } from "react-icons/bs";
import { TbCategoryPlus } from "react-icons/tb";
import { MdAttachMoney } from "react-icons/md";
// import { socket } from '../../Services/Socket';
import { StatCard } from '../../components/Admin/StatCard';

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
        // socket.on('updated-order', () => fetchedOrder());
        console.log('dahsborad updateed event ')
        return () => {
            controller.abort()
            // socket.off('updated-order')
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
    }, [])


    // Today ORders
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = AllOrders.filter(order => {
        const orderDate = new Date(order.placedAt).toISOString().split('T')[0];
        return orderDate === today;
    });

    console.log("today", todaysOrders)

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
        <div className='w-full min-w-[375px] ]  '>
            <div>
                <img src='/assets/image1.jpg' alt='logo' className='w-full h-full object-cover min-w-[100%] max-h-[500px]' />
            </div>

            {/* Stats section */}
            <div className='max-w-full h-[400px] min-w-[344px] min-h-[171px] m-4  '>
                <div className='max-w-full h-1/2 flex justify-between mb-4 '>
                    <StatCard name={'Today Orders'} value={todaysOrders} imageName={<BsBoxArrowInUp size={40} />} />
                    <StatCard name={'Pending Orders'} value={pendingOrders} imageName={<BsBoxArrowInDownLeft size={40} />} route={'/admin/pending-orders'} />
                </div>
                <div className='max-w-full h-1/2 flex justify-between mb-4 '>
                    <StatCard name={'Total Sale'} value={AllSales ? AllSales : 0} imageName={<MdAttachMoney size={40} />} route={'/admin/totelsale'} />
                    <StatCard name={'Total Category'} value={AllCategory ? AllCategory : 0} imageName={<TbCategoryPlus size={40} />} />

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
                            <Link to={`/admin/${categoryName}`} state={{ items: groupedProducts[categoryName] }} className='text-blue-500'>
                                See More
                            </Link>
                        </div>

                        <div className='w-full flex overflow-x-auto h-[200px] lg:h-[250px] space-x-4 px-4'>
                            {groupedProducts[categoryName].map((product) => (
                                <div key={product._id} className='w-1/3 min-w-[150px] flex-shrink-0 lg:1/4'>
                                    <CardDetails
                                        key={product._id}
                                        id={product._id}
                                        category={product.categoryId?.name}
                                        dishName={product.name}
                                        price={product.price || 100}
                                        qty={product.quantity} // Adjusted to use `quantity`
                                        image={product.imageUrl}
                                        product={product}
                                        css='lg:w-[250px] lg:h-[250px]'
                                    // onAddToCart={() => addToCarts(product)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }


            {/* Admin Actions */}
            <div className='w-[343px] h-[112px] gap-[16px] lg:w-full overflow-hidden mb-5 '>
                <div className='w-full bg-[#F9D718] m-4 h-[48px] text-center p-2'>
                    <Link to='/admin/createProduct'>Create New Item</Link>
                </div>
                <div className='w-full m-4 h-[48px] text-center p-2 mb-11'>
                    <Link to='/admin/category'>Create New Category</Link>
                </div>
            </div>
        </div >
    );
};
