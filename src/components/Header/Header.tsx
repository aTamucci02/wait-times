import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { UserContext } from '../../contexts/UserContext';

const Header: React.FC = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('UserContext must be used within a UserProvider');
  }

  const { user, logout } = context;

  const handleLogout = () => {
    logout();
    localStorage.removeItem('jwtToken');
  };

  return (
    <header className="header">
      <h1 className="header-title">Disney Park Wait Times</h1>
      <nav className="header-nav">
        {user ? (
          <>
            <span className="user-greeting">Welcome, {user.first_name}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-button">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
