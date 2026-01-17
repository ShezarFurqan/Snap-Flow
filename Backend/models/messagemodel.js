import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    text: { type: String, default: "" },
    image: { type: String, default: "" }, // optional image field
    seen: {type: Boolean, default: false}
}, {timestamps: true});

const MessageModel = mongoose.models.message || mongoose.model("message", messageSchema);

export default MessageModel;
