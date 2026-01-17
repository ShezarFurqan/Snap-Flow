import React, { useContext, useState, useEffect, useRef } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import { BiCommentDetail } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { formatDistanceToNow } from "date-fns";
import { SnapContext } from "../context/SnapContext";

const FeedCard = ({ item, onClick }) => {
  const { navigate, Like, userId } = useContext(SnapContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const media = item.postData?.content?.media || [];
  const currentFile = media[currentIndex];
  const fileUrl = typeof currentFile === "string" ? currentFile : currentFile?.url;
  const fileType =
    typeof currentFile === "string"
      ? currentFile.split(".").pop()
      : currentFile?.type;

  const isVideo =
    fileType?.includes("mp4") ||
    fileType?.includes("webm") ||
    fileType?.includes("video");

  const nextMedia = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    const videoEl = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.querySelectorAll("video").forEach((v) => {
              if (v !== videoEl) v.pause();
            });
            videoEl.play().catch(() => { });
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(videoEl);

    return () => observer.disconnect();
  }, [isVideo, currentIndex]);

  useEffect(() => {
    if (videoRef.current && isVideo) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted, isVideo]);

  return (
    <div
      onClick={onClick}
      className="bg-[#111325] border border-white/10 rounded-2xl p-4 sm:p-6 text-white w-full max-w-full 
  xl:w-[37vw] 2xl:w-[38vw] outfit-300"
    >

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={item.userData.profilepic}
            alt="profile"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/profile/" + item.userData._id);
            }}
          />
          <div className="flex flex-col leading-5 sm:leading-4">
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigate("/profile/" + item.userData._id);
              }}
              className="text-lg sm:text-[22px] outfit-400 cursor-pointer"
            >
              {item.userData.username}
            </span>
            <span className="text-sm sm:text-xl outfit-300 text-white/50">
              {formatDistanceToNow(new Date(item.postData?.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <BsThreeDots className="text-2xl sm:text-3xl cursor-pointer text-white/70" />
      </div>

      {/* Post Text */}
      {item.postData.content.text && (
        <p className="mt-3 outfit-400 text-base sm:text-2xl text-white">
          {item.postData.content.text}
        </p>
      )}

      {/* Media Section */}
      {media.length > 0 && (
        <div className="mt-3 rounded-xl overflow-hidden w-full aspect-video relative">
          {isVideo ? (
            <video
              ref={videoRef}
              src={fileUrl}
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={fileUrl}
              alt="post"
              className="w-full h-full object-cover object-center"
            />
          )}

          {/* Prev / Next Buttons */}
          {media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
              >
                <IoIosArrowBack className="text-xl" />
              </button>
              <button
                onClick={nextMedia}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full"
              >
                <IoIosArrowForward className="text-xl" />
              </button>
            </>
          )}

          {/* Mute / Unmute */}
          {isVideo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted((prev) => !prev);
              }}
              className="absolute bottom-3 right-3 bg-black/40 hover:bg-black/70 p-2 rounded-full"
            >
              {isMuted ? (
                <FaVolumeMute className="text-white text-xl" />
              ) : (
                <FaVolumeUp className="text-white text-xl" />
              )}
            </button>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center text-center text-lg sm:text-3xl gap-6 sm:gap-10 mt-3 text-white/70">
        <div
          className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            Like(item?.postData?._id);
          }}
        >
          {item?.postData?.likes.includes(userId) ? (
            <FaHeart className="lg:w-7 lg:h-7 w-6 h-6 text-[#261D5E]" />
          ) : (
            <FaRegHeart className="lg:w-7 lg:h-7 w-6 h-6 text-[#261D5E]" />
          )}
          <span className="text-[#464c8c] text-sm sm:text-base">
            {item.postData.likes.length}
          </span>
        </div>

        <div className="flex items-center text-[#464c8c] gap-2 sm:gap-3 cursor-pointer hover:text-white">
          <BiCommentDetail className="text-lg sm:text-3xl" />
          <span className="text-sm sm:text-base">
            {item.postData.comments.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
