const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const getAllFacilities = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/facilities`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // ★ address로부터 city, district 동적 추출 추가!
    data.forEach(f => {
      if (f.address && typeof f.address === "string" && f.address.split(' ').length >= 2) {
        const [city, district] = f.address.split(' ');
        f.city = city;
        f.district = district;
      } else {
        f.city = "";
        f.district = "";
      }
      // 숫자 변환 보장 (좌표 NaN 이슈 예방)
      if (typeof f.lat !== "number") f.lat = parseFloat(f.lat);
      if (typeof f.lng !== "number") f.lng = parseFloat(f.lng);
    });
    // ★ 끝

    console.log('Fetched facilities:', data.length);
    return data;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return [];
  }
};

// 이하 getNearbyFacilities, getFacilitiesByRegion, getCitiesAndDistricts, searchFacilities는 변경 없이 그대로 사용 가능합니다.


export const getNearbyFacilities = async (lat, lng, radius) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/facilities/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched nearby facilities:', data.length);
    return data;
  } catch (error) {
    console.error('Error fetching nearby facilities:', error);
    return [];
  }
};

export const getFacilitiesByRegion = async (city, district) => {
  try {
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (district) params.append('district', district);
    
    const response = await fetch(`${API_BASE_URL}/api/facilities/region?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched facilities by region:', data.length);
    return data;
  } catch (error) {
    console.error('Error fetching facilities by region:', error);
    return [];
  }
};

export const getCitiesAndDistricts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/facilities/locations`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched locations:', data);
    return data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return { cities: [], districts: {} };
  }
};

export const searchFacilities = async (keyword) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/facilities/search?keyword=${encodeURIComponent(keyword)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Search results:', data.length);
    return data;
  } catch (error) {
    console.error('Error searching facilities:', error);
    return [];
  }
};
