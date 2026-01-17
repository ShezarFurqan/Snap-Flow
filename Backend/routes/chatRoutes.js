import express from "express";
import { deleteMessage, getMessages, getUserChats, markMessageAsSeen, sendMessages } from "../controllers/chatController.js";
import { protect } from "../middlewares/protect.js"

const chatRouter = express.Router()

chatRouter.get("/users", protect, getUserChats)
chatRouter.get("/:id", protect, getMessages)
chatRouter.put("/mark/:id", protect, markMessageAsSeen)
chatRouter.post("/send/:id", protect, sendMessages)
chatRouter.delete("/:id/delete", protect, deleteMessage)

export default chatRouter