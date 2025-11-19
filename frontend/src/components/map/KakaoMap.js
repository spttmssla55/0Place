import React, { useEffect, useRef } from 'react';
import './KakaoMap.css';

// mapId는 반드시 고정!
function KakaoMap({ facilities, center, onMarkerClick, mapId = 'nationwide-map' }) {
  const mapRef = useRef(null);        // 지도 객체
  const markersRef = useRef([]);      // 마커 객체 저장

  // 지도는 "딱 한 번"만 생성
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      if (mapRef.current) return; // 지도 이미 있으면 생성하지 않음

      const container = document.getElementById(mapId);
      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: 6
      };
      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map;
    });
  }, [mapId, center.lat, center.lng]); /* center가 완전히 바뀔 때만 초기화 */

  // 마커는 데이터 변경에만 맞춰서
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !facilities || !facilities.length) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();
    let count = 0;

    facilities.forEach(facility => {
      const lat = facility.lat, lng = facility.lng;
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

      const position = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({
        position,
        map
      });

      // 클릭 핸들러
      if (onMarkerClick) {
        window.kakao.maps.event.addListener(marker, 'click', () => onMarkerClick(facility));
      }

      markersRef.current.push(marker);
      bounds.extend(position);
      count++;
    });

    if (count > 0) map.setBounds(bounds);
  }, [facilities, onMarkerClick]);

  return (
    <div
      id={mapId}
      className="kakao-map"
      style={{
        width: '100%',
        height: '500px',
        borderRadius: '16px',
        background: '#263238'
      }}
    />
  );
}

export default KakaoMap;
