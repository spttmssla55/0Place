import { calculateDistance } from '../utils/distanceCalculator';

// 사용자 현재 위치 가져오기
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치 정보가 지원되지 않습니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// 반경 내 시설 필터링
export const filterFacilitiesWithinRadius = (userLocation, facilities, radiusKm) => {
  return facilities.filter(facility => {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      facility.latitude,
      facility.longitude
    );
    return distance <= radiusKm;
  });
};

// 거리순 정렬
export const sortByDistance = (userLocation, facilities) => {
  return facilities.map(facility => ({
    ...facility,
    distance: calculateDistance(
      userLocation.lat,
      userLocation.lng,
      facility.latitude,
      facility.longitude
    )
  })).sort((a, b) => a.distance - b.distance);
};
