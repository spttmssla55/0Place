import React, { useState, useRef } from "react";
import LocationMap from "./LocationMap";
import "./Location.css";

const DEFAULT_CENTER = { lat: 37.5665, lng: 126.9780 };

const Location = () => {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [facilities, setFacilities] = useState([]);
  const mapRef = useRef(null); // 🔥 지도 조작용 참조

  // 카드 클릭 시 지도 이동
  const handleCardClick = (facility) => {
    if (!facility.lat || !facility.lng || !mapRef.current) return;
    const kakao = window.kakao;
    const map = mapRef.current;

    const target = new kakao.maps.LatLng(facility.lat, facility.lng);
    map.panTo(target);
    map.setLevel(4); // 줌인

    // 인포윈도우 표시
    const infoContent = `
      <div style="padding:8px; color:#1e293b; font-weight:600;">
        ${facility["개방시설명"] || "시설명 없음"}<br/>
        <span style="font-size:12px; color:#555;">${
          facility["소재지도로명주소"] ||
          facility["소재지지번주소"] ||
          "주소 정보 없음"
        }</span><br/>
        ${
          facility["무료개방여부"] === "Y"
            ? "무료 이용 가능"
            : facility["이용요금"]
            ? `유료 (${facility["이용요금"]})`
            : "요금 정보 없음"
        }<br/>
        ${
          facility["홈페이지주소"]
            ? `<a href="${facility["홈페이지주소"]}" target="_blank" style="color:#38a169;">예약하기 ▶</a>`
            : "<span style='color:#999;'>예약 링크 없음</span>"
        }
      </div>
    `;
    const infoWindow = new kakao.maps.InfoWindow({
      content: infoContent,
    });
    const marker = new kakao.maps.Marker({ position: target });
    infoWindow.open(map, marker);
  };

  return (
    <div className="location-page">
      <h2 className="location-title">📍 내 주변 공공시설 (3km 이내)</h2>

      <div className="location-content">
        {/* 지도 */}
        <div className="location-map-wrapper">
          <LocationMap
            center={center}
            onCenterChange={setCenter}
            onFacilitiesChange={setFacilities}
            mapRef={mapRef} // 🔥 mapRef 전달
          />
        </div>

        {/* 시설 카드 리스트 */}
        <div className="location-card-list">
          <h3>🏢 공공시설 목록 ({facilities.length}개)</h3>
          <div className="card-scroll">
            {facilities.length === 0 ? (
              <p className="placeholder">시설 데이터를 불러오는 중...</p>
            ) : (
              facilities.map((f, i) => (
                <div
                  key={i}
                  className="facility-card"
                  onClick={() => handleCardClick(f)}
                >
                  <h4>{f["개방시설명"] || "시설명 정보 없음"}</h4>
                  <p>
                    {f["소재지도로명주소"] ||
                      f["소재지지번주소"] ||
                      "주소 정보 없음"}
                  </p>
                  <p>
                    {f["무료개방여부"] === "Y"
                      ? "무료 이용 가능"
                      : f["이용요금"]
                      ? `유료 (${f["이용요금"]})`
                      : "요금 정보 없음"}
                  </p>
                  {f["홈페이지주소"] ? (
                    <a
                      href={f["홈페이지주소"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="facility-link"
                      onClick={(e) => e.stopPropagation()} // 클릭 버블링 방지
                    >
                      예약하기 ▶
                    </a>
                  ) : (
                    <span className="no-link">예약 링크 없음</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;
