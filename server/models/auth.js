// Updated User Schema
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    about: { type: String },
    tags: { type: [String] },
    joinedOn: { type: Date, default: Date.now },
    profileImage: { type: String },
    followings: { type: [String], default: [] },
    followers: { type: [String], default: [] },
    points: { type: Number, default: 0 }, // New field for tracking points
});

export default mongoose.model("User", userSchema);
