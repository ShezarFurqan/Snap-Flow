import React, { useContext, useEffect } from 'react'
import { NavLink, useLocation, Link } from 'react-router'
import { GoHome } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { BiMessageSquare } from "react-icons/bi";
import { BiSolidMessageSquare } from "react-icons/bi";
import { GoHomeFill } from "react-icons/go";
import { IoNotificationsOutline } from "react-icons/io5";
import { RiSettings2Line } from "react-icons/ri";
import { RiSettings2Fill } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";

import { SnapContext } from "../context/SnapContext";

const SideBar = () => {
  const location = useLocation();
  const { userId, setOpen, setCPOpen, unRead, navigate } = useContext(SnapContext);

  return (
    <div className="text-white cursor-pointer outfit-900 flex flex-col h-full justify-between">
      <div>
        <h1 onClick={() => { navigate("/") }} className="mb-8 text-5xl">
          SnapFlow
        </h1>

        <div className="flex flex-col outfit-300">
          {/* Home */}
          <NavLink
            to="/"
            className="flex items-center ml-2 text-2xl 2xl:gap-5 gap-3 px-4 py-6 "
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <GoHomeFill className="text-[#382084] text-3xl" />
                ) : (
                  <GoHome className="text-3xl" />
                )}
                Home
              </>
            )}
          </NavLink>

          {/* Explore */}
          <NavLink
            to="/explore"
            className="flex items-center ml-2 text-2xl 2xl:gap-5 gap-3 px-4 py-6"
          >
            {({ isActive }) => (
              <>
                <IoSearchOutline
                  className={`text-3xl ${isActive ? "text-[#382084]" : ""
                    }`}
                />
                Explore
              </>
            )}
          </NavLink>

          {/* Messages */}
          <NavLink
            to="/messages"
            className="flex items-center ml-2 text-2xl 2xl:gap-5 gap-3 px-4 py-6"
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <BiSolidMessageSquare className="text-[#382084] text-3xl" />
                ) : (
                  <BiMessageSquare className="text-3xl" />
                )}
                Messages
              </>
            )}
          </NavLink>

          {/* Notifications */}
          <Link
            onClick={() => setOpen(true)}
            className="relative flex items-center ml-2 text-2xl 2xl:gap-5 gap-3 px-4 py-6"
          >
            {unRead.length > 0 && <div className='absolute top-4 left-3 bg-red-600 rounded-full outfit-500 text-sm px-2'>{unRead.length}</div>}
            <IoNotificationsOutline className="text-3xl" />
            Notifications
          </Link>

          {/* Profile */}
          <NavLink
            to={`/profile/${userId}`}
            className="flex items-center ml-2 text-2xl 2xl:gap-5 gap-3 px-4 py-6"
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <FaUser className="text-[#382084] text-3xl" />
                ) : (
                  <FaRegUser className="text-3xl" />
                )}
                Profile
              </>
            )}
          </NavLink>

          {/* Settings */}
          <NavLink
            to="/settings"
            className="flex items-center ml-2 text-2xl 2xl:gap-5 gap-3 px-4 py-6"
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <RiSettings2Fill className="text-[#382084] text-3xl" />
                ) : (
                  <RiSettings2Line className="text-3xl" />
                )}
                Settings
              </>
            )}
          </NavLink>
        </div>
      </div>
      {/* Create Post */}
      <Link
        onClick={() => { setCPOpen(true) }}
        className="bg-gradient-to-r rounded-3xl from-[#4F2DB8] to-[#261D5E] outfit-300 w-full px-8 py-4 text-2xl hover:from-[#4F2DB8] hover:to-[#4F2DB8] text-center"
      >
        Create Post
      </Link>
    </div>
  );
};


export default SideBar;
