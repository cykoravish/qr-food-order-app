import React, { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import publicAxios from '../../Services/PublicAxios';

export const TotalSale = () => {
    const [salesData, setSaledData] = useState([]);
    const [todaySaleItem, setSaleToday] = useState([]);
    const [todayTotelRevenue, setTodayTotelRevenue] = useState(0);

    // Fetch all sales
    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const res = await publicAxios.get('/sales', { signal: controller.signal });
                if (res.status === 200) {
                    setSaledData(res.data.content);
                }
            } catch (error) {
                if (error.code !== 'ERR_CANCELED') {
                    console.error('Error fetching sales data:', error);
                }
            }
        };
        fetchData();
        return () => controller.abort();
    }, []);

    // Calculate total sale
    const totalSale = salesData.reduce((acc, item) => acc + (item.totelRevenue || 0), 0);

    // Filter today's sales
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const todaySales = salesData.filter(item => {
            const orderDate = new Date(item.date).toISOString().split('T')[0];
            return orderDate === today;
        });
        setSaleToday(todaySales);
    }, [salesData]);

    // Calculate today's total revenue
    useEffect(() => {
        const todayRevenue = todaySaleItem.reduce((acc, item) => acc + (item.totelRevenue || 0), 0);
        setTodayTotelRevenue(todayRevenue);
    }, [todaySaleItem]);

    return (
        <div>
            <div className='flex m-1 text-xl mb-4 '>
                <Link to='/admin' className='flex flex-row items-center'>
                    <IoIosArrowBack /><span className='ml-1'>Admin</span>
                </Link>
            </div>

            <div className='w-[345px] h-[250px] mx-3 overflow-hidden'>
                <div className='w-full bg-green-200 h-[50%] mb-2 flex flex-col justify-center'>
                    <h2 className='text-2xl font-semibold text-center'>Total Sale</h2>
                    <h2 className='text-xl font-bold text-center mt-2'>₹ {totalSale || 0}</h2>
                </div>

                <div className='w-full bg-yellow-200 h-[50%] flex flex-col justify-center'>
                    <h2 className='text-2xl font-semibold text-center'>Today's Sale</h2>
                    <h2 className='text-xl font-bold text-center mt-2'>₹ {todayTotelRevenue || 0}</h2>
                </div>
            </div>
        </div>
    );
};
