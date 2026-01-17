import React, { useContext } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { IoSearchOutline, IoNotificationsOutline, IoCreateOutline } from "react-icons/io5";
import { BiMessageSquare } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { RiSettings2Line } from "react-icons/ri";
import { SnapContext } from "../context/SnapContext"; // <-- apna context ka import sahi path se karo

const SmallSideBar = () => {
  const location = useLocation();
  const { userId, navigate, setOpen, setCPOpen, unRead } = useContext(SnapContext);

  return (
    <div className="sticky 2xl:top-8 top-12 h-[calc(100vh-3rem)] justify-between flex flex-col px-2">
      <div>
        {/* Logo */}
        <h1 onClick={() => { navigate("/") }} className="text-white xl:text-[53px] text-[44px] cursor-pointer ml-3 outfit-900">
          SF
        </h1>

        <div className="flex flex-col mt-10 text-white outfit-300">
          {/* Home */}
          <NavLink to="/" className="flex items-center justify-center py-6">
            <GoHome className="2xl:text-[40px] text-3xl" />
          </NavLink>

          {/* Explore */}
          <NavLink to="/explore" className="flex items-center justify-center  py-6">
            <IoSearchOutline className="2xl:text-[40px] text-3xl" />
          </NavLink>

          {/* Messages */}
          <NavLink to="/messages" className="flex items-center justify-center  py-6">
            <BiMessageSquare className="2xl:text-[40px] text-3xl" />
          </NavLink>

          {/* Notifications */}
          <Link
            onClick={() => setOpen(true)}
            className="relative flex items-center ml-2 2xl:text-3xl text-2xl 2xl:gap-5 gap-3 px-4 py-6"
          >
            {unRead.length > 0 && <div className='absolute top-4 left-3 bg-red-600 rounded-full outfit-500 text-sm px-2'>{unRead.length}</div>}

            <IoNotificationsOutline className="2xl:text-[40px] text-3xl" />
          </Link>

          {/* Profile */}
          <NavLink to={`/profile/${userId}`} className="flex items-center justify-center  py-6">
            <FaRegUser className="2xl:text-[40px] text-3xl" />
          </NavLink>

          {/* Settings */}
          <NavLink to="/settings" className="flex items-center justify-center py-6">
            <RiSettings2Line className="2xl:text-[40px] text-3xl" />
          </NavLink>
        </div>
      </div>
      {/* Create Post (Icon only) */}
      <Link
        onClick={() => { setCPOpen(true) }}
        className="flex items-center justify-center mb-8
                     rounded-3xl bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] 
                     w-fit px-6 py-5 hover:from-[#4F2DB8] hover:to-[#4F2DB8]"
      >
        <IoCreateOutline className="2xl:text-[40px] text-3xl text-white" />
      </Link>
    </div>
  );
};

export default SmallSideBar;
