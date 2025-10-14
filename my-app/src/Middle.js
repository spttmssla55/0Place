// src/Middle.js
import React from "react";
import "./Middle.css";

const Middle = () => {
  return (
    <div className="middle-container">

      {/* 1. HERO SECTION */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <h1 className="main-title-hothaan">
            전국의 <span className="highlight-text-hothaan">공공시설</span>을
            <br />
            가장 <span className="highlight-text-hothaan">쉽고 빠르게</span> 예약하세요.
          </h1>
          <p className="subtitle-hothaan">
            공공장소 종합 예약 사이트 | 체육, 문화, 교육 시설 실시간 정보 제공
          </p>

          <div className="cta-group">
            <button className="cta-button primary">
              시설 전체 둘러보기
            </button>
            <button className="cta-button secondary">
              내 주변 시설 찾기 📍
            </button>
          </div>
        </div>
      </div>

      {/* 2. 서비스 요약 섹션 */}
      <div className="content-section service-summary-section">
        <div className="section-wrapper">
          <h2 className="section-title">핵심 서비스 요약</h2>
          <p className="section-subtitle">공공시설 예약에 필요한 모든 것을 제공합니다.</p>

          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-icon">🔍</span>
              <h3 className="card-title">실시간 검색 및 위치 기반</h3>
              <p className="card-text">현재 위치를 기반으로 2km 이내의 시설을 즉시 검색하고 지도로 확인합니다.</p>
            </div>
            <div className="summary-card">
              <span className="summary-icon">✅</span>
              <h3 className="card-title">간편 예약 및 결제</h3>
              <p className="card-text">복잡한 절차 없이 시설의 운영 시간과 사용료를 확인 후 바로 예약 및 결제할 수 있습니다.</p>
            </div>
            <div className="summary-card">
              <span className="summary-icon">🔥</span>
              <h3 className="card-title">인기 시설 추천</h3>
              <p className="card-text">규모가 크거나 무료 이용이 가능한 인기 시설을 별도로 분류하여 추천합니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 이용 현황 섹션 */}
      <div className="content-section status-section">
        <div className="section-wrapper">
          <h2 className="section-title">누적 이용 현황</h2>
          <p className="section-subtitle">현재까지 우리 서비스를 통해 이루어진 예약 및 시설 현황입니다.</p>

          <div className="status-metrics">
            <div className="metric-item">
              <p className="metric-number">3,200+</p>
              <p className="metric-label">등록 공공시설 수</p>
            </div>
            <div className="metric-item">
              <p className="metric-number">45만+</p>
              <p className="metric-label">누적 예약 건수</p>
            </div>
            <div className="metric-item">
              <p className="metric-number">98%</p>
              <p className="metric-label">사용자 만족도</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Middle;
