// src/Headerr.js

import React from 'react';
import './Header.css';

const Headerr = () => {
  return (
    <header className="header-container">
      <div className="logo-section">
        <a href="/" className="logo">00Place</a>
        <a href="/" className="login">로그인</a>
      </div>
      <div className="nav-menu-section">
        <nav className="nav-menu">
          <ul>
            <li><a href="/">지역</a></li>
            <li><a href="/">내 주변</a></li>
            <li><a href="/">실시간</a></li>
            <li><a href="/">즐겨찾기</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Headerr;