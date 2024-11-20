import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from '../Post/Post';
import { FaRegThumbsUp } from "react-icons/fa6";

const PublicSpace = () => {
  // const { token } = useAuth()
  const [posts, setPosts] = useState([]);
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [postLimitReached, setPostLimitReached] = useState(false);
  const [posting, setPosting] = useState(false);
  const profileData = JSON.parse(localStorage.getItem("Profile"));
  const token = profileData?.token;

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://stack-overflow-nullclass-backend.onrender.com/posts/');
        setPosts(response.data);
        console.log(posts)
        console.log("Token", token)
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };
    fetchPosts();
  }, []);

  // Handle post submission
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setPosting(true)

    // Convert image and video files to base64 if they are present
    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    };
  
    let imageBase64 = null;
    let videoBase64 = null;
  
    if (image) {
      imageBase64 = await convertToBase64(image);
    }
  
    if (video) {
      videoBase64 = await convertToBase64(video);
    }
  
    const bodyData = {
      desc,
      imageUrl: imageBase64,
      videoUrl: videoBase64,
    };

    console.log(bodyData)

    try {
      const response = await fetch('https://stack-overflow-nullclass-backend.onrender.com/posts/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (data.success) {
        setPosts([data.post, ...posts]);
        setDesc('');
        setImage(null);
        setVideo(null);
        setPosting(false)
      } else {
        setPostLimitReached(true); // Show limit message
      }
    } catch (error) {
      console.error("Error posting", error);
    }
  };

  return (
    <div className="public-space mb-1">
      <div className="mt-1 d-flex justify-content-between header">
        <h2 className='mt-5'>Public Space</h2>

        <button type="button" class="mt-5 btn btn-warning" data-bs-toggle="modal" data-bs-target="#exampleModal">
          <b>Add Post</b>
        </button>
      </div>

      <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Add Post</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form onSubmit={handlePostSubmit}>
            <textarea
              placeholder="Share something..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
            <button type="submit" disabled={postLimitReached}>{posting?"Posting":"Post"}</button>
            {postLimitReached && <p>You have reached your post limit for today.</p>}
          </form>
            </div>
            
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="feed">
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default PublicSpace;
