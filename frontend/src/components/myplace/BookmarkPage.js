import React, { useState, useEffect, useMemo } from 'react';
import KakaoMap from '../map/KakaoMap';
import FacilityCard from '../common/FacilityCard';
import './BookmarkPage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function BookmarkPage({ user }) {
  const [bookmarked, setBookmarked] = useState([]);

  // 즐겨찾기 로딩(로그인 사용자의 즐겨찾기 시설만!)
  useEffect(() => {
    if (!user) {
      setBookmarked([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        // 백엔드에서 즐겨찾기 시설 실제 정보 가져오기
        const res = await fetch(`${API_BASE_URL}/api/favorites/facilities/${user.id}`);
        if (!res.ok) return;
        const data = await res.json();
        setBookmarked(data);
      } catch (e) {
        console.error('즐겨찾기 시설 로딩 실패:', e);
      }
    };

    fetchFavorites();
  }, [user]);

  // 즐겨찾기 해제
  const handleBookmarkToggle = async (facility) => {
    if (!user) return;

    try {
      await fetch(
        `${API_BASE_URL}/api/favorites/remove?userId=${user.id}&facilityName=${encodeURIComponent(facility.name)}`,
        { method: 'DELETE' }
      );
      setBookmarked(prev => prev.filter(f => f.name !== facility.name));
    } catch (e) {
      console.error('즐겨찾기 해제 실패:', e);
    }
  };

  // 도/시 그룹별로 즐겨찾기 데이터 묶기
  const groupedByCityDistrict = useMemo(() => {
    const groups = {};
    bookmarked.forEach(facility => {
      let city = '', district = '';
      if (facility.address && typeof facility.address === "string") {
        const arr = facility.address.split(' ');
        city = arr[0] || '';
        district = arr[1] || '';
      }
      const key = `${city} ${district}`.trim();
      if (!groups[key]) groups[key] = [];
      groups[key].push(facility);
    });
    return groups;
  }, [bookmarked]);

  // 지도 위에 즐겨찾기 시설만 마커로 표시
  const mapCenter = useMemo(() => {
    if (bookmarked.length === 0) return { lat: 37.5665, lng: 126.9780 };
    const avgLat = bookmarked.reduce((sum, f) => sum + f.lat, 0) / bookmarked.length;
    const avgLng = bookmarked.reduce((sum, f) => sum + f.lng, 0) / bookmarked.length;
    return { lat: avgLat, lng: avgLng };
  }, [bookmarked]);

  // 즐겨찾기 여부 체크용 키셋 (시설명 + 제공기관코드)
  const bookmarkedKeySet = useMemo(() => {
    return new Set(bookmarked.map(f => `${f.name}__${f.providerCode}`));
  }, [bookmarked]);

  return (
    <div className="bookmark-page">
      <h2 style={{ marginLeft: "650px" }}>⭐ 내 즐겨찾기 공공시설</h2>
      <div className="map-section">
        <KakaoMap
          facilities={bookmarked}
          center={mapCenter}
          mapId="bookmark-map"
        />
      </div>
      <div className="groups-section">
        {Object.keys(groupedByCityDistrict).length === 0 ? (
          <div style={{ color: "#aaa", padding: "40px 0", textAlign: "center" }}>
            즐겨찾기된 시설이 없습니다.
          </div>
        ) : (
          Object.entries(groupedByCityDistrict).map(([group, facilities]) => (
            <div key={group} className="group-row">
              <div className="group-header">
                <h3 style={{ color: "#ffd600", marginBottom: 7 }}>{group}</h3>
                <span style={{ color: "#aaa" }}>({facilities.length}개)</span>
              </div>
              <div className="group-cards">
                {facilities.map((facility, idx) => {
                  const key = `${facility.name}__${facility.providerCode}`;
                  return (
                    <FacilityCard
                      key={`${facility.name}-${facility.lat}-${facility.lng}-${idx}`}
                      facility={facility}
                      distance={facility.distance}
                      isBookmarked={bookmarkedKeySet.has(key)}
                      onBookmarkToggle={handleBookmarkToggle}
                      user={user}
                    />
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default BookmarkPage;
