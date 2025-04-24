import React from 'react'
import { Link } from 'react-router-dom'
import '../Pages/Clients/Home.css'

export const CardItem = ({ name, imgPath }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  return (
    <div className='overscroll-contain max-w-[84px] gap-3 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-yellow-100 cursor-pointer'>
      <div className='max-w-[84px] h-[64px] overflow-hidden rounded-full bg-white'>
        <img
          src={`${backendUrl}/${imgPath}`}
          alt='category'
          className='object-cover overflow-x-hidden'
          style={{ width: '62px', height: '84px' }}
        />
      </div>
      <p className='text-black text-[13px] font-medium truncate w-full text-center'>{name}</p>
    </div>

  )
}
