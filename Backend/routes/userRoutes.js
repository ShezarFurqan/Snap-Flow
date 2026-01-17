import express from "express"
import { editProfile, getProfile, deleteProfile, followUser, changePassword, unfollowUser, getAllUsers } from "../controllers/userController.js"
import { protect } from "../middlewares/protect.js"
import upload from "../middlewares/multer.js"

const userRouter = express.Router()

userRouter.get("/getallusers", getAllUsers)
userRouter.get("/:id", getProfile)
userRouter.put("/edit/:id", upload.fields([{ name: 'profilepic', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), editProfile)
userRouter.delete("/:id", deleteProfile)
userRouter.put("/:id/follow", protect, followUser)
userRouter.put("/:id/unfollow", protect, unfollowUser)
userRouter.put("/changepassword",protect, changePassword)

export default userRouter

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MThmNzllM2YzOTg3M2FkMTU2YzdjNSIsImlhdCI6MTc0NjQ2NzA1NCwiZXhwIjoxNzQ2NzI2MjU0fQ.nABvVW5OVoWOSoyKEPcQgUVIYrJt8XuwYtMvpk7cQVI