import React from 'react'
import { Link } from 'react-router-dom'
import '../Pages/Clients/Home.css'

export const CardItem = ({ name, imgPath }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  return (
    <div className='flex flex-col  '  >
      {/* <div className='flex-col' >
        <img
          src={`${backendUrl}/${imgPath}`}
          alt='category'
          className='w-[62px] h-[62px] min-w-[62px] min-h-[62px] object-cover rounded-full'
        />
      </div> */}


      <div className='icCard flex-col w-[62px] h-[62px] bg-[#D9D9D9] rounded-full my-auto mx-0' >
        <img
          src={`${backendUrl}/${imgPath}`}
          alt='category'
          className='w-[51px] h-[39px]  shadow-2xl shadow-gray-600 object-center rounded-full'
        />
      </div>

      <p className='text-black text-[13px] font-medium truncate w-full text-center'>{name}</p>
    </div>

  )
}
