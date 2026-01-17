import usermodel from "../models/usermodel.js";
import NotificationModel from "../models/notificationmodel.js";

export const getNotifications = async (req, res) => {
  try {

    const { userId } = req.params

    const notifications = await NotificationModel.find({receiverId: userId })

    res.json({success: true, notifications})

   
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await NotificationModel.find({ receiverId: userId });

    if (!notifications.length) {
      return res.status(404).json({ success: false, message: "No notifications found" });
    }

    await NotificationModel.updateMany(
      { receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

