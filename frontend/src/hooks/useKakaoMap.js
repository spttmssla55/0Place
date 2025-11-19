import { useEffect, useState } from 'react';

export const useKakaoMap = (containerId, centerLat, centerLng) => {
  const [map, setMap] = useState(null);
  const [kakao, setKakao] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById(containerId);
        const options = {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level: 5
        };
        
        const mapInstance = new window.kakao.maps.Map(container, options);
        setMap(mapInstance);
        setKakao(window.kakao);
      });
    };

    if (window.kakao && window.kakao.maps) {
      initializeMap();
    }
  }, [containerId, centerLat, centerLng]);

  return { map, kakao };
};
