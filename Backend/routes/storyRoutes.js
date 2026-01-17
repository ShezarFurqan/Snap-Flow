import express from "express";
import upload from "../middlewares/multer.js";
import { protect } from "../middlewares/protect.js"
import { uploadFields } from "../middlewares/multer.js"


import { storyPost, getStories, markAsSeen, shareStory, deleteStory, getStoryById, } from "../controllers/storyController.js"

const storyRouter = express.Router();

// Upload a new story
storyRouter.post("/upload", uploadFields, protect, storyPost);

// Get all active stories (own + following)
storyRouter.get("/", protect, getStories);

storyRouter.get("/:userId", getStoryById);

// Mark story as seen
storyRouter.post("/:id/seen", protect, markAsSeen);

// Share another user's story
storyRouter.post("/:id/share", protect, shareStory);

// Delete your story
storyRouter.delete("/:id", protect, deleteStory);

export default storyRouter;
