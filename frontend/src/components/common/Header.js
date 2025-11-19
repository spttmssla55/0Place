import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">OOPlace</Link>
        <nav className="nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            처음
          </Link>
          <Link 
            to="/nearby" 
            className={location.pathname === '/nearby' ? 'nav-link active' : 'nav-link'}
          >
            내 주변
          </Link>
          <Link 
            to="/nationwide" 
            className={location.pathname === '/nationwide' ? 'nav-link active' : 'nav-link'}
          >
            실시간
          </Link>
          <Link 
            to="/bookmark" 
            className={location.pathname === '/bookmark' ? 'nav-link active' : 'nav-link'}
          >
            즐겨찾기
          </Link>
        </nav>
        <button className="btn-login">로그인</button>
      </div>
    </header>
  );
}

export default Header;
