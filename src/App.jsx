import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Videos from './pages/Videos.jsx';
import VideoDetail from './pages/VideoDetail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Playlists from './pages/Playlists.jsx';
import PlaylistDetail from './pages/PlaylistDetail.jsx';
import Tweets from './pages/Tweets.jsx';
import Channel from './pages/Channel.jsx';
import Settings from './pages/Settings.jsx';
import History from './pages/History.jsx';
import LikedVideos from './pages/LikedVideos.jsx';

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/" element={<Videos />} />
        <Route path="/videos/:videoId" element={<VideoDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/:playlistId" element={<PlaylistDetail />} />
        <Route path="/tweets" element={<Tweets />} />
        <Route path="/channel/:username" element={<Channel />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<History />} />
        <Route path="/liked" element={<LikedVideos />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
