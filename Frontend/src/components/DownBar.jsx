// DownBar.jsx
import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { BiMessageSquare, BiSolidMessageSquare } from "react-icons/bi";
import { RiSettings2Line, RiSettings2Fill } from "react-icons/ri";
import { IoNotificationsOutline } from "react-icons/io5";
import { SnapContext } from "../context/SnapContext";

const DownBar = () => {
  const { setOpen, unRead } = useContext(SnapContext);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <nav className="mx-auto max-w-3xl">
        <ul className="grid grid-cols-5 bg-[#0C0C1A] border-t border-white/10">
          {/* Home */}
          <li className="flex justify-center">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                [
                  "flex items-center justify-center p-4 transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] rounded-xl text-white"
                    : "text-white/70",
                ].join(" ")
              }
            >
              {({ isActive }) =>
                isActive ? (
                  <GoHomeFill className="text-2xl" />
                ) : (
                  <GoHome className="text-2xl" />
                )
              }
            </NavLink>
          </li>

          {/* Explore */}
          <li className="flex justify-center">
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                [
                  "flex items-center justify-center p-4 transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] rounded-xl text-white"
                    : "text-white/70",
                ].join(" ")
              }
            >
              <IoSearchOutline className="text-2xl" />
            </NavLink>
          </li>

          {/* Messages */}
          <li className="flex justify-center">
            <NavLink
              to="/messages"
              className={({ isActive }) =>
                [
                  "flex items-center justify-center p-4 transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] rounded-xl text-white"
                    : "text-white/70",
                ].join(" ")
              }
            >
              {({ isActive }) =>
                isActive ? (
                  <BiSolidMessageSquare className="text-2xl" />
                ) : (
                  <BiMessageSquare className="text-2xl" />
                )
              }
            </NavLink>
          </li>

          {/* Notifications (Link not NavLink) */}
          <li className="flex justify-center">
            <Link
              onClick={() => setOpen(true)}
              className="relative flex items-center justify-center p-4 text-white/70 hover:text-white transition-all duration-200"
            >
              {unRead.length > 0 && <div className='absolute top-3 left-3 bg-red-600 rounded-full outfit-500 text-[10px] px-2'>{unRead.length}</div>}

              <IoNotificationsOutline className="text-2xl" />
            </Link>
          </li>

          {/* Settings */}
          <li className="flex justify-center">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                [
                  "flex items-center justify-center p-4 transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] rounded-xl text-white"
                    : "text-white/70",
                ].join(" ")
              }
            >
              {({ isActive }) =>
                isActive ? (
                  <RiSettings2Fill className="text-2xl" />
                ) : (
                  <RiSettings2Line className="text-2xl" />
                )
              }
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DownBar;
