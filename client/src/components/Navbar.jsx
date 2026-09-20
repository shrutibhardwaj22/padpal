import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🌸 PadPal</Link>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Feed</Link>
        <Link to="/raise" className="navbar-link">+ Request</Link>
        <Link to="/profile" className="navbar-link">{user?.avatar} Me</Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="navbar-link">Admin</Link>
        )}
        <button onClick={handleLogout} className="navbar-logout">Logout</button>
      </div>
    </nav>
  );
}