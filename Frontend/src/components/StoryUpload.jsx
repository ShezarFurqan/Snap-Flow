import React, { useState } from "react";
import axios from "axios";

const StoryUpload = () => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select an image or video");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);

      const res = await axios.post(
        "http://localhost:4000/api/story/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        alert("Story uploaded successfully!");
        setFile(null);
        setCaption("");
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-900 text-white rounded-2xl shadow-lg w-96 mx-auto">
      <h2 className="text-xl font-semibold">Upload Story</h2>

      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="text-sm"
      />

      <input
        type="text"
        placeholder="Add a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-2 rounded bg-gray-800 border border-gray-700"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-white transition"
      >
        {loading ? "Uploading..." : "Post Story"}
      </button>
    </div>
  );
};

export default StoryUpload;
