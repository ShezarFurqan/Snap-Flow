import userModel from "../models/usermodel.js"
import createNotification from "../utils/Notification.js"
import CreateNotification from "../utils/Notification.js"
import { v2 as cloudinary } from "cloudinary"


export const getProfile = async (req, res) => {
    try {

        const userid = req.params.id

        const user = await userModel.findById(userid).select("-password")

        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        res.json({ success: true, user })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const getAllUsers = async (req, res) => {

    try {

        const users = await userModel.find({})

        res.json({success: true, users})


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const { bio, username } = req.body;

        const profilepic = req.files.profilepic && req.files.profilepic[0];
        const banner = req.files.banner && req.files.banner[0];

        const updateData = {
            ...(bio && { bio }),
            ...(username && { username }),
        };


        if (profilepic) {
            const uploadedProfilePic = await cloudinary.uploader.upload(profilepic.path, {
                resource_type: "image",
            });
            updateData.profilepic = uploadedProfilePic.secure_url;
        }

        if (banner) {
            const uploadedBanner = await cloudinary.uploader.upload(banner.path, {
                resource_type: "image",
            });
            updateData.banner = uploadedBanner.secure_url;
        }

        console.log(banner);
        

        const updatedUser = await userModel.findByIdAndUpdate(userId, updateData, { new: true });

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProfile = async (req, res) => {
    try {

        const userid = req.params.id

        const user = await userModel.findByIdAndDelete(userid)

        if (!user) {
            return res.json({ success: false, message: "user not found" })
        }

        res.json({ success: true, user })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const followUser = async (req, res) => {
    try {

        const userToFollowId = req.params.id;      // User to be followed
        const currentUserId = req.user._id;        // Logged in user

        if (userToFollowId === currentUserId.toString()) {
            return res.status(400).json({ success: false, message: "You cannot follow yourself" });
        }

        const userToFollow = await userModel.findById(userToFollowId);
        const currentUser = await userModel.findById(currentUserId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (currentUser.following.includes(userToFollowId)) {
            return res.status(400).json({ success: false, message: "Already following" });
        }

        currentUser.following.push(userToFollowId);
        userToFollow.followers.push(currentUserId);

        await currentUser.save();
        await userToFollow.save();

        await createNotification({
            type: "follow",
            senderId: currentUserId,
            receiverId: userToFollowId
        })

        res.status(200).json({ success: true, message: "User followed successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export const unfollowUser = async (req, res) => {
    try {

        const userToFollowId = req.params.id;      // User to be followed
        const currentUserId = req.user._id;        // Logged in user

        if (userToFollowId === currentUserId.toString()) {
            return res.status(400).json({ success: false, message: "You cannot unfollow yourself" });
        }

        const userToFollow = await userModel.findById(userToFollowId);
        const currentUser = await userModel.findById(currentUserId);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        currentUser.following = currentUser.following.filter(id => id.toString() !== userToFollowId)
        userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== currentUserId.toString());

        await currentUser.save();
        await userToFollow.save();

        res.status(200).json({ success: true, message: "User unfollowed successfully" });



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

import bcrypt from "bcrypt";

export const changePassword = async (req, res) => {
  try {
    const { CurrPassword, NewPassword } = req.body;
    const currentUserId = req.user._id;

    const User = await userModel.findById(currentUserId);

    
    if (!User) {
      return res.json({ success: false, message: "User not found" });
    }

    
    const isMatch = await bcrypt.compare(CurrPassword, User.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Wrong password" });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NewPassword, salt);

    User.password = hashedPassword;

    await User.save();

    return res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};



