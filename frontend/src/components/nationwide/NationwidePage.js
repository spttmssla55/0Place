import React, { useState, useEffect } from 'react';
import KakaoMap from '../map/KakaoMap';
import FacilityCard from '../common/FacilityCard';
import { getAllFacilities } from '../../services/facilityService';
import './NationwidePage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function NationwidePage({ currentUser }) {
  const [allFacilities, setAllFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  // ======================= 즐겨찾기 (별) 관련 변경 부분 시작 =======================

  // (userId, facilityName, providerCode) 기준으로 만든 키 Set
  const [bookmarkedKeys, setBookmarkedKeys] = useState(new Set());

  // 로그인한 사용자의 즐겨찾기 목록을 백엔드에서 불러오기
  useEffect(() => {
    if (!currentUser) {
      setBookmarkedKeys(new Set());
      return;
    }

    const fetchFavorites = async () => {
      try {
        // /api/favorites/{userId} → Favorite 엔티티 리스트 (facilityName, providerCode 포함)
        const res = await fetch(`${API_BASE_URL}/api/favorites/${currentUser.id}`);
        if (!res.ok) return;
        const list = await res.json();

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

    // FacilityController에서 내려온 name / providerCode 사용
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

  // 전국 광역시·도/구 세팅 (기존 그대로)
  const cities = [
    '서울', '부산', '대구', '인천', '대전', '울산', '세종',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  ];
  const districts = {
    // (생략: 기존 하드코딩 내용 그대로)
    '서울': ['강남구', '강동구', '강북구', /*...*/ '중구', '중랑구'],
    // 부산, 대구 등도 기존 데이터 유지
  };

  const getDistrictsForCity = (city, facilities) => {
    // (생략: 기존 구현 그대로 사용)
    if (!city) return [];
    // 이하 자동 district 추출 로직 동일
    // ...
    return []; // 구현 내용 그대로 들어가면 됩니다
  };

  useEffect(() => {
    fetchAllFacilities();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, selectedDistrict, allFacilities]);

  const fetchAllFacilities = async () => {
    try {
      const data = await getAllFacilities();
      data.forEach(facility => {
        if (facility.address && typeof facility.address === "string" && facility.address.split(' ').length >= 2) {
          const [city, district] = facility.address.split(' ');
          facility.city = city;
          facility.district = district;
        } else {
          facility.city = "";
          facility.district = "";
        }
        if (typeof facility.lat !== "number") facility.lat = parseFloat(facility.lat);
        if (typeof facility.lng !== "number") facility.lng = parseFloat(facility.lng);
      });
      setAllFacilities(data);
      setFilteredFacilities(data);
    } catch (err) {
      console.error('시설 정보 로딩 실패:', err);
    }
  };

  // address 포함 체크 방식 필터!
  const applyFilters = () => {
    let filtered = allFacilities;
    if (selectedCity) {
      filtered = filtered.filter(
        f => f.address && f.address.includes(selectedCity === "전남" ? "전라남도" : selectedCity)
      );
    }
    if (selectedDistrict) {
      filtered = filtered.filter(
        f => f.address && f.address.includes(selectedDistrict)
      );
    }
    setFilteredFacilities(filtered);
    if (filtered.length > 0) {
      const avgLat = filtered.reduce((sum, f) => sum + f.lat, 0) / filtered.length;
      const avgLng = filtered.reduce((sum, f) => sum + f.lng, 0) / filtered.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedDistrict('');
    setIsCityDropdownOpen(false);
  };
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setIsDistrictDropdownOpen(false);
  };

  const getCategoryFacilities = (category) => {
    return filteredFacilities.filter(f => {
      if (category === '기타') {
        return !['체육관', '공원', '문화센터', '도서관'].includes(f.category);
      }
      return f.category === category;
    });
  };

  return (
    <div className="nationwide-page">
      {/* 상단 필터 영역 */}
      <div className="filter-bar">
        <div className="dropdown-container">
          {/* 도/시 선택 */}
          <div className="dropdown">
            <button
              className="dropdown-button"
              onClick={() => {
                setIsCityDropdownOpen(!isCityDropdownOpen);
                setIsDistrictDropdownOpen(false);
              }}
            >
              {selectedCity || '도/시 선택'}
              <span className="dropdown-arrow">▼</span>
            </button>
            {isCityDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => handleCitySelect('')}>
                  전체
                </div>
                {cities.map(city => (
                  <div
                    key={city}
                    className="dropdown-item"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* 구/시/군 선택 */}
          <div className="dropdown">
            <button
              className="dropdown-button"
              onClick={() => {
                setIsDistrictDropdownOpen(!isDistrictDropdownOpen);
                setIsCityDropdownOpen(false);
              }}
              disabled={!selectedCity}
            >
              {selectedDistrict || '구/시/군 선택'}
              <span className="dropdown-arrow">▼</span>
            </button>
            {isDistrictDropdownOpen && selectedCity && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => handleDistrictSelect('')}>
                  전체
                </div>
                {getDistrictsForCity(selectedCity, allFacilities).map(district => (
                  <div
                    key={district}
                    className="dropdown-item"
                    onClick={() => handleDistrictSelect(district)}
                  >
                    {district}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="map-section">
        <KakaoMap
          facilities={filteredFacilities}
          center={mapCenter}
          mapId="nationwide-map"
        />
      </div>

      {/* 카테고리별 시설 목록 */}
      <div className="categories-section">
        {['체육관', '공원', '문화센터', '도서관', '기타'].map(category => {
          const categoryFacilities = getCategoryFacilities(category);
          if (categoryFacilities.length === 0) return null;
          return (
            <div key={category} className="category-row">
              <div className="category-header">
                <h2>{category}</h2>
                <span className="category-count">({categoryFacilities.length}개)</span>
              </div>
              <div className="category-scroll">
                {categoryFacilities.map((facility, idx) => {
                  const key = `${facility.name}__${facility.providerCode}`;
                  return (
                    <div
                      key={`${facility.name}-${facility.lat}-${facility.lng}-${idx}`}
                      className="facility-item"
                    >
                      <FacilityCard
                        facility={facility}
                        distance={facility.distance}
                        // 여기서 카드별 별 상태 결정
                        isBookmarked={bookmarkedKeys.has(key)}
                        onBookmarkToggle={handleBookmarkToggle}
                        user={currentUser}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NationwidePage;
