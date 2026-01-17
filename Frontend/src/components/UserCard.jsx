import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { SnapContext } from '../context/SnapContext'

const UserCard = ({label,username,profilepic,id}) => {

    const { navigate } = useContext(SnapContext)

    return (
        <div className='flex justify-between'>
            <div onClick={()=>{navigate(`/profile/${id}`)}} className='flex items-center cursor-pointer'>
                <div className='w-16 h-16 flex justify-center items-center rounded-full overflow-hidden bg-black'>
                    <img className='w-full h-full object-cover' src={profilepic} />
                </div>
                <div className='ml-2 mb-1'>
                    <p className='text-xl font-bold'>{username ? username : "Profile Name"}</p>
                    <p className='text-[#474858]'>@{username ? username : "ProfileHandle"}</p>
                </div>
            </div>
            <h1 className='mt-4 font-semi-bold text-[#0095F6] hover:text-[#003ef6] cursor-pointer'>{label}</h1>
        </div>
    )
}

export default UserCard
