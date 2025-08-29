
import { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Post() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to load posts:', err);
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const startEdit = (post) => {
    setEditId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditContent('');
  };

  const submitEdit = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await api.patch(`/posts/${editId}/`, {
        title: editTitle,
        content: editContent
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      alert('✅ Post updated successfully!');
      setEditId(null);
      setEditTitle('');
      setEditContent('');
      window.location.reload();
    } catch (err) {
      console.error('Failed to update post:', err);
      alert('❌ Failed to update post.');
    }
  };

  const deletePost = async (id) => {
    const token = localStorage.getItem("accessToken");
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('🗑️ Post deleted successfully!');
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('❌ Failed to delete post.');
    }
  };
  const toggleLike = async (id) => {
  const token = localStorage.getItem("accessToken");
  try {
    await api.post(`/posts/${id}/toggle_like/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    window.location.reload(); // or update state for better UX
  } catch (err) {
    console.error('Failed to toggle like:', err);
    alert('❌ Failed to toggle like.');
  }
};


  if (loading) return <p>Loading…</p>;

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <h4 className="text-2xl font-bold mb-4">Posts</h4>
      <ul className="space-y-6">
        {posts.map((p) => (
          <li key={p.id} className="border p-4 rounded shadow">
            {editId === p.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Title"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Content"
                />
                <div className="space-x-2">
                  <button onClick={submitEdit} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
                  <button onClick={cancelEdit} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h5 className="text-xl font-semibold mb-2">{p.title}</h5>
                <p className="text-gray-700 mb-2">{p.content}</p>
                <Link to={`/posts/${p.id}/`} className="text-blue-500 hover:underline">Read more</Link>
                <div className="mt-2 space-x-2">
                  <button onClick={() => startEdit(p)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                  <button onClick={() => deletePost(p.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>

                  <button
                    onClick={() => toggleLike(p.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {p.is_liked ? 'Unlike' : 'Like'} ({p.likes_count})
                  </button>

                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handleLogout} className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
    </section>
  );
}
