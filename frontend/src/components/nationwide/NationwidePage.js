import React, { useState, useEffect } from 'react';
import KakaoMap from '../map/KakaoMap';
import FacilityCard from '../common/FacilityCard';
import { getAllFacilities } from '../../services/facilityService';
import './NationwidePage.css';

function NationwidePage() {
  const [allFacilities, setAllFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.9780 });
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  // 전국 광역시·도 (광주광역시는 cities에 포함 X)
  const cities = [
    '서울', '부산', '대구', '인천', '대전', '울산', '세종',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  ];
  // 주요 광역시 districts 하드코딩 (나머지 도는 자동)
  const districts = {
    '서울': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    '부산': ['강서구', '금정구', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구'],
    '대구': ['남구', '달서구', '동구', '북구', '서구', '수성구', '중구', '달성군'],
    '인천': ['계양구', '남동구', '동구', '미추홀구', '부평구', '서구', '연수구', '중구', '강화군', '옹진군'],
    // 추가 필요시 여기에
  };

  // 시/군/구 목록 자동생성 함수
  const getDistrictsForCity = (city, facilities) => {
    if (!city) return [];
    // 1. 경기도 - 모든 '시' 자동
    if (city === '경기' || city === '경기도') {
      const siSet = new Set();
      facilities.forEach(f => {
        if (f.address && f.address.startsWith('경기도')) {
          const arr = f.address.split(' ');
          if (arr.length >= 2 && arr[1].endsWith('시')) {
            siSet.add(arr[1]);
          }
        }
      });
      return Array.from(siSet).sort();
    }
    // 2. 전라남도 - '시', '군' 모두
    if (city === '전남' || city === '전라남도') {
      const set = new Set();
      facilities.forEach(f => {
        if (f.address && f.address.startsWith('전라남도')) {
          const arr = f.address.split(' ');
          if (arr.length >= 2 && (arr[1].endsWith('시') || arr[1].endsWith('군'))) set.add(arr[1]);
          if (arr.length >= 3 && arr[2].endsWith('군')) set.add(arr[2]);
        }
      });
      return Array.from(set).sort();
    }
    // 3. 나머지 광역시(하드), 도('시/군' 2,3토큰 자동)
    if (districts[city]) return districts[city];
    const set = new Set();
    facilities.forEach(f => {
      if (f.address && f.address.startsWith(city)) {
        const arr = f.address.split(' ');
        if (arr.length >= 2 && arr[1].endsWith('시')) set.add(arr[1]);
        if (arr.length >= 3 && arr[2].endsWith('군')) set.add(arr[2]);
      }
    });
    return Array.from(set).sort();
  };

  useEffect(() => {
    fetchAllFacilities();
  }, []);

  useEffect(() => {
    applyFilters();
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

          {/* 구/시/군 선택 (동적 districts 생성) */}
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
                {categoryFacilities.map((facility, idx) => (
                  <div key={`${facility.name}-${facility.lat}-${facility.lng}-${idx}`} className="facility-item">
                    <FacilityCard facility={facility} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NationwidePage;
