import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("Profile")) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem("Profile")).token}`;
    }
    
    return req;
});

export const login = (authData) => API.post("/user/login", authData);
export const signup = (authData) => API.post("/user/signup", authData);
export const fetchAllUsers = () => API.get("/user/getAllUsers");
export const updateProfile = (id, updateData) => API.patch(`/user/update/${id}`, updateData);
export const followUser = (userId) => API.put(`/user/follow/${userId}`);
export const unfollowUser = (userId) => API.put(`/user/unfollow/${userId}`);

export const postQuestion = (questionData) => API.post("/questions/Ask", questionData);
export const getAllQuestions = () => API.get("/questions/get");
export const deleteQuestion = (id) => API.delete(`/questions/delete/${id}`);
export const voteQuestion = (id, value, userId) => API.patch(`/questions/vote/${id}`, { value, userId });

export const postAnswer = (_id, noOfAnswers, answerBody, userAnswered, userId) => API.patch(`/answers/post/${_id}`, { noOfAnswers, answerBody, userAnswered, userId });
export const deleteAnswer = (id, answerId, noOfAnswers) => API.patch(`/answers/delete/${id}`, { answerId, noOfAnswers });

export const sharePost = (postData) => API.post("/posts/", postData);
export const getAllPosts = () => API.get("/posts/");
export const likePost = (postId) => API.put(`/posts/like/${postId}`);
export const dislikePost = (postId) => API.put(`/posts/dislike/${postId}`);
export const deletePost = (postId) => API.delete(`/posts/${postId}`);
export const commentPost = (postId, commentText) =>
API.put(`/post/comment/${postId}`, { comment: commentText });