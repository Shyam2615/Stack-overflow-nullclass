import React, { useState, useEffect } from 'react';
import { FaRegThumbsUp } from "react-icons/fa6";
import { FaThumbsUp } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

const Post = ({ post }) => {
  const [likes, setLikes] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState("User");

  const profileData = JSON.parse(localStorage.getItem("Profile"));
  const token = profileData?.token;
  const userId = profileData?.result?._id;

  useEffect(() => {
    let isMounted = true;

    if (post.likes.includes(userId)) setLiked(true);
    fetchUserData();

    const fetchFollowStatus = async () => {
      try {
        const response = await fetch(`https://stack-overflow-nullclass-backend.onrender.com/posts/follow-status/${post.userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (isMounted) setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status", error);
      }
    };

    fetchFollowStatus();

    return () => { isMounted = false };
  }, [post.likes, post.userId, userId, token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`https://stack-overflow-nullclass-backend.onrender.com/user/GetUserById/${post.userId}`);
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const response = await fetch(`https://stack-overflow-nullclass-backend.onrender.com/posts/${isFollowing ? "unfollow" : "follow"}/${post.userId}`, {
        method: "PUT",
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Error following/unfollowing user", error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`https://stack-overflow-nullclass-backend.onrender.com/posts/like/${post._id}`, {
        method: "PUT",
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setLikes(data.likes.length);
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking post", error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(`https://stack-overflow-nullclass-backend.onrender.com/posts/dislike/${post._id}`, {
        method: "PUT",
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setLikes(data.likes.length);
      setLiked(false);
    } catch (error) {
      console.error("Error disliking post", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() === "") return;

    try {
      const response = await fetch(`https://stack-overflow-nullclass-backend.onrender.com/posts/comment/${post._id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment }),
      });
      const updatedPost = await response.json();
      setComments(updatedPost.comments);
      setComment("");
    } catch (error) {
      console.error("Error commenting on post", error);
    }
  };

  return (
    <div className="post">
      <div className="info d-flex justify-content-between">
        <b style={{ color: 'blue' }}><FaUser /> {user}</b>
        <button className="btn btn-outline-danger" onClick={handleFollowToggle}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
      <p><b>Description:</b> {post.desc}</p>
      {post.imageUrl && <img src={post.imageUrl} alt="Post" width={530} />}
      {post.videoUrl && <video src={post.videoUrl} controls />}
      <div className="post-actions" style={{ marginTop: '10px' }}>
        <button onClick={liked ? handleDislike : handleLike}>
          {liked ? <FaThumbsUp style={{ color: 'blue' }} /> : <FaRegThumbsUp />} ({likes})
        </button>
        <button>Comment ({comments.length})</button>
      </div>
      <form style={{ marginTop: '10px' }} onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button type="submit">Post Comment</button>
      </form>
      <div className="comments">
        {comments.map((comment, index) => (
          <p key={index}><strong>{comment.username}:</strong> {comment.comment}</p>
        ))}
      </div>
    </div>
  );
};

export default Post;
