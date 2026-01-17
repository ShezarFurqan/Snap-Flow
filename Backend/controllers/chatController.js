import MessageModel from "../models/messagemodel.js";
import usermodel from "../models/usermodel.js";
import cloudinary from "../config/cloudinary.js";
import { io, userSocketMap } from "../index.js";
import createNotification from "../utils/Notification.js";

export const getUserChats = async (req, res) => {
  try {
    const UserId = req.user._id;

    const filteredUser = await usermodel
      .find({ _id: { $ne: UserId } })
      .select("-password");

    const unseenMessages = {};
    await Promise.all(
      filteredUser.map(async (user) => {
        const messages = await MessageModel.find({
          senderId: user._id,
          receiverId: UserId,
          seen: false,
        });

        if (messages.length > 0) {
          unseenMessages[user._id] = messages.length;
        }
      })
    );

    res.status(200).json({
      success: true,
      users: filteredUser,
      unseenMessages,
    });
  } catch (error) {
    console.error("Error in getUserChats:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await MessageModel.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    await MessageModel.updateMany(
      {
        senderId: selectedUserId,
        receiverId: myId,
        seen: false,
      },
      { seen: true }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await MessageModel.findByIdAndUpdate(id, { seen: true });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in markMessageAsSeen:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;


    if (!text && !image) {
      return res
        .status(400)
        .json({ success: false, message: "Message cannot be empty" });
    }

    let imageUrl;

    if (image) {
      if (image.path) {

        const uploadResponse = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
        });
        imageUrl = uploadResponse.secure_url;
      } else if (typeof image === "string") {

        const uploadResponse = await cloudinary.uploader.upload(image, {
          resource_type: "image",
        });
        imageUrl = uploadResponse.secure_url;
      }
    }

    const newMessage = await MessageModel.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });


    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }


    await createNotification({
      type: "message",
      senderId: senderId,
      receiverId: receiverId
    })

    res.status(201).json({ success: true, newMessage });
  } catch (error) {
    console.error("Error in sendMessages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {

    const messageId = req.params.id;

    const message = await MessageModel.findByIdAndDelete(messageId);

    if (!message) {
      return res.json({ success: false, message: "message not found" })
    }

    res.json({ success: true, message: "Message deleted successfully" });


  } catch (error) {
    console.error("Error in deleteMessages:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}
