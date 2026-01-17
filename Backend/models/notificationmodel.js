import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  type: {
    type: String,
    enum: ["like", "comment", "follow"], // restricted to these types
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post", // optional, only for 'like' and 'comment' types
    required: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const NotificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema);

export default NotificationModel;
