// src/main/java/com/example/backend/model/Facility.java (변동 없음)

package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) 
public class Facility {
    @JsonProperty("개방시설명")
    private String facilityName;
    
    @JsonProperty("소재지도로명주소")
    private String roadAddress;
    
    @JsonProperty("소재지지번주소")
    private String jibunAddress;

    @JsonProperty("유료사용여부")
    private String isPaid;
    
    @JsonProperty("사용료") 
    private String usageFee;
    
    @JsonProperty("위도")
    private String latitudeStr;
    
    @JsonProperty("경도")
    private String longitudeStr;
    
    @JsonProperty("홈페이지주소")
    private String homepageUrl;

    @JsonProperty("면적")
    private String areaStr;
    
    @JsonProperty("수용가능인원수")
    private String capacityStr;
    
    private double lat;
    private double lng;
    private double area;
    private int capacity;
    
    public void parseNumericFields() {
        // ... (파싱 로직은 이전과 동일)
        try { this.lat = Double.parseDouble(this.latitudeStr); } catch (Exception e) { this.lat = 0.0; }
        try { this.lng = Double.parseDouble(this.longitudeStr); } catch (Exception e) { this.lng = 0.0; }
        try { this.area = Double.parseDouble(this.areaStr.replaceAll("[^0-9.]", "")); } catch (Exception e) { this.area = 0.0; }
        try { this.capacity = Integer.parseInt(this.capacityStr.replaceAll("[^0-9]", "")); } catch (Exception e) { this.capacity = 0; }
    }
}