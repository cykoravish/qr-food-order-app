import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingCard } from '../../components/LoadingCard';
import PrivateAxios from '../../Services/PrivateAxios';
import { CardDetails } from '../../components/CardDetails';

export const DashBoardPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responce = await PrivateAxios.get('/products');
                setProducts(responce.data.data); // Set fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [])


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
                    <div className='w-[164px] h-[75px] flex flex-col shadow-md  p-2'>
                        <h5 className='text-left'>244</h5>
                        <p>Orders today</p>
                    </div>
                    <div className='w-[164px] h-[75px] flex flex-col shadow-md p-2'>
                        <h5>50</h5>
                        <p>Pending Orders</p>
                    </div>
                </div>
                <div className='flex justify-between mb-4 '>
                    <div className='w-[164px] h-[75px] flex flex-col shadow-md p-2 overflow-y-hidden'>
                        <h5>10</h5>
                        <p>Total Sale</p>
                    </div>
                    <div className='w-[164px] h-[75px] flex flex-col shadow-md p-2'>
                        <h5>5</h5>
                        <p>Total Category</p>
                    </div>
                </div>
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
                                // onAddToCart={() => addToCarts(product)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}


            {/* Admin Actions */}
            <div className='w-[343px] h-[112px] gap-[16px]  fixed bottom-0 overflow-y-hidden'>
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
