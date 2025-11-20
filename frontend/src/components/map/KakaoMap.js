import React, { useEffect, useRef } from 'react';
import './KakaoMap.css';

function KakaoMap({ facilities, center, onMarkerClick, mapId = 'nationwide-map', myPosition }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      if (mapRef.current) return;

      const container = document.getElementById(mapId);
      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: 6
      };
      const map = new window.kakao.maps.Map(container, options);
      mapRef.current = map;
    });
  }, [mapId, center.lat, center.lng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 모든 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();
    let count = 0;

    // 내 위치 마커(빨간색) (myPosition이 있을 때만)
    if (myPosition && myPosition.lat && myPosition.lng) {
      const pos = new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng);
      
      // 마커 이미지를 생성합니다. (기존 빨간색 깃발 모양 유지)
      const markerImage = new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
        new window.kakao.maps.Size(49, 49),
        { offset: new window.kakao.maps.Point(27, 69) }
      );

      const marker = new window.kakao.maps.Marker({
        position: pos,
        map,
        image: markerImage, // 생성한 이미지 객체 사용
        // title 옵션을 제거하거나 주석 처리하여 라벨 완전 제거
        // title: "출발" 
      });
      
      markersRef.current.push(marker);
      bounds.extend(pos);
      count++;
    }

    // 시설 마커 (일반)
    facilities && facilities.forEach(facility => {
      const lat = facility.lat, lng = facility.lng;
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

      const position = new window.kakao.maps.LatLng(lat, lng);
      const marker = new window.kakao.maps.Marker({
        position,
        map
      });

      if (onMarkerClick) {
        window.kakao.maps.event.addListener(marker, 'click', () => onMarkerClick(facility));
      }

      markersRef.current.push(marker);
      bounds.extend(position);
      count++;
    });

    if (count > 0) map.setBounds(bounds);
  }, [facilities, onMarkerClick, myPosition]);

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
