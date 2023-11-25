import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';  // Assuming you might want to style it later.

const NavBar = () => {
  return (
    <div className="nav-bar">
      <Link to="/home">
        <div className="nav-item">🏠</div>
      </Link>
      <Link to="/ladder">
        <div className="nav-item">📊</div>
      </Link>
      <Link to="/profile">
        <div className="nav-item">👤</div>
      </Link>
      <Link to="/trends">
        <div className="nav-item">📈</div>
      </Link>
      <Link to="/friends-feed">
        <div className="nav-item">👥</div>
      </Link>
    </div>
  );
};

export default NavBar;