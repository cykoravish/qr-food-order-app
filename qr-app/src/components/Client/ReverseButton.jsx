import React from 'react'
import { Link } from 'react-router-dom'

export const ReverseButton = ({ route, routeName, css }) => {
    return (
        <Link className={`flex ${css}`} to={`${route}`
        }>
            <img src='/assets/back.png' alt='back' />
            <span> {routeName} </span>
        </Link >
    )
}
