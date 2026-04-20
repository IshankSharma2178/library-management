import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <nav className="navbar">
        <Link to="/" className="navbar-brand">GLA University Library</Link>
        <div className="navbar-links">
          <Link to="/login" className="btn btn-outline">Login</Link>
          <Link to="/register" className="btn btn-primary">Sign Up</Link>
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">GLA University Library</div>
      <div className="navbar-links">
        <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <span className="nav-user-info">
          {user.name} ({user.role})
        </span>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
