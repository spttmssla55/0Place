// src/main/java/com/example/backend/controller/FacilityController.java
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

    // ✅ 1️⃣ 전체 시설 목록 불러오기
    @GetMapping("/all")
    public List<Facility> getAllFacilities() {
        return facilityService.getAllFacilities();
    }

    // ✅ 2️⃣ 2km 반경 시설
    @GetMapping("/nearby")
    public List<Facility> getNearbyFacilities(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "2") double distance) {
        return facilityService.findNearby(lat, lng, distance);
    }

    // ✅ 3️⃣ 핫한 규모 시설
    @GetMapping("/hot-size")
    public List<Facility> getHotSizeFacilities(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "2") double distance) {
        return facilityService.findHotSize(lat, lng, distance);
    }

    // ✅ 4️⃣ 핫한 무료 시설
    @GetMapping("/hot-free")
    public List<Facility> getHotFreeFacilities(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "2") double distance) {
        return facilityService.findHotFree(lat, lng, distance);
    }
}
