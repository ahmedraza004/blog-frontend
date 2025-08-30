import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [displayName, setDisplayName] = useState(''); // just for UI
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // make sure this key is correct
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      // Try common claim names you might have:
      const name =
        decoded.username ||
        decoded.name ||
        decoded.email ||
        (decoded.user_id ? `User#${decoded.user_id}` : '');
      setDisplayName(name || '');
      // NOTE: We are NOT sending author to the server. Backend will set it.
    } catch (err) {
      console.error('Invalid token:', err);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);

      // Do NOT set Content-Type manually; Axios will add the proper boundary.
      await api.post('/posts/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      alert('✅ Post created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
      alert('❌ Failed to create post.');
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Create a New Post
      </h2>

      {displayName && (
        <p className="mb-4 text-sm text-gray-600 text-center">
          Posting as: <strong>{displayName}</strong>
        </p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input
          type="text"
          name="title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="content"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Content"
          required
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={e => setImage(e.target.files?.[0] || null)}
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Create Post'}
        </button>
      </form>
    </div>
  </div>
);
}

export default CreatePost;
