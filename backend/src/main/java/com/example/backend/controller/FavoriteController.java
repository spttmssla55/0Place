package com.example.backend.controller;

import com.example.backend.dto.FavoriteDto;
import com.example.backend.model.Favorite;
import com.example.backend.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    // 즐겨찾기 키 목록
    @GetMapping("/{userId}")
    public List<Favorite> getFavorites(@PathVariable Long userId) {
        return favoriteService.getUserFavorites(userId);
    }

    // 즐겨찾기 추가
    @PostMapping("/add")
    public Favorite addFavorite(@RequestBody FavoriteDto dto) {
        return favoriteService.addFavorite(
                dto.getUserId(),
                dto.getFacilityName(),
                dto.getProviderCode()
        );
    }

    // 즐겨찾기 해제
    @DeleteMapping("/remove")
    public void removeFavorite(@RequestParam Long userId,
                               @RequestParam String facilityName) {
        favoriteService.removeFavorite(userId, facilityName);
    }

    // 즐겨찾기 시설 실제 정보 (BookmarkPage용)
    @GetMapping("/facilities/{userId}")
    public List<Map<String, Object>> getFavoriteFacilities(@PathVariable Long userId) {
        return favoriteService.getUserFavoriteFacilities(userId);
    }
}
