import Post from "../models/Post.js";
import User from "../models/auth.js"

export const getPosts = async (req, res) => {
  try {
    const isPost = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(isPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const addPost = async (req, res) => {
  try {
    // Fetch the user making the post
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch posts made today by the user
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const userPostsToday = await Post.find({
      userId: req.userId,
      createdAt: { $gte: today },
    });

    // Define post limit based on friend count
    let postLimit = 1; // Default to 1 post if no friends
    if (user.followings.length >= 2 && user.followings.length < 10) {
      postLimit = 2;
    } else if (user.followings.length >= 10) {
      postLimit = Infinity; // No limit if more than 10 friends
    }

    // Check if the user can post
    if (userPostsToday.length >= postLimit) {
      return res.status(403).json({
        success: false,
        message: "Post limit reached for today",
      });
    }

    const {desc, imageUrl, videoUrl} = req.body
    console.log(desc, imageUrl, videoUrl)

    // If eligible, create the new post
    const newPost = new Post({
      desc, 
      imageUrl, 
      videoUrl,
      userId: req.userId,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ success: true, post: savedPost });
  } catch (error) {
    console.error("Error details:", error); // Log error details for debugging
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message || error,
    });
  }
};


export const deletePost = async (req, res) => {
  try {
    const isPost = await Post.findById(req.params.id);
    if (!isPost) res.status(500).json("Post not found!");

    if (req.userId === isPost.userId) {
      isPost.delete(req.params.id);
      res.status(200).json({ success: true, message: "Post deleted." });
    } else {
      res.json("You can't delete other's post.");
    }
  } catch (error) {
    res.status(500).json("something wrong...");
  }
};

export const like = async (req, res) => {
  try {
    const isPost = await Post.findById(req.params.id);
    if (!isPost) res.status(500).json("Post not found!");

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.userId },
      },
      { new: true }
    );
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const dislike = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.userId },
      },
      { new: true }
    );
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const commentPost = async (req, res) => {
  const { comment } = req.body;
  try {
    const user = await User.findOne({
      _id : req.userId
    })
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          comments: { userId: req.userId, username:user.name, comment },
        },
      },
      { new: true }
    );
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const followUser = async (req, res) => {
  const { id } = req.params; // The user to be followed
  const userId = req.userId; // The currently logged-in user

  if (id === userId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(userId);

    if (!userToFollow.followers.includes(userId)) {
      userToFollow.followers.push(userId);
      currentUser.followings.push(id);

      await userToFollow.save();
      await currentUser.save();

      res.status(200).json({ message: "Followed user successfully" });
    } else {
      res.status(400).json({ message: "Already following this user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  const { id } = req.params; // The user to be unfollowed
  const userId = req.userId; // The currently logged-in user

  try {
    const userToUnfollow = await User.findById(id);
    const currentUser = await User.findById(userId);

    if (userToUnfollow.followers.includes(userId)) {
      userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower !== userId);
      currentUser.followings = currentUser.followings.filter(following => following !== id);

      await userToUnfollow.save();
      await currentUser.save();

      res.status(200).json({ message: "Unfollowed user successfully" });
    } else {
      res.status(400).json({ message: "You are not following this user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const isFollowed = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const isFollowing = user.followings.includes(req.params.id);
    res.status(200).json({ isFollowing });
  } catch (error) {
    res.status(500).json({ message: "Error checking follow status" });
  }
};
