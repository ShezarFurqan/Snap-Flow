import React, { useState, useContext, useEffect } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BiCommentDetail } from "react-icons/bi";
import { X } from "lucide-react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { SnapContext } from "../context/SnapContext";
import { toast } from "react-toastify";
import CommentBar from "./CommentBar";
import { VscUnmute } from "react-icons/vsc";
import { VscMute } from "react-icons/vsc";
import { BsThreeDotsVertical, BsThreeDots } from "react-icons/bs";


const Post = ({ postData, userData }) => {
  const {
    setVisible,
    backendUrl,
    currentUser,
    users,
    userId,
    setUpdatePost,
    token,
  } = useContext(SnapContext);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showCommentBar, setShowCommentBar] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showOptions, setShowOptions] = useState(false);


  // Check if liked
  useEffect(() => {
    const like = postData?.likes.find((item) => item === userId);
    setIsLike(!!like);
  }, [postData, userId]);

  // Handle like
  const handleLike = async () => {
    if (isLike) {
      postData.likes = postData.likes.filter((id) => id !== userId);
    } else {
      postData.likes.push(userId);
    }
    setIsLike(!isLike);

    try {
      await axios.put(
        `${backendUrl}/api/post/${postData._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      toast.error("Failed to like post");
      setUpdatePost(true);
    }
  };

  // Handle comment
  const handleComment = async (postId) => {
    const tempComment = {
      _id: Date.now().toString(),
      text: newComment,
      user: currentUser._id,
      username: currentUser.username,
      profilepic: currentUser.profilepic,
    };

    setComments([...comments, tempComment]);
    setNewComment("");

    try {
      const response = await axios.post(
        `${backendUrl}/api/post/${postId}/comment`,
        { comment: tempComment.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setUpdatePost(true);
      }
    } catch (error) {
      setComments((prev) => prev.filter((c) => c._id !== tempComment._id));
    }
  };

  // Map comments with user info
  useEffect(() => {
    if (postData && users.length) {
      const updatedComments = postData.comments.map((element) => {
        const user = users.find((item) => item._id === element.user);
        return {
          ...element,
          profilepic: user ? user.profilepic : null,
          username: user ? user.username : "Unknown",
        };
      });
      setComments(updatedComments);
    }
  }, [postData, users]);

  // Delete comment
  const handleDeleteComment = async (postId, commentId) => {
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    try {
      await axios.delete(`${backendUrl}/api/post/${postId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUpdatePost(true);
    } catch (error) {
      setUpdatePost(true);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`${backendUrl}/api/post/delete/${postData._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUpdatePost(true);
      toast.success("Post Deleted")
      setVisible(false)
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  if (!postData || !userData || !currentUser) return null;

  return (
    <div className="absolute inset-0 flex justify-center items-center bg-black/50">
      <div className="2xl:w-[90vw] 2xl:h-[87vh] w-full h-full border-[#8c8e9c52] lg:rounded-3xl rounded-xl border-[0.3px] bg-[#0D0F1E] flex lg:flex-row flex-col overflow-y-auto">

        {/* Mobile Header */}
        <div className="w-full h-fit lg:hidden py-2 px-4 flex justify-between items-center border-b border-[#8c8e9c52]">
          <div className="flex items-center gap-3 min-w-0">
            <img src={userData[0]} className="w-10 h-10 rounded-full object-cover" alt="profile" />
            <h1 className="text-sm sm:text-base text-white outfit-400 truncate max-w-[150px]">{userData[1]}</h1>
          </div>


          <button onClick={() => setVisible(false)} className="p-2 rounded-full hover:bg-white/10 transition">
            <X className="text-white w-6 h-6" />
          </button>
        </div>


        {/* Media Viewer */}
        <div className="relative lg:w-[70vw] w-full flex-1 bg-black flex justify-center items-center overflow-hidden">
          <div className={`absolute top-3 sm:left-4 left-2 ${postData?.postedBy === userId ? "" : "hidden"} pointer-events-auto z-50`}>
            <button
              onClick={() => setShowOptions((prev) => !prev)}
              className="p-2 rounded-full hover:bg-white/10 transition text-white relative z-[60]"
            >
              <BsThreeDots className="w-7 h-7" />
            </button>

            {showOptions && (
              <div className="absolute mt-2 left-0 bg-[#0D0F1E] border border-[#8c8e9c52] rounded-2xl shadow-lg p-3 w-36 flex flex-col z-[70] backdrop-blur-md animate-fadeIn">
                <button onClick={handleDeletePost} className="text-white text-sm py-2 px-3 rounded-lg hover:bg-white/10 transition text-left">Delete</button>
                <button onClick={() => setShowOptions(false)} className="text-[#8c8e9c] text-sm py-2 px-3 rounded-lg hover:bg-white/10 transition text-left">Cancel</button>
              </div>
            )}
          </div>
          {postData?.content?.media?.length > 0 ? (
            <>
              <div className="w-full h-full flex justify-center items-center">
                {postData.content.media[currentIndex]?.type === "video" ? (
                  <div className="relative w-full h-full flex justify-center items-center">
                    <video
                      key={postData.content.media[currentIndex]?.url}
                      src={postData.content.media[currentIndex]?.url}
                      muted={isMuted}
                      autoPlay
                      loop
                      playsInline
                      className="max-h-full lg:h-full object-contain rounded-lg"
                    />
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="absolute sm:bottom-5 bottom-4 right-5 bg-black/50 hover:bg-black/70 text-white text-xl px-3 py-1 rounded-full transition"
                    >
                      {isMuted ? <VscMute /> : <VscUnmute />}
                    </button>
                  </div>
                ) : (
                  <img
                    key={postData.content.media[currentIndex]?.url}
                    src={postData.content.media[currentIndex]?.url}
                    alt="media"
                    className="max-h-full lg:h-full object-contain rounded-lg"
                  />
                )}
              </div>

              {/* Navigation Arrows */}
              {postData.content.media.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        prev === 0 ? postData.content.media.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition"
                  >
                    &#10094;
                  </button>

                  <button
                    onClick={() =>
                      setCurrentIndex((prev) =>
                        prev === postData.content.media.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition"
                  >
                    &#10095;
                  </button>
                </>
              )}

              {/* Media Counter */}
              {postData.content.media.length > 1 && (
                <div className="absolute bottom-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                  {currentIndex + 1} / {postData.content.media.length}
                </div>
              )}
            </>
          ) : (
            <p className="text-white">No media available</p>
          )}
        </div>

        {/* Sidebar */}
        <div className="relative px-4 py-3 w-1/3 lg:h-full flex flex-col">

  {/* Desktop Only */}
  <div className="hidden lg:flex flex-col flex-1 min-h-0">

    {/* TOP CONTENT */}
    <div className="flex flex-col">

      {/* Header */}
      <div className="flex sm:flex-col gap-1 pb-6 border-b-[0.3px] border-[#8c8e9c52]">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={userData[0]}
            className="w-12 h-12 rounded-full object-cover"
            alt="profile"
          />
          <h1 className="text-sm sm:text-base lg:text-lg text-white outfit-400 truncate max-w-[200px]">
            {userData[1]}
          </h1>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="absolute right-2 top-2 p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="text-white w-7 h-7" />
        </button>

        <div className="flex justify-between items-start mt-4 ml-1">
          <h1 className="text-white text-base sm:text-lg lg:text-xl break-words leading-snug flex-1 mr-3">
            {postData.content.text}
          </h1>
          <span className="text-[#acafce] text-xs sm:text-sm lg:text-base shrink-0">
            {formatDistanceToNow(new Date(postData.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Comments title */}
      <h1 className="text-white text-xl sm:text-2xl outfit-400 py-4">
        Comments {comments.length}
      </h1>
    </div>

    {/* COMMENTS LIST (SCROLLABLE, AUTO HEIGHT) */}
    <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-10 pl-1">
      {comments.map((item, i) => (
        <div key={i} className="flex justify-between items-center text-white mb-5">
          <div className="flex items-start gap-2 min-w-0">
            <img
              src={item?.profilepic}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              alt="profile"
            />
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm lg:text-[16px] outfit-600 truncate max-w-[200px]">
                {item?.username}
              </h1>
              <h2 className="outfit-300 text-sm lg:text-[16px] break-words leading-snug">
                {item?.text}
              </h2>
            </div>
          </div>
          <X
            onClick={() => handleDeleteComment(postData._id, item?._id)}
            className="w-4 h-4 cursor-pointer"
          />
        </div>
      ))}
    </div>

    {/* INPUT — ALWAYS BOTTOM */}
    <div className="pt-3">
      <div className="flex items-center justify-between bg-[#0D0F1E] lg:pl-3 pl-2 rounded-2xl w-full border-[#8c8e9c52] border-[0.3px]">
        <div className="flex items-center space-x-2 flex-1">
          <div className="flex gap-2 items-center text-white">
            {isLike ? (
              <FaHeart
                onClick={handleLike}
                className="lg:w-7 lg:h-7 w-6 h-6 text-[#261D5E] cursor-pointer"
              />
            ) : (
              <FaRegHeart
                onClick={handleLike}
                className="lg:w-7 lg:h-7 w-6 h-6 text-[#261D5E] cursor-pointer"
              />
            )}
            <span className="2xl:text-[20px]">{postData?.likes?.length}</span>
          </div>

          <input
            type="text"
            value={newComment}
            onKeyDown={(e) => e.key === "Enter" && handleComment(postData._id)}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="bg-transparent text-white lg:text-[15px] text-[12px] focus:outline-none w-full placeholder-gray-400"
          />
        </div>

        <button
          onClick={() => handleComment(postData._id)}
          className="bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] hover:from-[#261D5E] hover:to-[#4F2DB8] lg:px-8 px-4 lg:py-4 py-3 rounded-2xl text-white lg:text-[20px] text-[15px]"
        >
          Post
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Likes + Comments (visible below lg) */}
  <div className="flex gap-6 items-center lg:hidden mt-3">
    <div className="flex items-center gap-2 cursor-pointer">
      {isLike ? (
        <FaHeart onClick={handleLike} className="w-6 h-6 text-[#2A1F66]" />
      ) : (
        <FaRegHeart onClick={handleLike} className="w-6 h-6 text-[#2A1F66]" />
      )}
      <span className="text-white text-base font-medium">
        {postData?.likes?.length}
      </span>
    </div>

    <div className="flex items-center gap-2 cursor-pointer">
      <BiCommentDetail
        onClick={() => setShowCommentBar(true)}
        className="w-6 h-6 text-[#2A1F66]"
      />
      <span className="text-white text-base font-medium">
        {postData.comments.length}
      </span>
    </div>
  </div>

</div>


      </div>

      {showCommentBar && (
        <CommentBar
          setShowCommentBar={setShowCommentBar} 
          handleComment={handleComment}
          comments={comments}
          setNewComment={setNewComment}
          newComment={newComment}
          handleDeleteComment={handleDeleteComment}
        />
      )}
    </div>
  );
};

export default Post;
