import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = async () => { await logout(); navigate('/login'); };
  return <div className="app-shell">
    <header className="topbar">
      <Link className="brand" to="/">Chai<span>Tube</span></Link>
      <nav className="nav-links" aria-label="Main navigation">
        <NavLink to="/" end>Videos</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/playlists">Playlists</NavLink>
        <NavLink to="/tweets">Tweets</NavLink>
        <NavLink to="/history">History</NavLink>
        <NavLink to="/liked">Liked</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </nav>
      <div className="account"><Link to={`/channel/${user?.username}`}>{user?.fullName || user?.username}</Link><button className="button subtle" onClick={signOut}>Log out</button></div>
    </header>
    <main className="main-content"><Outlet /></main>
  </div>;
}
