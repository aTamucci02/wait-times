// src/components/Header/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="header-title">Disney Park Wait Times</h1>
      <nav className="header-nav">
        <Link to="/login" className="login-button">
          Login
        </Link>
      </nav>
    </header>
  );
}

export default Header;
