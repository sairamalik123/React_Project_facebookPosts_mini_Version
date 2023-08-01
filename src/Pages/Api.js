import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const fetchPosts = () => {
  return axios.get(`${BASE_URL}/posts`).then((response) => response.data);
};

export const createPost = (newPost) => {
  return axios.post(`${BASE_URL}/posts`, newPost);
};

export const updatePost = (postId, updatedPost) => {
  return axios.put(`${BASE_URL}/posts/${postId}`, updatedPost);
};

export const deletePost = (postId) => {
  return axios.delete(`${BASE_URL}/posts/${postId}`);
};

export const createComment = (newComment) => {
  return axios.post(`${BASE_URL}/comments`, newComment);
};

export const updateComment = (commentId, updatedComment) => {
  return axios.put(`${BASE_URL}/comments/${commentId}`, updatedComment);
};

export const deleteComment = (commentId) => {
  return axios.delete(`${BASE_URL}/comments/${commentId}`);
};

 export const fetchUserByUsername = async (username) => {
    try {
      const response = await fetch(`${BASE_URL}/user/${username}`);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch user data.");
      }
    } catch (error) {
      throw error;
    }
  };

  export const checkUserExists = async (username, email) => {
    try {
      const response = await fetch(`${BASE_URL}/user?username=${username}&email=${email}`);
      if (response.ok) {
        const data = await response.json();
        return data.length > 0;
      } else {
        throw new Error("Failed to check user existence.");
      }
    } catch (error) {
      throw error;
    }
  };
  
  export const createUser = async (userData) => {
    try {
      const response = await fetch(`${BASE_URL}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to create user.");
      }
    } catch (error) {
      throw error;
    }
  };