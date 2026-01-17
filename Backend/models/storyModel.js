import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], required: true },
  duration: { type: Number, required: true }, // seconds
  mentions: [{ type: mongoose.Schema.Types.Array, ref: 'User' }],
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sourceStory: { type: mongoose.Schema.Types.ObjectId, ref: 'Story' }, // if shared
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // 24h
});

StorySchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model('Story', StorySchema);
export default Story;
