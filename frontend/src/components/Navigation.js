import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="navbar flex-between">
      <Link to="/dashboard" className="nav-brand">DSA Samurai</Link>
      
      <ul className="nav-links">
        <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
        <li><Link to="/questions" className="nav-link">Questions</Link></li>
        <li><Link to="/leaderboard" className="nav-link">Leaderboard</Link></li>
        <li><Link to="/profile" className="nav-link">Profile</Link></li>
        <li>
          <button onClick={handleLogout} className="nav-link" style={{background: 'none', border: 'none'}}>
            Logout {userProfile?.name && `(${userProfile.name})`}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
