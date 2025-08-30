import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Post from './pages/Post';
import PostDetail from './pages/Postdetail'; // ensure actual file name/case matches
import Registration from './pages/Registration';
import LoginPage from './pages/LoginPage';
import CreatePost from './pages/CreatePost';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* optional: send / to /posts */}
        <Route path="/" element={<Navigate to="/register/" replace />} />
        <Route path="/posts" element={<Post />} />
        <Route path="/posts/:id/" element={<PostDetail />} />
        <Route path="/register/" element={<Registration />} />
        <Route path="/login/" element={<LoginPage />} />
        <Route path="/create/" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}
