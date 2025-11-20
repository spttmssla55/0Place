import React, { useState, useEffect } from 'react';
import KakaoMap from '../map/KakaoMap';
import FacilityCard from '../common/FacilityCard';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getNearbyFacilities } from '../../services/facilityService';
import { calculateDistance } from '../../utils/distanceCalculator';
import './NearbyPage.css';

function NearbyPage() {
  const { location, error, loading } = useGeolocation();
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (location) {
      fetchNearbyFacilities();
    }
  }, [location]);

  const fetchNearbyFacilities = async () => {
    try {
      const data = await getNearbyFacilities(
        location.lat,
        location.lng,
        3
      );
      
      const facilitiesWithDistance = data.map(facility => ({
        ...facility,
        distance: calculateDistance(
          location.lat,
          location.lng,
          facility.latitude,
          facility.longitude
        )
      }));

      facilitiesWithDistance.sort((a, b) => a.distance - b.distance);
      setFacilities(facilitiesWithDistance);
    } catch (err) {
      console.error('시설 정보 로딩 실패:', err);
    }
  };

  const handleMarkerClick = (facility) => {
    setSelectedFacility(facility);
  };

  const handleSearch = () => {
    console.log('검색:', searchQuery);
  };

  const handleCurrentLocation = () => {
    if (location) {
      fetchNearbyFacilities();
    }
  };

  if (loading) {
    return <div className="loading">위치 정보를 가져오는 중...</div>;
  }

  if (error) {
    return <div className="error">위치 정보 오류: {error}</div>;
  }

  return (
    <div className="nearby-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <h1 className="page-title">
          📍 <span className="title-highlight">내 주변 공공시설 (3km 이내)</span>
        </h1>
      </div>

      {/* 검색 영역 */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="예: 서울역, 경복궁, 한강공원 ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn-search">
            검색
          </button>
          <button onClick={handleCurrentLocation} className="btn-location">
            + 현재 위치 재설정
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="main-content">
        {/* 지도 */}
        <div className="map-wrapper">
          <KakaoMap
          facilities={facilities}
          center={location}
          onMarkerClick={handleMarkerClick}
          mapId="nearby-map"
          myPosition={location}  // ← 내 위치 마커 추가!
        />
        </div>

        {/* 시설 목록 */}
        <div className="facilities-wrapper">
          <div className="facilities-header">
            <h2>
              🏢 공공시설 목록 <span className="facilities-count">({facilities.length}개)</span>
            </h2>
          </div>
          
          <div className="facilities-list">
            {facilities.length > 0 ? (
              facilities.map(facility => (
                <div 
                  key={facility.id}
                  className={selectedFacility?.id === facility.id ? 'facility-item selected' : 'facility-item'}
                >
                  <FacilityCard
                    facility={facility}
                    distance={facility.distance}
                  />
                </div>
              ))
            ) : (
              <p className="no-data">시설 데이터를 불러오는 중...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NearbyPage;
