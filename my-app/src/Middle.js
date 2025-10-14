import React, { useEffect, useState } from "react";
import Map from "./Map";
import FacilitySlider from "./components/FacilitySlider";
import "./Middle.css";

// ⭐️ 클라이언트 측 거리 계산 함수 (하버사인 공식)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 탭 정의
const TABS = {
  NEARBY: "nearby",
  HOT_SIZE: "hot-size",
  HOT_FREE: "hot-free",
};
const SEARCH_RADIUS_KM = 2; // 검색 반경 2km

const Middle = () => {
  const [facilities, setFacilities] = useState([]); // JSON에서 로드된 전체 시설 목록
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 현재 지도 중심 좌표
  const [currentTab, setCurrentTab] = useState(TABS.NEARBY); 
  const [displayFacilities, setDisplayFacilities] = useState([]); // 현재 슬라이더에 표시할 시설 목록

  // 1. JSON 데이터 로드
  useEffect(() => {
    fetch("/전국공공시설개방정보표준데이터.json")
      .then((res) => res.json())
      .then((data) => {
        if (data.records) {
             // ⭐️ 위도/경도 파싱 및 유효성 검사
            const validFacilities = data.records.map(f => {
                f.lat = parseFloat(f['위도']);
                f.lng = parseFloat(f['경도']);
                // 면적/인원수 숫자 파싱 (정렬에 사용)
                try {
                    f.area = parseFloat(f['면적'].replace(/,/g, ''));
                } catch {
                    f.area = 0;
                }
                try {
                    f.capacity = parseInt(f['수용가능인원수'].replace(/,/g, ''));
                } catch {
                    f.capacity = 0;
                }
                return f;
            }).filter(f => !isNaN(f.lat) && !isNaN(f.lng) && f.lat !== 0 && f.lng !== 0);
            
            setFacilities(validFacilities);
        }
      })
      .catch((err) => console.error("시설 데이터 로드 실패:", err));
  }, []);

  // 2. 중심 좌표 또는 탭이 변경될 때마다 시설 목록 업데이트 (클라이언트 필터링/정렬)
  useEffect(() => {
    if (facilities.length === 0) return;

    // 2.1. 2km 이내 시설 필터링
    let filtered = facilities.filter((f) => {
        return getDistance(center.lat, center.lng, f.lat, f.lng) <= SEARCH_RADIUS_KM;
    });

    // 2.2. 탭에 따른 정렬/재필터링
    switch (currentTab) {
      case TABS.NEARBY:
        // 내 주변: 거리순 정렬 (가까운 순)
        filtered.sort((a, b) => {
            const distA = getDistance(center.lat, center.lng, a.lat, a.lng);
            const distB = getDistance(center.lat, center.lng, b.lat, b.lng);
            return distA - distB;
        });
        break;

      case TABS.HOT_SIZE:
        // 핫한 규모: 면적 또는 인원수 중 큰 값으로 내림차순 정렬 (상위 20%만 사용)
        filtered.sort((a, b) => Math.max(b.area, b.capacity) - Math.max(a.area, a.capacity));
        filtered = filtered.slice(0, Math.ceil(filtered.length * 0.2));
        break;

      case TABS.HOT_FREE:
        // 핫한 무료: 무료 시설만 필터링 후, 면적으로 내림차순 정렬 (상위 20%만 사용)
        filtered = filtered.filter(f => f['유료사용여부'] !== 'Y' || f['사용료'].trim() === '0');
        filtered.sort((a, b) => b.area - a.area);
        filtered = filtered.slice(0, Math.ceil(filtered.length * 0.2));
        break;

      default:
        break;
    }
    
    setDisplayFacilities(filtered);
    
  }, [center, currentTab, facilities]);


  const handleCenterChange = (newCenter) => {
    setCenter(newCenter);
  };

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };
  
  // 탭 제목 표시
  const getTabTitle = () => {
    let title = "시설 목록";
    let style = {};

    switch (currentTab) {
      case TABS.NEARBY:
        title = `📍 내 주변 시설 (${SEARCH_RADIUS_KM}km 이내)`;
        style.color = '#1ab2a6';
        break;
      case TABS.HOT_SIZE:
        title = `🔥 핫한 규모 시설 (상위 20%)`;
        style.color = '#9933ff'; 
        break;
      case TABS.HOT_FREE:
        title = `🆓 핫한 무료 시설 (상위 20%)`;
        style.color = '#ff9900'; 
        break;
      default:
        break;
    }

    return (
        <h4>
            <span style={style}>{title}</span> 
            <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#888', marginLeft: '10px' }}>
                ({displayFacilities.length}개)
            </span>
        </h4>
    );
  };


  return (
    <div className="middle-container">
      <div className="map-container">
        <Map
          facilities={facilities} 
          center={center}
          onCenterChange={handleCenterChange}
        />
      </div>

      <div className="facility-container">
        {/* 탭 메뉴 컴포넌트 */}
        <div className="tab-menu">
          <button 
            className={`tab-button ${currentTab === TABS.NEARBY ? 'active' : ''}`}
            onClick={() => handleTabChange(TABS.NEARBY)}
          >
            내 주변
          </button>
          <button 
            className={`tab-button ${currentTab === TABS.HOT_SIZE ? 'active' : ''}`}
            onClick={() => handleTabChange(TABS.HOT_SIZE)}
          >
            핫한 규모
          </button>
          <button 
            className={`tab-button ${currentTab === TABS.HOT_FREE ? 'active' : ''}`}
            onClick={() => handleTabChange(TABS.HOT_FREE)}
          >
            핫한 무료
          </button>
        </div>
        
        {getTabTitle()}
        
        <FacilitySlider facilities={displayFacilities} />
      </div>
    </div>
  );
};

export default Middle;