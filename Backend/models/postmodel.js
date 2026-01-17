import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 0,
  },
});

const postSchema = new mongoose.Schema({
  content: {
    text: { type: String, default: "" },
    media: { type: [contentSchema], default: [] }, // ✅ multiple media files
  },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  comments: [
    {
      user: String,
      text: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const PostModel = mongoose.models.post || mongoose.model("post", postSchema);

export default PostModel;
