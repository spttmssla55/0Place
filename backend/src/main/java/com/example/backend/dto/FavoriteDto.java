package com.example.backend.dto;

public class FavoriteDto {
    private Long userId;
    private String facilityName;
    private String providerCode;
    private String address;
    private Double lat;
    private Double lng;
    private String category;

    // getter/setter
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFacilityName() { return facilityName; }
    public void setFacilityName(String facilityName) { this.facilityName = facilityName; }
    public String getProviderCode() { return providerCode; }
    public void setProviderCode(String providerCode) { this.providerCode = providerCode; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }
    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
