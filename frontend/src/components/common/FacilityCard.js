import React from 'react';
import './FacilityCard.css';

function FacilityCard({
  facility,
  distance,
  isBookmarked,
  onBookmarkToggle,
  user
}) {
  // 홈페이지 주소 정제 함수
  const getHomepageUrl = (homepage) => {
    if (!homepage) return null;
    const cleaned = String(homepage).trim();
    if (!cleaned || cleaned === '-') return null;
    if (!/^https?:\/\//i.test(cleaned)) return 'https://' + cleaned;
    return cleaned;
  };

  const homepageUrl = getHomepageUrl(facility.homepage);

  // 별(즐겨찾기) 버튼 클릭시: 로그인 체크 + 콜백
  const handleBookmarkClick = () => {
    if (!user) {
      alert("로그인해야 즐겨찾기가 가능합니다.");
      return;
    }
    if (onBookmarkToggle) onBookmarkToggle(facility);
  };

  return (
    <div className="facility-card">
      <div className="card-header" style={{ display: "flex", alignItems: "center" }}>
        <h3 style={{ flex: 1 }}>{facility.name || '-'}</h3>

        {/* 즐겨찾기(별) 버튼 */}
        <button
          className={isBookmarked ? "bookmark-btn active" : "bookmark-btn"}
          onClick={handleBookmarkClick}
          title={isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          style={{
            fontSize: 26,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: isBookmarked ? "#ffe277" : "#bbb",
            marginLeft: 10
          }}
        >
          {isBookmarked ? "⭐" : "☆"}
        </button>
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
        {distance !== undefined && (
          <div className="info-row">
            <span className="label">거리:</span>
            <span className="value">{distance.toFixed(2)} km</span>
          </div>
        )}
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
