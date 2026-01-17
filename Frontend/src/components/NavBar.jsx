import React, { useContext, useState } from 'react'
import SearchBar from './SearchBar'
import { FaRegBell } from "react-icons/fa6";
import { CiSettings } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { HiOutlineMenu } from "react-icons/hi";
import { SnapContext } from '../context/SnapContext';
import Notification from './Notification';
import ProfileAvatar from './ProfileAvatar';

const NavBar = () => {

    const { navigate, } = useContext(SnapContext)

    return (
        <div >
            <div className='flex justify-between items-center'>
                <h1 onClick={()=>{navigate("/")}}  className="text-white xl:text-[53px] sm:text-[44px] text-4xl cursor-pointer outfit-900 md:hidden">
                    SnapFlow
                </h1>
                <div className='md:block hidden'>
                    <SearchBar />
                </div>
                <ProfileAvatar />
            </div>
            <div className='md:hidden block mt-8'>
                <SearchBar />
            </div>
        </div>
    )
}

export default NavBar
