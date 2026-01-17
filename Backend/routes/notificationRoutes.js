import express from "express"
import { getNotifications, markNotificationsAsRead } from "../controllers/notificationController.js"


const notificationRouter = express.Router()

notificationRouter.get("/:userId", getNotifications)
notificationRouter.put("/mark-read/:userId", markNotificationsAsRead)

export default notificationRouter