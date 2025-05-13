import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

export const ReverseButton = ({ route, routeName, css }) => {
  return (
    <Link
      className={`flex ${css} gap-[4px] items-center justify-start w-[98%]`}
      to={`${route}`}
    >
      <span className="w-[18px] h-[18px]">
        <IoIosArrowBack />
      </span>
      <span className="text-base font-medium"> {routeName} </span>
    </Link>
  );
};
