import React, { useEffect, useState, useRef, useContext } from "react";
import { X, Volume2, VolumeX, Pause, Play, MoreVertical, LogIn } from "lucide-react";
import axios from "axios";
import { SnapContext } from "../context/SnapContext";
import { toast } from "react-toastify";
import SeenBox from "./SeenBox";

const Story = ({ stories: initialStories, onClose }) => {
  const { backendUrl, token, userId, navigate, currentUser } = useContext(SnapContext);
  const [stories, setStories] = useState(initialStories);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [isMentioned, setIsMentioned] = useState(false);
  const [showSeenBox, setShowSeenBox] = useState(false);
  const videoRef = useRef(null);

  const current = stories[index];
  const duration = current?.duration || 7;

  // Auto progress for images
  useEffect(() => {
    if (!current || current.mediaType === "video") return;
    let startTime = Date.now();
    let initialProgress = progress;
    let interval = null;

    if (!paused) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const newProgress = Math.min(
          initialProgress + (elapsed / duration) * 100,
          100
        );
        setProgress(newProgress);
        if (newProgress >= 100) {
          clearInterval(interval);
          nextStory();
        }
      }, 50);
    }

    return () => clearInterval(interval);
  }, [index, paused]);

  // Handle video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration)
        setProgress((video.currentTime / video.duration) * 100);
    };

    const handleEnded = () => nextStory();

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    if (paused) video.pause();
    else video.play().catch(() => { });
    video.muted = muted;

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [index, paused, muted]);

  const nextStory = () => {
    if (index < stories.length - 1) {
      setProgress(0);
      setIndex((i) => i + 1);
    } else onClose();
  };

  const prevStory = () => {
    if (index > 0) {
      setProgress(0);
      setIndex((i) => i - 1);
    }
  };

  const handleDeleteStory = async () => {
    try {
      await axios.delete(`${backendUrl}/api/story/${current._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = stories.filter((_, i) => i !== index);
      setStories(updated);

      if (updated.length === 0) onClose();
      else if (index >= updated.length) setIndex(updated.length - 1);
      else nextStory();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const AddToStory = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/story/${current._id}/share`, {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })

        if (response.data.success) {
          toast.success("Story Repost Success");
        }
    } catch (error) {
      console.error("Story repost failed:", error);
    }
  }


  useEffect(() => {
    const markAsSeen = async () => {
      if (!current || current.user === userId) return;
      try {
        await axios.post(
          `${backendUrl}/api/story/${current._id}/seen`,
          {},
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } catch (error) {
        console.error(error);
      }
    };
    markAsSeen();
  }, [current, userId, backendUrl]);

  useEffect(() => {
    const mentionedUsers = current.mentions.filter(item => item[0] === currentUser.username);
    if (mentionedUsers.length > 0) {
      setIsMentioned(true)
      console.log(mentionedUsers);

    };

  }, [current, currentUser])


  if (!current) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white transition z-50"
      >
        <X size={26} />
      </button>

      {/* Story Frame */}
      <div className="relative h-full w-auto aspect-[9/16] max-w-[100vw] bg-black overflow-hidden select-none">
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-40">
          {stories.map((_, i) => (
            <div
              key={i}
              className="h-[3px] flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width:
                    i < index ? "100%" : i === index ? `${progress}%` : "0%",
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Top Controls */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <img
              src={current.user.profilepic}
              alt="user"
              className="w-10 h-10 rounded-full border border-white/40"
            />
            <span className="text-white text-sm font-medium">
              {current.user.username}
            </span>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Pause / Play */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPaused((p) => !p);
              }}
              className="text-white/90 hover:text-white transition"
            >
              {paused ? <Play size={18} /> : <Pause size={18} />}
            </button>

            {/* Mute / Unmute */}
            {current.mediaType === "video" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMuted((m) => !m);
                }}
                className="text-white/90 hover:text-white transition"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            )}

            {/* More Options */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((s) => !s);
                }}
                className="text-white/90 hover:text-white transition"
              >
                <MoreVertical size={18} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-6 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-md shadow-md p-3 text-sm">
                  {current?.user?._id === userId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStory();
                        setShowMenu(false);
                      }}
                      className="block px-3 py-1 hover:bg-white/20 rounded w-full text-left"
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="block px-3 py-1 hover:bg-white/20 rounded w-full text-left"
                    onClick={() => {
                      navigate("/profile/" + current?.user?._id);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="block px-3 py-1 hover:bg-white/20 rounded w-full text-left"
                    onClick={() => setShowMenu(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          {current.mediaType === "image" ? (
            <img
              src={current.mediaUrl}
              alt="story"
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <video
              key={current.mediaUrl}
              ref={videoRef}
              src={current.mediaUrl}
              muted={muted}
              autoPlay
              playsInline
              className="w-full h-full object-contain bg-black"
            />
          )}
        </div>


        {current?.user?._id === userId &&
          <div onClick={()=>{setShowSeenBox(true)}} className="absolute z-50 bottom-5 left-0 text-white/90 text-sm bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
            Seen by {current.seenBy?.length || 0}
          </div>
        }

        {showSeenBox && <SeenBox seenList={current.seenBy} setShowSeenBox={setShowSeenBox}/>}

        {isMentioned &&
          <button
            onClick={AddToStory}
            className="absolute z-50 bottom-5 left-1/2 -translate-x-1/2 py-2 px-5 border border-black rounded-xl bg-white text-black text-[15px] font-medium shadow-lg hover:scale-105 transition-transform"
          >
            Add To Story
          </button>}



        {/* Tap Areas */}
        <div
          onClick={prevStory}
          className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
        ></div>
        <div
          onClick={nextStory}
          className="absolute inset-y-0 right-0 w-2/3 z-20 cursor-pointer"
        ></div>
      </div>
    </div>
  );
};

export default Story;
