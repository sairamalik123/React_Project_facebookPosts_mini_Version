import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { fetchPosts, createPost, updatePost, deletePost, createComment, updateComment, deleteComment } from "./Api.js";

export default function Home() {
  const [login, setLogin] = useState("");
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [editedPost, setEditedPost] = useState(null);
  const [comments, setComments] = useState(JSON.parse(localStorage.getItem("comments")) || {});
  const [editedComment, setEditedComment] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentingPostId, setCommentingPostId] = useState(null);

  useEffect(() => {
    const username = sessionStorage.getItem("username");
    setLogin(username);
    if (username === "" || username === null) {
      navigate("/login");
    } else {
      fetchPostsFromApi();
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const fetchPostsFromApi = () => {
    fetchPosts()
      .then((response) => {
        setPosts(response);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert("Post title and content cannot be empty.");
      return;
    }

    const newPost = {
      title: newPostTitle,
      body: newPostContent,
      userId: login,
    };

    createPost(newPost)
      .then((response) => {
        setPosts((prevPosts) => [...prevPosts, response.data]);
        setNewPostTitle("");
        setNewPostContent("");
        alert("Post created successfully!");
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  const handleUpdatePost = () => {
    if (!editedPost) return;

    const updatedPost = {
      ...editedPost,
      title: newPostTitle,
      body: newPostContent,
    };

    updatePost(editedPost.id, updatedPost)
      .then(() => {
        fetchPostsFromApi();
        setEditedPost(null);
        setNewPostTitle("");
        setNewPostContent("");
        alert("Post updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating post:", error);
      });
  };

  const handleDeletePost = (postId) => {
    deletePost(postId)
      .then(() => {
        fetchPostsFromApi();
        alert("Post deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  const handleCreateComment = (postId) => {
    if (login === "") {
      alert("Please login first.");
      return;
    }

    setCommentingPostId(postId);
  };

  const handleSaveComment = () => {
    if (commentInput.trim() === "") {
      alert("Comment body cannot be empty!");
      return;
    }

    const newComment = {
      postId: commentingPostId,
      body: commentInput,
      userId: login,
    };

    createComment(newComment)
      .then((response) => {
        const newCommentData = response.data;
        setComments((prevComments) => ({
          ...prevComments,
          [commentingPostId]: [...(prevComments[commentingPostId] || []), newCommentData],
        }));
        setCommentInput("");
        setCommentingPostId(null);
        alert("Comment created successfully!");
      })
      .catch((error) => {
        console.error("Error creating comment:", error);
      });
  };

  const handleEditComment = (postId, commentId) => {
    setEditedPost(postId);
    setEditedComment(commentId);
    const comment = comments[postId]?.find((comment) => comment.id === commentId);
    if (comment) {
      setCommentInput(comment.body);
    }
  };

  const handleUpdateComment = (postId, commentId, newCommentBody) => {
    const commentsToUpdate = comments[postId];
    if (!commentsToUpdate) return;

    const updatedComments = commentsToUpdate.map((comment) =>
      comment.id === commentId ? { ...comment, body: newCommentBody } : comment
    );

    updateComment(commentId, updatedComments.find((comment) => comment.id === commentId))
      .then(() => {
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: updatedComments,
        }));
        setEditedPost(null);
        setEditedComment(null);
        alert("Comment updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating comment:", error);
      });
  };

  const handleDeleteComment = (postId, commentId) => {
    const commentsToDelete = comments[postId];
    if (!commentsToDelete) return;

    const updatedComments = commentsToDelete.filter((comment) => comment.id !== commentId);

    deleteComment(commentId)
      .then(() => {
        setComments((prevComments) => ({
          ...prevComments,
          [postId]: updatedComments,
        }));
        setEditedPost(null);
        setEditedComment(null);
        alert("Comment deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
      });
  };

  const isPostEditable = (post) => {
    return post.userId === login;
  };
  const handleEditPost = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    if (postToEdit && postToEdit.userId === login) {
      setEditedPost(postToEdit);
      setNewPostTitle(postToEdit.title);
      setNewPostContent(postToEdit.body);
    } else {
      alert("You are not authorized to edit this post.");
    }
  };

  return (
    <div className="container-fluid">
      <div className="header float_left">
        <Link to={"/"}>Home</Link>
        <Link className="float_right" to={"/login"}>
          Logout
        </Link>
      </div>
      <div className="create-post-form post4">
        <h1 className="create_post">Create New Post</h1>
        <div className="row">
          <div className="col-md-4">
            <input
              className="post_title"
              type="text"
              placeholder="Enter post title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <textarea
              className="post_title2"
              placeholder="Enter post content"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <button className="post_title1" onClick={handleCreatePost}>
              Create Post
            </button>
          </div>
        </div>
      </div>
      <ul className="post-list">
        <br />
        <br />
        <h1 className="create_post">Already Existing Posts</h1>
        <br />
        <br />
        {posts.map((post) => (
          <li key={post.id} className="post-item ">
            {editedPost?.id === post.id ? (
              <>
                <input type="text" value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
                <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
                <button onClick={handleUpdatePost}>Save</button>
              </>
            ) : (
              <>
                <h3>{post.title}</h3>
                <p className="post2">{post.body}</p>
                {isPostEditable(post) ? (
                  <div>
                    <button className="btn btn-primary center1 btn_style" onClick={() => handleEditPost(post.id)}>
                      Edit
                    </button>
                    <button className="btn btn-danger center1  btn_style" onClick={() => handleDeletePost(post.id)}>
                      Delete
                    </button>
                    <button className="btn btn-success center1  btn_style" onClick={() => handleCreateComment(post.id)}>
                      Add Comment
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-success center1 btn_style" onClick={() => handleCreateComment(post.id)}>
                    Add Comment
                  </button>
                )}

                {commentingPostId === post.id && (
                  <div>
                    <input
                      className="input_commentAdd"
                      type="text"
                      placeholder="Enter your comment"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button className="btn btn-primary ce" onClick={handleSaveComment}>
                      Save Comment
                    </button>
                  </div>
                )}

                {comments[post.id] &&
                  comments[post.id].map((comment) => (
                    <div key={comment.id}>
                      <p className="center">{comment.body}</p>
                      {login === comment.userId && editedComment !== comment.id && (
                        <>
                          <button
                            className="btn btn-primary create_post"
                            onClick={() => handleEditComment(post.id, comment.id)}
                          >
                            Edit Comment
                          </button>
                          <button
                            className="btn btn-danger create_post"
                            onClick={() => handleDeleteComment(post.id, comment.id)}
                          >
                            Delete Comment
                          </button>
                        </>
                      )}
                      {editedPost === post.id && editedComment === comment.id && (
                        <>
                          <input
                            className="input_comment"
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                          />
                          <button
                            className="btn btn-success center2"
                            onClick={() => handleUpdateComment(post.id, comment.id, commentInput)}
                          >
                            Save
                          </button>
                          <button className="btn btn-primary center2" onClick={() => setEditedComment(null)}>
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  ))}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
