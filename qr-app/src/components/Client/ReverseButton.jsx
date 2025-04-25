import React from 'react'
import { Link } from 'react-router-dom'

export const ReverseButton = ({ route, routeName }) => {
    return (
        <Link className='flex' to={`${route}`}>
            <img src='/assets/back.png' alt='back' />
            <span> {routeName} </span>
        </Link>
    )
}
