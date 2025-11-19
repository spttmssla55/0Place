import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* 히어로 섹션 */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            전국의 <span className="text-highlight">공공시설</span>을<br />
            가장 <span className="text-highlight-green">쉽고 빠르게</span> 예약하세요.
          </h1>
          <p className="hero-subtitle">
            공공장소 종합 예약 사이트 | 체육, 문화, 교육 시설 실시간 정보 제공
          </p>
          <div className="hero-buttons">
            <button 
              className="btn-hero-primary"
              onClick={() => navigate('/nationwide')}
            >
              시설 전체 둘러보기
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={() => navigate('/nearby')}
            >
              📍 내 주변 시설 찾기
            </button>
          </div>
        </div>
      </section>

      {/* 핵심 서비스 요약 */}
      <section className="features-section">
        <h2 className="section-title">핵심 서비스 요약</h2>
        <p className="section-description">공공시설 예약에 필요한 모든 것을 제공합니다.</p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">위치 기반</h3>
            <p className="feature-text">
              현재 위치를 기반으로 2km 이내의 시설을 지도로 쉽게 찾을 수 있습니다.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3 className="feature-title">간편 예약 및 결제</h3>
            <p className="feature-text">
              복잡한 절차 없이 시설의 무료 시설과 시설물을 빠르게 예약 및 결제할 수 있습니다.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔥</div>
            <h3 className="feature-title">카테고리</h3>
            <p className="feature-text">
              카테고리별로 분류하여 선택 가능.
            </p>
          </div>
        </div>
      </section>

      {/* 누적 이용 현황 */}
      <section className="stats-section">
        <h2 className="section-title">누적 이용 현황</h2>
        <p className="section-description">
          언제나지 우리 서비스를 통해 이루어진 예약 및 시설 현황입니다.
        </p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">3,200+</div>
            <div className="stat-label">등록 공공시설 수</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">45만+</div>
            <div className="stat-label">누적 예약 건수</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">사용자 만족도</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
