import React, { useEffect, useRef } from 'react';
import './KakaoMap.css';

function KakaoMap({ facilities, center, onMarkerClick, mapId = 'nationwide-map', myPosition }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  
  useEffect(() => {
    // ★ center 유효성은 여기서 체크
    if (!window.kakao || !window.kakao.maps) return;
    if (!center || !center.lat || !center.lng) return;
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
  }, [mapId, center?.lat, center?.lng]);
  
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!center || !center.lat || !center.lng) return;
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();
    let count = 0;

    if (myPosition && myPosition.lat && myPosition.lng) {
      const pos = new window.kakao.maps.LatLng(myPosition.lat, myPosition.lng);
      const markerImage = new window.kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
        new window.kakao.maps.Size(49, 49),
        { offset: new window.kakao.maps.Point(27, 69) }
      );
      const marker = new window.kakao.maps.Marker({
        position: pos,
        map,
        image: markerImage,
      });
      markersRef.current.push(marker);
      bounds.extend(pos);
      count++;
    }

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
  }, [facilities, onMarkerClick, myPosition, center]);

  // 조건부 렌더링은 리턴에서만!
  if (!center || !center.lat || !center.lng) {
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
      >
        <div style={{ color: "#eee", padding: "40px", textAlign: "center" }}>
          지도 로딩 중...
        </div>
      </div>
    );
  }

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
