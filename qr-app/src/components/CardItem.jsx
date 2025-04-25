import React from 'react'
import { Link } from 'react-router-dom'
import '../Pages/Clients/Home.css'

export const CardItem = ({ name, imgPath }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  return (
    <div className='overscroll-contain min-w-[84px] max-w-[120px] max-h-[120px] gap-3 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-yellow-100 cursor-pointer'>
      <div className='min-w-[84px] max-w-[120px] min-h-[64px] max-h-[120px] overflow-hidden rounded-full bg-white'>
        <img
          src={`${backendUrl}/${imgPath}`}
          alt='category'
          className='object-cover overflow-x-hidden'
          style={{ minWidth: '62px', maxWidth: '100px', minHeight: '84px', maxHeight: '10px' }}
        />
      </div>
      <p className='text-black text-[13px] font-medium truncate w-full text-center'>{name}</p>
    </div>

  )
}
