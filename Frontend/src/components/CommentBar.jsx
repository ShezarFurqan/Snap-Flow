import { X } from 'lucide-react'
import React from 'react'

const CommentBar = ({ comments, setNewComment, newComment, handleComment, setShowCommentBar, handleDeleteComment }) => {
  return (
    <div className={`absolute h-fit w-full  bg-[#0D0F1E] bottom-0 p-3 pt-6 rounded-xl border-t-[#8c8e9c52] border-[0.3px] lg:hidden`}>
      <div className='flex justify-between items-center text-white'>
        <h1 className='outfit-500 text-white text-3xl'>Comments {comments?.length}</h1>
        <X onClick={() => { setShowCommentBar(false) }} />
      </div>
      <div className="flex flex-col gap-6 mt-4 pl-1 pr-10 h-96 overflow-y-auto custom-scrollbar ">
        {comments.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-white">
            <div className="flex items-start gap-2 min-w-0">
              <img src={item?.profilepic} className="w-10 h-10 rounded-full object-cover flex-shrink-0" alt="profile" />
              <div className="flex flex-col min-w-0">
                <h1 className="text-sm sm:text-base lg:text-[16px] text-white outfit-600 truncate max-w-[200px]">{item?.username}</h1>
                <h2 className="text-white outfit-300 text-sm sm:text-[15px] lg:text-[16px] break-words whitespace-normal leading-snug">{item?.text}</h2>
              </div>
            </div>
            <X onClick={() => { handleDeleteComment(undefined, item._id) }} className="w-4 h-4" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between  bg-[#0D0F1E] lg:pl-3 pl-2 rounded-2xl w-full border-[#8c8e9c52] border-[0.3px] mt-5">
        <div className="flex items-center space-x-2 flex-1">

          <input
            value={newComment}
            onChange={(e) => { setNewComment(e.target.value) }}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleComment(postData._id);
            }}
            type="text"
            placeholder="Add a comment..."
            className="bg-transparent text-white lg:text-[15px] text-[12px] focus:outline-none w-full placeholder-gray-400"
          />
        </div>
        <button onClick={() => { handleComment() }} className="transition bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] outfit-300 hover:from-[#261D5E] hover:to-[#4F2DB8] lg:px-8 px-6 lg:py-4 py-4 rounded-2xl  text-white lg:text-[20px] text-[15px] font-medium">
          Post
        </button>
      </div>
    </div>
  )
}

export default CommentBar
