import React from 'react'
import '../Pages/Clients/Home.css'
import { Link } from 'react-router-dom'
export const CardItem = ({ name, imgPath }) => {
  return (
    <div>
      <div className='item-card'>
        <img src={imgPath} alt='catgeory' className='rounded-full w-[62px] h-[62px] ' />
        <Link to={`/${name}`}> <p className='pl-3'>{name}</p></Link>

      </div>
    </div>

  )
}
