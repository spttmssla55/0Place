package com.example.backend.controller;

import com.example.backend.model.Facility;
import com.example.backend.service.FacilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService facilityService;

    // 전체 시설 목록 API: GET http://localhost:8080/api/facilities/nearby?lat=...&lng=...
    @GetMapping("/nearby")
    public List<Facility> getNearbyFacilities(
            @RequestParam double lat, 
            @RequestParam double lng, 
            @RequestParam(defaultValue = "2") double distance) {
        return facilityService.findNearby(lat, lng, distance);
    }

    // 핫한 규모 시설 목록 API: GET http://localhost:8080/api/facilities/hot-size?lat=...&lng=...
    @GetMapping("/hot-size")
    public List<Facility> getHotSizeFacilities(
            @RequestParam double lat, 
            @RequestParam double lng, 
            @RequestParam(defaultValue = "2") double distance) {
        return facilityService.findHotSize(lat, lng, distance);
    }

    // 핫한 무료 시설 목록 API: GET http://localhost:8080/api/facilities/hot-free?lat=...&lng=...
    @GetMapping("/hot-free")
    public List<Facility> getHotFreeFacilities(
            @RequestParam double lat, 
            @RequestParam double lng, 
            @RequestParam(defaultValue = "2") double distance) {
        return facilityService.findHotFree(lat, lng, distance);
    }
}