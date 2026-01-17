import React from "react";
import { FaHeart } from "react-icons/fa";
import { MdModeComment } from "react-icons/md";
import { FaPlay } from "react-icons/fa";

const PostCard = ({ item }) => {
  // get first media (image or video)
  const firstMedia = item.content?.media?.[0];

  return (
    <div className="relative lg:w-[20vw] lg:h-[20vw] md:w-[24vw] md:h-[24vw] w-[30vw] h-[30vw] group overflow-hidden rounded-md">
      {/* media preview */}
      {firstMedia?.type === "video" ? (
        <video
          src={firstMedia.url}
          className="w-full h-full object-cover"
          muted
          playsInline
        />
      ) : (
        <img
          src={firstMedia?.url}
          alt="post"
          className="w-full h-full object-cover"
        />
      )}

      {/* play icon if video */}
      {firstMedia?.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <FaPlay className="text-white text-4xl drop-shadow-lg" />
        </div>
      )}

      {/* overlay on hover */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex items-center gap-6 text-white text-lg font-semibold">
          {/* Likes */}
          <div className="flex items-center gap-2">
            <FaHeart />
            <span>{item.likes?.length || 0}</span>
          </div>

          {/* Comments */}
          <div className="flex items-center gap-2">
            <MdModeComment />
            <span>{item.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
