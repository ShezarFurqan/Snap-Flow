import postmodel from "../models/postmodel.js"
import { v2 as cloudinary } from "cloudinary"
import fs from "fs";

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const files = req.files?.media;

    if (!files || files.length === 0) {
      return res.json({
        success: false,
        message: "Please upload at least one image or video.",
      });
    }

    if (files.length > 10) {
      return res.json({
        success: false,
        message: "You can upload a maximum of 10 files.",
      });
    }

    const uploadedMedia = [];

    // Optimized stream uploader with timeout config
    const streamUpload = (buffer, resource_type) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type,
            timeout: 120000, // ⏱️ 2 min timeout for large uploads
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );

        // Write buffer to stream
        uploadStream.end(buffer);
      });
    };

    // Upload each file (slightly delayed to prevent memory spike)
    for (const file of files) {
      const isVideo = file.mimetype.startsWith("video/");
      const resource_type = isVideo ? "video" : "image";

      const uploadResult = await streamUpload(file.buffer, resource_type);

      if (isVideo && uploadResult.duration && uploadResult.duration > 150) {
        await cloudinary.uploader.destroy(uploadResult.public_id, {
          resource_type: "video",
        });
        return res.json({
          success: false,
          message: "Video duration must not exceed 2.5 minutes.",
        });
      }

      uploadedMedia.push({
        type: resource_type,
        url: uploadResult.secure_url,
        duration: uploadResult.duration || 0,
      });
    }

    const newPost = new postmodel({
      content: { text, media: uploadedMedia },
      postedBy: userId,
    });

    await newPost.save();

    res.json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getPosts = async (req, res) => {
    try {

        const posts = await postmodel.find({}).sort({ createdAt: -1 })

        res.json({ success: true, posts })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await postmodel.findById(postId);

        if (!post) {
            return res.json({ success: false, message: "Post not found" });
        }

        res.json({ success: true, post });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const likePost = async (req, res) => {
    try {

        const postId = req.params.id
        const currentUserId = req.user._id

        const postToLike = await postmodel.findById(postId);

        if (!postToLike) {
            return res.json({ success: false, message: "post not found" })
        }

        const alreadyLiked = postToLike.likes.includes(currentUserId);
        if (alreadyLiked) {
            postToLike.likes = postToLike.likes.filter(id => id.toString() !== currentUserId.toString())
            await postToLike.save()
            return res.json({ success: true, message: "unlike successfully" })
        }

        postToLike.likes.push(currentUserId)

        await postToLike.save()

        res.json({ success: true, message: "post Liked Successfully" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const commentpost = async (req, res) => {
    try {

        const postId = req.params.id
        const currentUserId = req.user._id
        const { comment } = req.body

        const post = await postmodel.findById(postId)

        if (!post) {
            return res.json({ success: false, message: "Post Not Found" })
        }



        post.comments.push({
            user: currentUserId,
            text: comment,
        });

        await post.save()

        res.json({ success: true, message: "Comment Success" })



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export const deletecomment = async (req, res) => {
    try {

        const { postId, commentId } = req.params;

        const post = await postmodel.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const commentIndex = post.comments.findIndex(
            (c) => c._id.toString() === commentId
        );

        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        post.comments.splice(commentIndex, 1); // remove the comment
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await postmodel.findByIdAndDelete(postId)

        if (!post) {
            return res.json({ success: false, message: "post not found" })
        }

        res.json({ success: true, message: "Post deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

