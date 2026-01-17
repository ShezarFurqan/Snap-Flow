import React, { useContext, useEffect, useState } from 'react'
import { SnapContext } from '../context/SnapContext'

const ProfileAvatar = () => {

  const { navigate, userId, users } = useContext(SnapContext)
  const [logo,setLogo] = useState(null)

  useEffect(() => {

    if (users && userId) {
      const user = users.find(item => item._id === userId);
      setLogo(user?.profilepic)
      
    }

  }, [users,userId])

  return logo && (
    <div onClick={() => { navigate(`/profile/${userId}`) }} className="flex items-center justify-center">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 xl:w-20 xl:h-20 sm:w-16 sm:h-16 h-[54px] w-[54px] rounded-full p-[3px]"> 
        {/* bg-gradient-to-r from-purple-500 to-indigo-500 */}
        <img
          src={logo}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border-4 border-[#0d0d1a]"
        />
      </div>
    </div>
  )
}

export default ProfileAvatar
