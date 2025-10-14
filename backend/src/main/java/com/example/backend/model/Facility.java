package com.example.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
// 💡 아래 두 import를 추가/확인합니다.
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
// 🔴 이 줄을 추가하여, 모델에 없는 JSON 필드는 모두 무시하도록 설정합니다.
@JsonIgnoreProperties(ignoreUnknown = true) 
public class Facility {
    @JsonProperty("개방시설명")
    private String facilityName;
    
    @JsonProperty("소재지도로명주소")
    private String roadAddress;
    
    @JsonProperty("유료사용여부")
    private String isPaid;
    
    @JsonProperty("사용료") 
    private String usageFee;
    
    @JsonProperty("위도")
    private String latitudeStr;
    
    @JsonProperty("경도")
    private String longitudeStr;
    
    @JsonProperty("면적")
    private String areaStr;
    
    @JsonProperty("수용가능인원수")
    private String capacityStr;
    
    private double lat;
    private double lng;
    private double area;
    private int capacity;
    
    public void parseNumericFields() {
        try { this.lat = Double.parseDouble(this.latitudeStr); } catch (Exception e) { this.lat = 0.0; }
        try { this.lng = Double.parseDouble(this.longitudeStr); } catch (Exception e) { this.lng = 0.0; }
        try { this.area = Double.parseDouble(this.areaStr.replaceAll(",", "")); } catch (Exception e) { this.area = 0.0; }
        try { this.capacity = Integer.parseInt(this.capacityStr.replaceAll(",", "")); } catch (Exception e) { this.capacity = 0; }
    }
}