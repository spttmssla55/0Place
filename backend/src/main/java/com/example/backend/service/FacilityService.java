package com.example.backend.service;

import com.example.backend.component.FacilityDataLoader;
import com.example.backend.model.Facility;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityDataLoader dataLoader;
    private static final double EARTH_RADIUS = 6371; // 지구 반지름 (km)

    // 두 좌표 간의 거리(km) 계산 (하버사인 공식)
    private double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS * c;
    }

    // 공통: 지정 거리 이내 시설 필터링
    private List<Facility> filterNearby(double centerLat, double centerLng, double distanceKm) {
        return dataLoader.getAllFacilities().stream()
                .filter(f -> calculateDistance(centerLat, centerLng, f.getLat(), f.getLng()) <= distanceKm)
                .collect(Collectors.toList());
    }

    // API 1: 2km 이내 전체 시설
    public List<Facility> findNearby(double lat, double lng, double distance) {
        return filterNearby(lat, lng, distance);
    }

    // 🔴 API 2: 핫한 규모 시설 (2km 이내 + 규모 상위 20%)
    public List<Facility> findHotSize(double lat, double lng, double distance) {
        List<Facility> nearby = filterNearby(lat, lng, distance);

        // 면적(Area)과 수용인원(Capacity) 중 더 큰 값을 규모 점수로 사용해 내림차순 정렬
        Comparator<Facility> sizeComparator = Comparator.comparing(
            f -> Math.max(f.getArea(), f.getCapacity()), 
            Comparator.reverseOrder()
        );
        
        nearby.sort(sizeComparator);

        // 상위 20% 인덱스 계산
        int top20Percent = (int) Math.ceil(nearby.size() * 0.2);
        
        // 상위 20%만 반환
        return nearby.subList(0, Math.min(top20Percent, nearby.size()));
    }

    // 🔴 API 3: 핫한 무료 시설 (2km 이내 + 유료사용여부 'N')
    public List<Facility> findHotFree(double lat, double lng, double distance) {
        return filterNearby(lat, lng, distance).stream()
                // isPaid 필드가 "N"인 경우만 필터링
                .filter(f -> "N".equalsIgnoreCase(f.getIsPaid()))
                .collect(Collectors.toList());
    }
}