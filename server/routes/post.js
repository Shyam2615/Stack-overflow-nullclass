import express from "express";
import {
  addPost,
  commentPost,
  deletePost,
  dislike,
  getPosts,
  getUserPosts,
  like,
  followUser,
  unfollowUser,
  isFollowed
} from "../controllers/post.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/user-posts/:id", getUserPosts);
router.post("/", auth, addPost);
router.delete("/:id", auth, deletePost);
router.put("/like/:id", auth, like);
router.put("/dislike/:id", auth, dislike);
router.put("/comment/:id", auth, commentPost);
router.put("/follow/:id", auth, followUser);
router.put("/unfollow/:id", auth, unfollowUser);
router.get("/follow-status/:id", auth, isFollowed);

export default router;
