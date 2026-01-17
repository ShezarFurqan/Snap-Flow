import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { SnapContext } from '../context/SnapContext';



const PostInput = () => {

  const { setCPOpen, input, setInput } = useContext(SnapContext)

  const handleClick = () => {
    
    if (input.length === 0) {
      toast.error("Post field is required.")
    }else{
      setCPOpen(true)
    }
    
  }


  return (
    <div className="bg-[#111325] border border-white/10 rounded-2xl p-6 text-white w-full">
      {/* Heading */}
      <h2 className="text-xl sm:text-2xl outfit-500 mb-4">
        What’s on Your Mind?
      </h2>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row items-stretch bg-[#0c0e1a] border border-white/10 rounded-xl overflow-hidden w-full gap-2 sm:gap-0">
        <input
          type="text"
          value={input}
          onChange={(e)=>{setInput(e.target.value)}}
          placeholder="Post Title..."
          className="flex-1 bg-transparent text-white px-4 py-4 focus:outline-none text-md sm:text-base"
        />
        <button 
        onClick={handleClick}
        className="bg-gradient-to-r from-[#5e3bf4] to-[#8356EA] px-6 py-4 text-white outfit-400 text-sm sm:text-base rounded-xl sm:rounded-none whitespace-nowrap shrink-0">
          Post
        </button>
      </div>

    </div>
  );
};

export default PostInput;
