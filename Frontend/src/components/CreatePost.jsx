import React, { useContext, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { SnapContext } from "../context/SnapContext";
import { X, Image, Video, UserCircle2, Clock, Loader2 } from "lucide-react";

const CreatePost = () => {
  const { backendUrl, setCPOpen, input, users, userId, setUpdatePost } = useContext(SnapContext);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [title, setTitle] = useState(input || "");
  const [postToProfile, setPostToProfile] = useState(true);
  const [postToStory, setPostToStory] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [mentionInput, setMentionInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const mentionBoxRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + mediaFiles.length > 10) {
      toast.error("You can upload a maximum of 10 files (images/videos).");
      return;
    }
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle mention input typing
  useEffect(() => {
    if (mentionInput.trim() === "") {
      setSuggestions([]);
      return;
    }


    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(mentionInput.toLowerCase()) &&
        u._id.toString() !== userId.toString()
    );

    setSuggestions(filtered.slice(0, 5)); // max 5 suggestions
  }, [mentionInput, users]);

  const addMention = (username) => {
    if (!mentions.includes(username)) {
      setMentions((prev) => [...prev, username]);
    }
    setMentionInput("");
    setSuggestions([]);
  };

  const removeMention = (username) => {
    setMentions((prev) => prev.filter((u) => u !== username));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postToProfile && !postToStory) {
      toast.error("Select at least one option — Profile or Story!");
      return;
    }
    if (mediaFiles.length === 0) {
      toast.error("Please upload at least one image or video!");
      return;
    }

    setLoading(true);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      if (postToProfile) {
        const formData = new FormData();
        formData.append("text", title);
        mediaFiles.forEach((file) => formData.append("media", file));

        await axios.post(`${backendUrl}/api/post/createpost`, formData, {
          headers,
        });
        toast.success("Posted to Profile!");
        setUpdatePost(true);
      }

      if (postToStory) {
        for (const file of mediaFiles) {
          const formData = new FormData();
          formData.append("file", file);
          if (mentions.length > 0)
            formData.append("mentions", JSON.stringify(mentions));

          await axios.post(`${backendUrl}/api/story/upload`, formData, {
            headers,
          });
        }
        toast.success("Stories uploaded!");
      }

      setTitle("");
      setMediaFiles([]);
      setMentions([]);
      setMentionInput("");
      setCPOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute inset-0 flex items-center justify-center bg-black/70 z-50"
    >
      <div className="relative w-[95%] sm:w-[520px] bg-[#0D0F1E] rounded-2xl shadow-lg p-6 text-white border border-white/10 font-outfit">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setCPOpen(false)}
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/10 transition"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-center">Create Post</h2>

        {/* Caption Input — only when posting to Profile */}
        {postToProfile && (
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full h-28 bg-[#181A2A] rounded-xl px-4 py-3 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        )}

        {/* Media Preview */}
        {mediaFiles.length > 0 && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {mediaFiles.map((file, i) => (
              <div
                key={i}
                className="relative border border-white/10 rounded-lg overflow-hidden group"
              >
                {file.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 object-cover"
                    muted
                  />
                ) : (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-full h-24 object-cover"
                  />
                )}
                <button
                  onClick={() => removeFile(i)}
                  type="button"
                  className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File Upload */}
        <div className="mt-4">
          <h3 className="text-sm text-gray-300 mb-2 font-medium">Attach</h3>
          <div className="flex gap-4 bg-[#181A2A] rounded-xl p-3 border border-white/10">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="p-3 hover:bg-white/10 rounded-lg transition flex items-center gap-2"
            >
              <Image className="w-6 h-6 text-gray-300" />
              <Video className="w-6 h-6 text-gray-300" />
              <span className="text-sm text-gray-400">Add Media</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*,video/*"
              multiple
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Post options */}
        <div className="mt-5 bg-[#181A2A] rounded-xl p-4 border border-white/10">
          <h3 className="text-sm text-gray-300 mb-3 font-medium">
            Where do you want to post?
          </h3>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={postToProfile}
                onChange={() => setPostToProfile(!postToProfile)}
                className="accent-indigo-500 w-5 h-5"
              />
              <div className="flex items-center gap-2">
                <UserCircle2 className="w-5 h-5 text-indigo-400" />
                <span>Post to Profile</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={postToStory}
                onChange={() => setPostToStory(!postToStory)}
                className="accent-pink-500 w-5 h-5"
              />
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-400" />
                <span>Post to Story (disappears in 24h)</span>
              </div>
            </label>
          </div>

          {/* Mentions Input (Story Only) */}
          {postToStory && (
            <div className="mt-4 space-y-3 animate-fadeIn relative" ref={mentionBoxRef}>
              {/* Mention Chips */}
              <div className="flex flex-wrap gap-2">
                {mentions.map((m, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-700/30 to-pink-600/30 text-[#E0B0FF] px-3 py-1 rounded-full text-sm border border-purple-500/30"
                  >
                    @{m}
                    <button
                      type="button"
                      onClick={() => removeMention(m)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>

              <input
                type="text"
                placeholder="Type to mention users..."
                value={mentionInput}
                onChange={(e) => setMentionInput(e.target.value)}
                className="w-full p-2 rounded-lg bg-[#0D0F1E] border border-gray-700 text-sm focus:ring-2 focus:ring-pink-500 outline-none mt-2"
              />

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-[#181A2A] border border-gray-700 rounded-lg mt-1 z-50 max-h-40 overflow-y-auto">
                  {suggestions.map((u, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addMention(u.username)}
                      className="w-full text-left px-3 py-2 hover:bg-pink-500/20 text-gray-300 text-sm transition"
                    >
                      @{u.username}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || (!postToProfile && !postToStory)}
          className={`w-full mt-6 font-medium py-3 rounded-xl text-lg transition flex justify-center items-center ${!postToProfile && !postToStory
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-[#4F2DB8] to-[#261D5E] hover:from-[#261D5E] hover:to-[#4F2DB8]"
            }`}
        >
          {loading ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : postToStory && postToProfile ? (
            "Post to Profile & Story"
          ) : postToStory ? (
            "Post Story"
          ) : (
            "Post"
          )}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
