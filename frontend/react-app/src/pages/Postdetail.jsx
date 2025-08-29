import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [postDetail, setPostDetail] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const token = localStorage.getItem("accessToken");
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPostAndComments = async () => {
      try {
        const postRes = await api.get(`/posts/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPostDetail(postRes.data);

        const commentRes = await api.get(`/comments?post=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComments(commentRes.data);
      } catch (err) {
        setError(err.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id, navigate, token]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {


      await api.post('/comments/', {
        post: postDetail.id,
        content: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });


      alert("✅ Comment added!");
      setNewComment("");
      const res = await api.get(`/comments?post=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(res.data);
    } catch (err) {
      alert("❌ Failed to add comment.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!postDetail) return <p>No post found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">ID: {postDetail.id}</h1>
      <h2 className="text-xl font-semibold text-blue-600 mb-1">Title: {postDetail.title}</h2>
      <h3 className="text-lg text-gray-600 mb-2">Author: {postDetail.author}</h3>
      <p className="text-gray-700 mb-4">Content: {postDetail.content}</p>

      <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go Back
      </button>

      <hr className="my-6" />

      <h4 className="text-lg font-semibold mb-2">Comments</h4>
      <ul className="space-y-4 mb-4">
        {comments.map((c) => (
          <li key={c.id} className="border p-3 rounded">
            <p className="text-gray-800">{c.content}</p>
            <p className="text-sm text-gray-500">By: {c.user}</p>
          </li>
        ))}
      </ul>

      <form onSubmit={handleCommentSubmit} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          placeholder="Write a comment..."
          required
        />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Submit Comment
        </button>
      </form>
    </div>
  );
}

export default PostDetail;
