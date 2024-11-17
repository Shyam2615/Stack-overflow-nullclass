import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    mediaType: { type: String, enum: ["image", "video"], required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    likeCount: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            text: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    shareCount: { type: Number, default: 0 },
});

export default mongoose.model("Post", postSchema);
