package com.example.backend.controller;

import com.example.backend.model.Facility;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.*;

@RestController
@RequestMapping("/api/facilities")
@CrossOrigin(origins = "http://localhost:3000")
public class FacilityController {

    @GetMapping
    public List<Map<String, Object>> getFacilities() {
        List<Map<String, Object>> result = new ArrayList<>();

        try {
            InputStream is = getClass().getResourceAsStream("/전국공공시설개방정보표준데이터.json");
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(is);
            JsonNode records = root.get("records");
            if (records == null || !records.isArray()) return result;

            for (JsonNode rec : records) {
                Facility f = mapper.treeToValue(rec, Facility.class);

                String category = classifyCategory(f);
                Double lat = safeParseDouble(f.위도);
                Double lng = safeParseDouble(f.경도);
                if (lat == null || lng == null) continue;

                String city = "-";
                String district = "-";
                if (f.소재지도로명주소 != null && f.소재지도로명주소.split(" ").length >= 2) {
                    String[] arr = f.소재지도로명주소.split(" ");
                    city = arr[0];
                    district = arr[1];
                }

                Map<String, Object> map = new HashMap<>();
                map.put("name", n(f.개방시설명));
                map.put("place", n(f.개방장소명));
                map.put("type", n(f.개방시설유형구분));
                map.put("category", category);
                map.put("address", n(f.소재지도로명주소));
                map.put("city", city);
                map.put("district", district);
                map.put("lat", lat);
                map.put("lng", lng);
                map.put("homepage", n(f.홈페이지주소));
                map.put("providerCode", n(f.제공기관코드));

                result.add(map);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    @GetMapping("/nearby")
    public List<Map<String, Object>> getNearbyFacilities(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam double radius
    ) {
        List<Map<String, Object>> result = new ArrayList<>();

        try {
            InputStream is = getClass().getResourceAsStream("/전국공공시설개방정보표준데이터.json");
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(is);
            JsonNode records = root.get("records");
            if (records == null || !records.isArray()) return result;

            for (JsonNode rec : records) {
                Facility f = mapper.treeToValue(rec, Facility.class);

                Double flat = safeParseDouble(f.위도);
                Double flng = safeParseDouble(f.경도);
                if (flat == null || flng == null) continue;

                double d = getDistance(lat, lng, flat, flng);
                if (d <= radius) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", n(f.개방시설명));
                    map.put("place", n(f.개방장소명));
                    map.put("category", classifyCategory(f));
                    map.put("address", n(f.소재지도로명주소));
                    map.put("lat", flat);
                    map.put("lng", flng);
                    map.put("homepage", n(f.홈페이지주소));
                    map.put("providerCode", n(f.제공기관코드));

                    result.add(map);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    private String classifyCategory(Facility f) {
        String joined = (n(f.개방시설명) + " " + n(f.개방장소명) + " " + n(f.개방시설유형구분)).toLowerCase();

        if (joined.contains("도서관")) return "도서관";
        if (joined.contains("공원")) return "공원";
        if (joined.contains("회의실") || joined.contains("세미나") || joined.contains("강의실")) return "회의실";
        if (joined.contains("체육") || joined.contains("운동장")) return "체육관";
        if (joined.contains("문화센터")) return "문화센터";
        if (joined.contains("강당") || joined.contains("공연장")) return "공연장";
        return "기타";
    }

    private String n(String s) {
        return (s == null || s.trim().isEmpty()) ? "-" : s.trim();
    }

    private Double safeParseDouble(String s) {
        try {
            return s == null ? null : Double.parseDouble(s);
        } catch (Exception e) {
            return null;
        }
    }

    private double getDistance(double lat1, double lng1, double lat2, double lng2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                                Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
