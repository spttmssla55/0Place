import React, { useState, useEffect } from "react";
import FacilityCard from "./FacilityCard";
import "./FacilitySlider.css";

const FacilitySlider = ({ facilities }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    // 시설 목록이 변경되면 인덱스를 0으로 초기화
    setCurrentIndex(0);
  }, [facilities]);

  const totalPages = Math.ceil(facilities.length / itemsPerPage);

  const nextPage = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  // 시설이 없을 경우 메시지
  if (facilities.length === 0) {
      return (
          <div className="slider-container" style={{ justifyContent: 'center', alignItems: 'center', color: '#888' }}>
              <p>선택하신 기준에 맞는 시설이 주변에 없습니다.</p>
          </div>
      );
  }

  return (
    <div className="slider-container">
      <div className="card-list">
        <div
          className="card-wrapper"
          style={{ 
              // 전체 시설 목록을 itemsPerPage 단위로 페이지화하기 위해 전체 너비 설정
              width: `${totalPages * 100}%`,
              // 현재 페이지로 이동
              transform: `translateX(-${currentIndex * 100 / totalPages}%)`, 
          }}
        >
          {facilities.map((facility, index) => (
            // ⭐️ 각 카드가 itemsPerPage의 비율을 차지하도록 설정 (33.333%가 됨)
            <div 
                key={index} 
                className="facility-card-wrapper" 
                style={{ 
                    flexShrink: 0,
                    width: `${100 / itemsPerPage}%`, 
                    padding: '0 8px', // 카드 간격
                    boxSizing: 'border-box',
                    height: '100%'
                }}
            >
                <FacilityCard facility={facility} />
            </div>
          ))}
        </div>
      </div>

      <div className="arrow-container">
        <button
          className="arrow-button"
          onClick={prevPage}
          disabled={currentIndex === 0}
        >
          ⬅ 이전
        </button>
        <div style={{ alignSelf: 'center', color: '#666', fontSize: '0.9rem' }}>
            {currentIndex + 1} / {totalPages}
        </div>
        <button
          className="arrow-button"
          onClick={nextPage}
          disabled={currentIndex === totalPages - 1}
        >
          다음 ➡
        </button>
      </div>
    </div>
  );
};

export default FacilitySlider;