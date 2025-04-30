import React from 'react'
import { useLocation } from 'react-router-dom'

export const TodayOrderStat = () => {
    const location = useLocation();
    const items = location.state.items;
    console.log(items)
    return (
        <div>TodayOrderStat</div>
    )
}
