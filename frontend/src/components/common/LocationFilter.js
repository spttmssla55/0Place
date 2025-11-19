import React, { useState, useEffect } from 'react';
import { getCitiesAndDistricts } from '../../services/facilityService';
import './LocationFilter.css';

function LocationFilter({ onLocationChange, selectedCity, selectedDistrict }) {
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      fetchDistricts(selectedCity);
    } else {
      setDistricts([]);
      onLocationChange('', '');
    }
  }, [selectedCity]);

  const fetchLocations = async () => {
    try {
      const data = await getCitiesAndDistricts();
      setCities(data.cities);
    } catch (err) {
      console.error('지역 정보 로딩 실패:', err);
    }
  };

  const fetchDistricts = async (city) => {
    try {
      const data = await getCitiesAndDistricts();
      setDistricts(data.districts[city] || []);
    } catch (err) {
      console.error('구 정보 로딩 실패:', err);
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    onLocationChange(city, '');
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    onLocationChange(selectedCity, district);
  };

  return (
    <div className="location-filter">
      <select 
        value={selectedCity} 
        onChange={handleCityChange}
        className="filter-select"
      >
        <option value="">도/시 선택</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      <select 
        value={selectedDistrict} 
        onChange={handleDistrictChange}
        className="filter-select"
        disabled={!selectedCity}
      >
        <option value="">구 선택</option>
        {districts.map(district => (
          <option key={district} value={district}>{district}</option>
        ))}
      </select>
    </div>
  );
}

export default LocationFilter;
