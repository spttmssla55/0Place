package com.example.backend.controller;

import com.example.backend.dto.FavoriteDto;
import com.example.backend.model.Favorite;
import com.example.backend.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    @Autowired
    private FavoriteService favoriteService;

    // 즐겨찾기 목록
    @GetMapping("/{userId}")
    public List<Favorite> getFavorites(@PathVariable Long userId) {
        return favoriteService.getUserFavorites(userId);
    }

    // 즐겨찾기 추가
    @PostMapping("/add")
    public Favorite addFavorite(@RequestBody FavoriteDto dto) {
        return favoriteService.addFavorite(
            dto.getUserId(), dto.getFacilityName(), dto.getProviderCode(),
            dto.getAddress(), dto.getLat(), dto.getLng(), dto.getCategory());
    }

    // 즐겨찾기 해제
    @DeleteMapping("/remove")
    public void removeFavorite(@RequestParam Long userId, @RequestParam String facilityName) {
        favoriteService.removeFavorite(userId, facilityName);
    }
}
