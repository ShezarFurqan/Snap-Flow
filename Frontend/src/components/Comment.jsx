import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import { RxCross2 } from "react-icons/rx"
import { toast } from 'react-toastify'
import axios from 'axios'
import { SnapContext } from '../context/SnapContext'


const Comment = ({ item, id, createdBy }) => {

    const { backendUrl, setUpdatePost, userId } = useContext(SnapContext)

    const deleteComment = async () => {

        try {
            const response = await axios.delete(backendUrl + `/api/post/${id}/comment/${item._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            toast.success(response.data.message)
            setUpdatePost(true)


        } catch (error) {
            toast.error(error.message)
        }
    }

    
    



    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center'>
                <div className='w-11 h-11 flex justify-center items-center rounded-full overflow-hidden bg-black'>
                    <img className='w-full h-full object-cover' src={item.profilepic} />
                </div>
                <div className='ml-2 mb-1'>
                    <p className='text-md font-semibold'>{item.username} <span className='font-normal ml-1'>{item.text}</span></p>
                </div>
            </div>
            {createdBy === userId && <RxCross2 onClick={deleteComment} />}
        </div>
    )
}

export default Comment
