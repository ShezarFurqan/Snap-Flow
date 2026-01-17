import { v2 as cloudinary } from "cloudinary";
import Story from "../models/storyModel.js"



// =============== POST STORY ===============
export const storyPost = async (req, res) => {
  try {
    // File access from upload.fields()
    const file = req.files?.file?.[0];
    if (!file) {
      return res.status(400).json({ error: "File required" });
    }

    // File type check
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    if (!isImage && !isVideo) {
      return res.status(400).json({ error: "Only image/video allowed" });
    }

    // Cloudinary upload config
    const uploadOptions = {
      resource_type: isVideo ? "video" : "image",
    };

    // Upload via stream
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const result = await streamUpload(file.buffer);

    // Duration validation
    let duration;
    if (isImage) {
      duration = 5;
    } else {
      duration = result.duration || 0;
      if (duration > 60) {
        await cloudinary.uploader.destroy(result.public_id, {
          resource_type: "video",
        });
        return res
          .status(400)
          .json({ error: "Video duration exceeds 60 seconds" });
      }
    }

    // Save story to DB
    const story = await Story.create({
      user: req.user._id,
      mediaUrl: result.secure_url,
      mediaType: isImage ? "image" : "video",
      duration,
      mentions: req.body.mentions ? JSON.parse(req.body.mentions) : [],
    });

    res.json({ success: true, story });
  } catch (err) {
    console.error("Story Upload Error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

// =============== GET STORIES (Feed) ===============
export const getStories = async (req, res) => {
  try {
    const now = new Date();

    // You can fetch followingIds from req.user.following if you store it
    const followingIds = req.user.following || [];



    const stories = await Story.find({
      expireAt: { $gt: now },
      user: { $in: [...followingIds, req.user._id] },
    })
      .sort({ createdAt: -1 })
      .populate("user", "username profilepic")
      .lean();

    res.json({ success: true, stories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stories" });
  }
};

// =============== Get Story by User Id =============== 

export const getStoryById = async (req, res) => {
  try {
    const stories = await Story.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("user", "username profilepic")
      .lean();;
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching stories" });
  }
}

// =============== MARK AS SEEN ===============
export const markAsSeen = async (req, res) => {
  try {
    const storyId = req.params.id;
    await Story.findByIdAndUpdate(storyId, {
      $addToSet: { seenBy: req.user._id },
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark as seen" });
  }
};

// =============== REPOST (Share Someone’s Story) ===============
export const shareStory = async (req, res) => {
  try {
    const { id } = req.params;
    const original = await Story.findById(id);
    if (!original) return res.status(404).json({ error: "Story not found" });

    const newStory = await Story.create({
      user: req.user._id,
      mediaUrl: original.mediaUrl,
      mediaType: original.mediaType,
      duration: original.duration,
      sourceStory: original._id,
    });

    res.json({ success: true, story: newStory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to share story" });
  }
};

// =============== DELETE STORY ===============
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ error: "Not found" });
    if (story.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Unauthorized" });

    await story.deleteOne();
    res.json({ success: true, message: "Story deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete story" });
  }
};
