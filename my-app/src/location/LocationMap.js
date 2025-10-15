import React, { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";
import "./LocationMap.css";
import SearchLocation from "./SearchLocation";

const { kakao } = window;
const API_BASE_URL = "http://localhost:8080/api/facilities";

const LocationMap = ({ center, onCenterChange, onFacilitiesChange, mapRef }) => {
  const localMapRef = useRef(null);
  const markersRef = useRef([]);
  const [facilities, setFacilities] = useState([]);
  const openInfoWindowRef = useRef(null);
  const circleRef = useRef(null);
  const triggerTypeRef = useRef(null); // 확대 트리거 관리: "search" | "location" | null

  // ✅ 시설 불러오기 (2km 반경)
  const loadFacilities = useCallback(async (centerPos) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/nearby`, {
        params: { lat: centerPos.lat, lng: centerPos.lng, distance: 2 },
      });
      setFacilities(res.data || []);
      if (onFacilitiesChange) onFacilitiesChange(res.data || []);
    } catch (err) {
      console.error("❌ 시설 데이터 불러오기 실패:", err);
    }
  }, [onFacilitiesChange]);

  // ✅ 현재 위치 재설정 버튼
  const handleCurrentLocation = useCallback(() => {
    if (!navigator.geolocation)
      return alert("⚠️ 브라우저가 위치 서비스를 지원하지 않습니다.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        triggerTypeRef.current = "location"; // ✅ 확대 허용
        const newCenter = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onCenterChange(newCenter);
        loadFacilities(newCenter);
      },
      () => alert("⚠️ 위치 정보를 불러올 수 없습니다. 권한을 확인하세요.")
    );
  }, [loadFacilities, onCenterChange]);

  // ✅ 지도 초기화
  useEffect(() => {
    kakao.maps.load(() => {
      const map = new kakao.maps.Map(localMapRef.current, {
        center: new kakao.maps.LatLng(center.lat, center.lng),
        level: 5,
      });
      mapRef.current = map;

      // ✅ 드래그 시 확대 금지
      kakao.maps.event.addListener(map, "dragend", () => {
        const c = map.getCenter();
        const newCenter = { lat: c.getLat(), lng: c.getLng() };
        triggerTypeRef.current = null; // ❌ 확대 금지
        onCenterChange(newCenter);
      });

      // 클릭 시 정보창 닫기
      kakao.maps.event.addListener(map, "click", () => {
        if (openInfoWindowRef.current) {
          openInfoWindowRef.current.close();
          openInfoWindowRef.current = null;
        }
      });

      loadFacilities(center);
    });
  }, [center, loadFacilities, mapRef, onCenterChange]);

  // ✅ 중심 변경 시 시설 다시 불러오기
  useEffect(() => {
    if (center && center.lat && center.lng) {
      loadFacilities(center);
    }
  }, [center, loadFacilities]);

  // ✅ 마커 및 원 표시
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // 이전 마커/원 제거
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    if (circleRef.current) circleRef.current.setMap(null);

    // ✅ 현재 위치 마커
    const redMarker = new kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
      new kakao.maps.Size(32, 40)
    );
    const myMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(center.lat, center.lng),
      map,
      image: redMarker,
    });
    markersRef.current.push(myMarker);

    // ✅ 확대 제어 로직
    if (triggerTypeRef.current === "search" || triggerTypeRef.current === "location") {
      map.setLevel(5); // 확대 허용
      map.panTo(new kakao.maps.LatLng(center.lat, center.lng));
    } else {
      // ❌ 드래그 시 확대 금지 → 부드럽게 이동만
      const moveLatLon = new kakao.maps.LatLng(center.lat, center.lng);
      map.relayout();
      map.setCenter(moveLatLon); // 확대 없이 중심만 이동
    }

    triggerTypeRef.current = null; // 매번 초기화

    // ✅ 2km 반경 원
    const circle = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(center.lat, center.lng),
      radius: 2000,
      strokeWeight: 3,
      strokeColor: "#38a169",
      strokeOpacity: 0.8,
      fillColor: "#38a169",
      fillOpacity: 0.1,
    });
    circle.setMap(map);
    circleRef.current = circle;

    // ✅ 시설 마커
    facilities.forEach((f) => {
      if (!f.lat || !f.lng) return;
      const marker = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(f.lat, f.lng),
        map,
      });

      const infoWindow = new kakao.maps.InfoWindow({
        content: `
          <div style="padding:8px;font-size:13px;">
            <strong>${f["개방시설명"] || "시설명 없음"}</strong><br/>
            ${f["소재지도로명주소"] || f["소재지지번주소"] || "주소 정보 없음"}<br/>
            ${
              f["무료개방여부"] === "Y"
                ? "무료 이용 가능"
                : f["이용요금"]
                ? `유료 (${f["이용요금"]})`
                : "요금 정보 없음"
            }<br/>
            ${
              f["홈페이지주소"]
                ? `<a href="${f["홈페이지주소"]}" target="_blank" style="color:#38a169;">예약하기 ▶</a>`
                : "<span style='color:#999;'>예약 링크 없음</span>"
            }
          </div>
        `,
      });

      kakao.maps.event.addListener(marker, "click", () => {
        if (openInfoWindowRef.current) openInfoWindowRef.current.close();
        infoWindow.open(map, marker);
        openInfoWindowRef.current = infoWindow;
      });

      markersRef.current.push(marker);
    });
  }, [facilities, center, mapRef]);

  return (
    <div className="locationmap-container">
      <div className="locationmap-controls">
        <SearchLocation
          onSearch={(coords) => {
            triggerTypeRef.current = "search"; // ✅ 검색 시 확대 허용
            onCenterChange(coords);
          }}
        />
        <button className="locationmap-button" onClick={handleCurrentLocation}>
          📍 현재 위치 재설정
        </button>
      </div>
      <div ref={localMapRef} className="locationmap-map"></div>
    </div>
  );
};

export default LocationMap;
