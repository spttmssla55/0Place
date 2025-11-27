import React, { useState, useEffect } from 'react';
import KakaoMap from '../map/KakaoMap';
import FacilityCard from '../common/FacilityCard';
import { useGeolocation } from '../../hooks/useGeolocation';
import { getNearbyFacilities } from '../../services/facilityService';
import { calculateDistance } from '../../utils/distanceCalculator';
import './NearbyPage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function NearbyPage({ currentUser }) { // ★ currentUser 꼭 받기!
  const { location, error, loading } = useGeolocation();
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  // ======================= 즐겨찾기 (별) 관련 변경 부분 시작 =======================

  // (시설명 + 제공기관코드) 조합으로 만든 즐겨찾기 키 Set
  const [bookmarkedKeys, setBookmarkedKeys] = useState(new Set());

  // 로그인한 사용자의 즐겨찾기 목록을 백엔드에서 불러오기
  useEffect(() => {
    if (!currentUser) {
      setBookmarkedKeys(new Set());
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/favorites/${currentUser.id}`);
        if (!res.ok) return;
        const list = await res.json(); // Favorite 엔티티 리스트 (facilityName, providerCode)

        const keySet = new Set(
          list.map(fav => `${fav.facilityName}__${fav.providerCode}`)
        );
        setBookmarkedKeys(keySet);
      } catch (e) {
        console.error('즐겨찾기 로딩 실패:', e);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  // 별 클릭 시 즐겨찾기 추가/해제
  const handleBookmarkToggle = async (facility) => {
    if (!currentUser) {
      alert("로그인해야 즐겨찾기가 가능합니다.");
      return;
    }

    const key = `${facility.name}__${facility.providerCode}`;
    const isBookmarked = bookmarkedKeys.has(key);

    try {
      if (isBookmarked) {
        // 즐겨찾기 해제
        await fetch(
          `${API_BASE_URL}/api/favorites/remove?userId=${currentUser.id}&facilityName=${encodeURIComponent(facility.name)}`,
          { method: 'DELETE' }
        );
        const newSet = new Set(bookmarkedKeys);
        newSet.delete(key);
        setBookmarkedKeys(newSet);
      } else {
        // 즐겨찾기 추가
        await fetch(`${API_BASE_URL}/api/favorites/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: currentUser.id,
            facilityName: facility.name,
            providerCode: facility.providerCode
          })
        });
        const newSet = new Set(bookmarkedKeys);
        newSet.add(key);
        setBookmarkedKeys(newSet);
      }
    } catch (e) {
      console.error('즐겨찾기 처리 실패:', e);
    }
  };

  // ======================= 즐겨찾기 (별) 관련 변경 부분 끝 =======================

  // 추천 자동완성
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) return;
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchQuery, (results, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setSuggestions(results.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    });
  }, [searchQuery]);

  // 내 위치가 변경되면 "현재 위치"도 내 위치로 자동 이동
  useEffect(() => {
    if (location) {
      setCurrentPosition(location);
      fetchNearbyFacilities(location.lat, location.lng);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // 시설 목록 조회 함수(입력 좌표 기준)
  const fetchNearbyFacilities = async (lat, lng) => {
    try {
      const data = await getNearbyFacilities(lat, lng, 3);
      const facilitiesWithDistance = data.map(facility => ({
        ...facility,
        distance: calculateDistance(
          lat,
          lng,
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

  // 추천 목록 클릭 시: 현재 위치도 이 좌표로 변경
  const handleSuggestionClick = (sug) => {
    setSearchQuery(sug.place_name);
    setSuggestions([]);
    const pos = { lat: Number(sug.y), lng: Number(sug.x) };
    setCurrentPosition(pos);
    fetchNearbyFacilities(pos.lat, pos.lng);
  };

  // 직접 검색어로 엔터/검색버튼 눌렀을 때(최상단 결과 선택 효과)
  const handleSearch = () => {
    if (!searchQuery.trim() || !window.kakao?.maps?.services) return;
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchQuery, (results, status) => {
      if (status === window.kakao.maps.services.Status.OK && results.length > 0) {
        const sug = results[0];
        const pos = { lat: Number(sug.y), lng: Number(sug.x) };
        setCurrentPosition(pos);
        fetchNearbyFacilities(pos.lat, pos.lng);
        setSuggestions([]);
      } else {
        alert('장소를 찾을 수 없습니다.');
      }
    });
  };

  // 내 위치(Geolocation)로 다시 복귀
  const handleCurrentLocation = () => {
    if (location) {
      setCurrentPosition(location);
      fetchNearbyFacilities(location.lat, location.lng);
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
      <div className="search-section" style={{ position: 'relative' }}>
        <div className="search-container">
          <input
            type="text"
            placeholder="예: 서울역, 경복궁, 한강공원 ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
            onKeyPress={e => e.key === 'Enter' && handleSearch()}
            autoComplete="off"
          />
          <button onClick={handleSearch} className="btn-search">
            검색
          </button>
          <button onClick={handleCurrentLocation} className="btn-location">
            + 현재 위치 재설정
          </button>
        </div>
        {/* 자동완성 추천 주소 UI */}
        {suggestions.length > 0 && (
          <ul className="suggestion-list">
            {suggestions.map(sug => (
              <li
                key={sug.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(sug)}
              >
                {sug.place_name}
                <span className="suggestion-address">{sug.address_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* 메인 컨텐츠 */}
      <div className="main-content">
        {/* 지도 */}
        <div className="map-wrapper">
          <KakaoMap
            facilities={facilities}
            center={currentPosition}
            onMarkerClick={handleMarkerClick}
            mapId="nearby-map"
            myPosition={currentPosition}
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
              facilities.map(facility => {
                const key = `${facility.name}__${facility.providerCode}`;
                return (
                  <div
                    key={facility.id}
                    className={selectedFacility?.id === facility.id ? 'facility-item selected' : 'facility-item'}
                  >
                    <FacilityCard
                      facility={facility}
                      distance={facility.distance}
                      isBookmarked={bookmarkedKeys.has(key)}
                      onBookmarkToggle={handleBookmarkToggle}
                      user={currentUser}
                    />
                  </div>
                );
              })
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
