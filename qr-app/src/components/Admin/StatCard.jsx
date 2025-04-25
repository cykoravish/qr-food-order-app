import React from 'react'
import { BsBoxArrowInUp } from 'react-icons/bs'
import { Link } from 'react-router-dom'

export const StatCard = ({ name, value, imageName, route }) => {
    return (
        <div className="w-1/2 min-w-[164px] h-full min-h-[75px] flex flex-col shadow-md p-2 relative hover:scale-110 transition duration-300">
            <Link to={route} className="min-w-[164px] w-full h-full relative block">

                {/* Image at Top-Right */}
                <p className="absolute top-2 right-2 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain">{imageName}</p>

                {/* Count */}
                <div className="h-3/4 ml-[40px] flex flex-row gap-8 justify-between items-center text-xl relative">
                    <span className="w-28 h-2/3 rounded-md text-6xl font-bold text-start">
                        {value.length}
                    </span>
                </div>

                {/* Name at Bottom Center */}
                <p className="text-2xl lg:text-5xl text-center absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    {name}
                </p>
            </Link>
        </div>

    )
}
