import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ user, onLoginClick, onLogout, onUserClick }) {
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
            홈
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
            전국
          </Link>
          <Link 
            to="/bookmark" 
            className={location.pathname === '/bookmark' ? 'nav-link active' : 'nav-link'}
          >
            즐겨찾기
          </Link>
        </nav>
        {user
          ? (
            <span>
              <span
                className="user-name"
                onClick={onUserClick}
                style={{ cursor: "pointer", marginRight: 8 }}
                title="프로필 수정"
              >
                <b>{user.name}</b>님
              </span>
              <button className="btn-login" onClick={onLogout}>로그아웃</button>
            </span>
          )
          : <button className="btn-login" onClick={onLoginClick}>로그인</button>
        }
      </div>
    </header>
  );
}

export default Header;
