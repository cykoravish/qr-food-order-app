import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PrivateAxios from '../../Services/PrivateAxios'


export const Category = () => {
    const [category, setCategory] = useState([]);
    useEffect(() => {
        const controller = new AbortController();
        async function fetched() {
            const responce = await PrivateAxios.get('/products/category', { signal: controller.signal });
            console.log(responce)
            setCategory(responce.data.content);
        };
        fetched();
        return () => {
            controller.abort();
        }
    }, []);


    return (
        <div className='w-full'>
            <div className='flex text-left p-4 '>
                <img src="/assets/back.png" alt="back" className='shadow-sm rounded-full mr-2' />
                <Link to={'/admin'} className='font-semibold'>Category</Link>
            </div>


            <div className='flex flex-wrap ml-3'>
                {category?.map((item) => (
                    <div className='m-2 w-[74px] h-[92px]'>
                        <div className='flex w-[72px] h-[72px] bg-[#D9D9D9] rounded-full items-center justify-center'>
                            <img src={`http://localhost:5000/${item.imageUrl}`} alt=" chole" width={51} height={39} />
                        </div>
                        <p className='text-[11px] flex '>{item.name}</p>
                    </div>
                ))}


            </div>
            <Link to={'/admin/newCategory'} className=' flex bg-[#F9D718] min-w-[343px] lg:w-full h-[48px] m-4 overflow-hidden rounded-md items-center text-center justify-center fixed bottom-0'>
                Add Category
            </Link>
        </div>
    )
}
