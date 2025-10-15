import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Headerr = () => {
  const [activeMenu, setActiveMenu] = useState("");

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  return (
    <header className="header-container">
      <div className="main-header-bar">
        <div className="logo-section">
          <Link to="/" className="logo">00Place</Link>
        </div>
        <Link to="/" className="login">로그인</Link>
      </div>

      <nav className="nav-menu-bar">
        <ul className="nav-menu">
          <li>
            <Link
              to="/"
              className={activeMenu === "지역" ? "active" : ""}
              onClick={() => handleMenuClick("지역")}
            >
              지역
            </Link>
          </li>
          <li>
            <Link
              to="/location"
              className={activeMenu === "내 주변" ? "active" : ""}
              onClick={() => handleMenuClick("내 주변")}
            >
              내 주변
            </Link>
          </li>
          <li>
            <Link
              to="/realtime"
              className={activeMenu === "실시간" ? "active" : ""}
              onClick={() => handleMenuClick("실시간")}
            >
              실시간
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className={activeMenu === "즐겨찾기" ? "active" : ""}
              onClick={() => handleMenuClick("즐겨찾기")}
            >
              즐겨찾기
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Headerr;
