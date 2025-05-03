import React from 'react'
import { Link } from 'react-router-dom'

export const ReverseButton = ({ route, routeName, css }) => {
    return (
        <Link className={`flex ${css} gap-[4px]   items-center`} to={`${route}`
        }>
            <img src='/assets/back.png' alt='back' className='w-[18px] h-[18px]' />
            <span className='text-base font-medium'> {routeName} </span>
        </Link >
    )
}
