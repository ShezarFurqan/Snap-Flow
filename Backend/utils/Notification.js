import NotificationModel from "../models/notificationmodel.js";

const createNotification = async ({ type, senderId, receiverId, postId = null }) => {
  if (senderId.toString() === receiverId.toString()) return; // no self-notifications

  try {
    await NotificationModel.create({
      type,
      senderId,
      receiverId,
      postId
    });
  } catch (err) {
    console.error("Error creating notification:", err.message);
  }
};

export default createNotification;
