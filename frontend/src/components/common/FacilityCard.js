import React from 'react';
import './FacilityCard.css';

function FacilityCard({ facility, distance }) {
  // 홈페이지 주소 정제 함수
  const getHomepageUrl = (homepage) => {
    if (!homepage) return null;
    // 공백 문자열 및 하이픈(-) 무시
    const cleaned = String(homepage).trim();
    if (!cleaned || cleaned === '-') return null;
    // http/https 미포함시 붙이기
    if (!/^https?:\/\//i.test(cleaned)) return 'https://' + cleaned;
    return cleaned;
  };

  const homepageUrl = getHomepageUrl(facility.homepage);

  return (
    <div className="facility-card">
      <div className="card-header">
        <h3>{facility.name || '-'}</h3>
        {distance !== undefined && (
          <span className="distance">{distance.toFixed(2)}km</span>
        )}
      </div>
      <div className="card-body">
        <div className="info-row">
          <span className="label">시설명:</span>
          <span className="value">{facility.place || '-'}</span>
        </div>
        <div className="info-row">
          <span className="label">위치:</span>
          <span className="value">{facility.address || '-'}</span>
        </div>
        <div className="info-row">
          <span className="label">카테고리:</span>
          <span className="value">{facility.category || '-'}</span>
        </div>
      </div>
      <div className="card-footer">
        {homepageUrl ? (
          <a
            href={homepageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-reserve"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            예약하기
          </a>
        ) : (
          <button className="btn-reserve" disabled>
            현장예약
          </button>
        )}
      </div>
    </div>
  );
}

export default FacilityCard;
