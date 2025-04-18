import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingCard } from '../../components/LoadingCard';
import axios from 'axios';

export const DashBoardPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/v1/products', {
                    withCredentials: true
                });
                setProducts(response.data.data); // Set fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [])


    return (
        <div className='max-w-screen-md w-[375px] h-[788px] overflow-x-hidden overflow-y-scroll '>
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

            {products.map((product) => (
                <div key={product._id} className='mb-6'>
                    <div className='flex justify-between m-1 ml-3'>
                        <h5>{product.categoryId?.name}</h5>
                        <Link to='/bestSeller'>See more</Link>
                    </div>
                    <div className='ml-1 mb-4 flex overflow-x-scroll overflow-y-hidden'>
                        <div
                            key={product._id}
                            className='min-w-[140px] w-[140px] h-[169px] ml-2 shadow-sm gap-1 p-1 overflow-y-hidden'
                        >
                            <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} className='w-[97px] h-[78px]' />
                            <h4 className='font-medium'>{product.name || 'Chole Bhature'}</h4>
                            <p className='font-bold'>Rs. {product.price || 150}</p>
                            <button className='w-28 bg-[#F9D718] rounded-md px-2 text-sm h-8 mb-1'>
                                Add to cart
                            </button>
                        </div>
                    </div>
                </div>
            ))
            }

            {/* {products.map(([category, catData]) => ((console.log("category", catData.ma)),



                        {(
                            catData.map((item, index) => (

                            ))
                        )}
                    </div>
                </div>
            ))} */}



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
