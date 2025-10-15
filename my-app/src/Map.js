import React, { useEffect, useRef, useCallback } from 'react';
const { kakao } = window;

const Map = ({ center, onReady, onCenterChange }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  // ✅ 지도 초기화 함수 (useCallback으로 안정화)
  const initMap = useCallback(() => {
    if (!kakao || !kakao.maps || !mapRef.current) return;

    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(center.lat, center.lng),
      level: 5,
    });
    mapInstance.current = map;

    // 드래그 끝났을 때 중심 좌표 전달
    kakao.maps.event.addListener(map, 'dragend', () => {
      const c = map.getCenter();
      if (onCenterChange)
        onCenterChange({ lat: c.getLat(), lng: c.getLng() });
    });

    // 부모로 지도 객체 전달
    if (onReady) onReady(map);
  }, [center.lat, center.lng, onCenterChange, onReady]);

  // ✅ 초기화는 한 번만
  useEffect(() => {
    kakao.maps.load(initMap);
  }, [initMap]);

  return (
    <div
      ref={mapRef}
      style={{ width: '100%', height: '100%', borderRadius: '8px' }}
    />
  );
};

export default Map;
