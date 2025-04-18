import React from 'react'
import { Link } from 'react-router-dom'

export const Category = () => {
    return (
        <div>
            <div className='flex text-left p-4 '>
                <img src="/assets/back.png" alt="back" className='shadow-sm rounded-full mr-2' />
                <Link to={'/admin'} className='font-semibold'>Category</Link>
            </div>
            <div className='flex flex-wrap ml-3'>
                <div className='m-2 w-[74px] h-[92px]'>
                    <div className='flex w-[72px] h-[72px] bg-[#D9D9D9] rounded-full items-center justify-center'>
                        <img src="/assets/image 2.png" alt=" chole" width={51} height={39} />
                    </div>
                    <p className='text-[11px] flex '>Chole Bhature</p>
                </div>
                <div className='m-2 w-[74px] h-[92px]'>
                    <div className='flex w-[72px] h-[72px] bg-[#D9D9D9] rounded-full items-center justify-center'>
                        <img src="/assets/image 2.png" alt=" chole" width={51} height={39} />
                    </div>
                    <p className='text-[11px] flex '>Chole Bhature</p>
                </div>
                <div className='m-2 w-[74px] h-[92px]'>
                    <div className='flex w-[72px] h-[72px] bg-[#D9D9D9] rounded-full items-center justify-center'>
                        <img src="/assets/image 2.png" alt=" chole" width={51} height={39} />
                    </div>
                    <p className='text-[11px] flex '>Chole Bhature</p>
                </div>
                <div className='m-2 w-[74px] h-[92px]'>
                    <div className='flex w-[72px] h-[72px] bg-[#D9D9D9] rounded-full items-center justify-center'>
                        <img src="/assets/image 2.png" alt=" chole" width={51} height={39} />
                    </div>
                    <p className='text-[11px] flex '>Chole Bhature</p>
                </div>
                <div className='m-2 w-[74px] h-[92px]'>
                    <div className='flex w-[72px] h-[72px] bg-[#D9D9D9] rounded-full items-center justify-center'>
                        <img src="/assets/image 2.png" alt=" chole" width={51} height={39} />
                    </div>
                    <p className='text-[11px] flex '>Chole Bhature</p>
                </div>

            </div>
            <div className=' flex bg-[#F9D718] w-[343px] h-[48px] m-4 overflow-hidden rounded-md items-center text-center justify-center fixed bottom-0'>
                <Link to={'/admin/newCategory'} >Add Category</Link>
            </div>
        </div>
    )
}
