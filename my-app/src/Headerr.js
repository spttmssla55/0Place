import React, { useState } from 'react';
import './Header.css';

const Headerr = () => {
  // 클릭한 메뉴를 추적하는 state
  const [activeMenu, setActiveMenu] = useState(""); // 초기값 "" → 아무것도 선택 안됨

  // 메뉴 클릭 시 호출
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <header className="header-container">
      
      {/* 상단: 로고 + 로그인 */}
      <div className="main-header-bar">
        <div className="logo-section">
          <a href="/" className="logo">00Place</a>
        </div>
        <a href="/" className="login">로그인</a>
      </div>
    
      {/* 하단: 내비게이션 메뉴 */}
      <nav className="nav-menu-bar">
        <div className="nav-menu-wrapper">
          <ul className="nav-menu">
            <li>
              <a 
                href="/" 
                className={activeMenu === "지역" ? "active" : ""}
                onClick={() => handleMenuClick("지역")}
              >
                지역
              </a>
            </li>
            <li>
              <a 
                href="/" 
                className={activeMenu === "내 주변" ? "active" : ""}
                onClick={() => handleMenuClick("내 주변")}
              >
                내 주변
              </a>
            </li>
            <li>
              <a 
                href="/" 
                className={activeMenu === "실시간" ? "active" : ""}
                onClick={() => handleMenuClick("실시간")}
              >
                실시간
              </a>
            </li>
            <li>
              <a 
                href="/" 
                className={activeMenu === "즐겨찾기" ? "active" : ""}
                onClick={() => handleMenuClick("즐겨찾기")}
              >
                즐겨찾기
              </a>
            </li>
          </ul>
        </div>
      </nav>
      
    </header>
  );
};

export default Headerr;
