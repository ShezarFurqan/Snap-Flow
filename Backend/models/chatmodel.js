import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }],
    lastMessage: { type: String, default: "" },
    updatedAt: { type: Date, default: Date.now }
});

const ChatModel = mongoose.models.chat || mongoose.model("chat", chatSchema);

export default ChatModel;
