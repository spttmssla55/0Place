// src/Map.js

import React, { useEffect, useRef, useState } from 'react';

const { kakao } = window;

const Map = ({ facilities, center, onCenterChange }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef([]);
  const [mapCenter, setMapCenter] = useState(center);
  const [mapLevel, setMapLevel] = useState(7);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 1. 지도 초기화
  useEffect(() => {
    if (kakao && kakao.maps) {
      kakao.maps.load(() => {
        const container = mapRef.current;
        const options = {
          center: new kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
          level: mapLevel,
        };
        mapInstance.current = new kakao.maps.Map(container, options);
        updateMap(kakao, mapInstance.current, facilities, mapCenter, mapLevel);
      });
    }
  }, []);

  // 2. 지도 업데이트: mapCenter, facilities, mapLevel이 변경될 때마다 실행
  useEffect(() => {
    if (mapInstance.current && kakao && kakao.maps) {
      updateMap(kakao, mapInstance.current, facilities, mapCenter, mapLevel);
    }
  }, [mapCenter, facilities, mapLevel]);

  const clearMarkers = () => {
    markerRef.current.forEach((marker) => marker.setMap(null));
    markerRef.current = [];
  };

  const updateMap = (kakao, map, facilities, newCenter, newLevel) => {
    clearMarkers();
    
    const redMarkerImage = new kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
      new kakao.maps.Size(24, 35),
    );

    const newLatLng = new kakao.maps.LatLng(newCenter.lat, newCenter.lng);
    map.setCenter(newLatLng);
    map.setLevel(newLevel);
    
    const currentLocationMarker = new kakao.maps.Marker({
      map: map,
      position: newLatLng,
      image: redMarkerImage,
      title: '현재 위치',
    });
    markerRef.current.push(currentLocationMarker);

    facilities.forEach((facility) => {
      const lat = parseFloat(facility.위도);
      const lng = parseFloat(facility.경도);
      if (!isNaN(lat) && !isNaN(lng)) {
        const position = new kakao.maps.LatLng(lat, lng);
        const facilityMarker = new kakao.maps.Marker({
          map: map,
          position: position,
          title: facility.개방시설명,
        });
        markerRef.current.push(facilityMarker);
      }
    });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setMapCenter(newCenter);
          setMapLevel(3);
          // 🔴 부모 컴포넌트에 새로운 중심 좌표를 즉시 전달
          onCenterChange(newCenter);
        },
        (error) => {
          alert('현재 위치를 가져올 수 없습니다. 검색을 이용해 주세요.');
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else {
      alert('이 브라우저는 Geolocation을 지원하지 않습니다.');
    }
  };

  const handleSearch = () => {
    if (!searchKeyword) {
      alert('검색어를 입력해 주세요.');
      return;
    }
    const geocoder = new kakao.maps.services.Geocoder();
    
    geocoder.addressSearch(searchKeyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        const newCenter = {
          lat: coords.getLat(),
          lng: coords.getLng(),
        };
        setMapCenter(newCenter);
        setMapLevel(3);
        // 🔴 부모 컴포넌트에 새로운 중심 좌표를 즉시 전달
        onCenterChange(newCenter);
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  return (
    <>
      <div className="map-controls">
        <button onClick={handleCurrentLocation}>현재 위치</button>
        
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: '8px' }} />
    </>
  );
};

export default Map;