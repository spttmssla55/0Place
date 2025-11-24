package com.example.backend.service;

import com.example.backend.model.Favorite;
import com.example.backend.model.User;
import com.example.backend.repository.FavoriteRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FavoriteService {
    @Autowired
    private FavoriteRepository favoriteRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Favorite> getUserFavorites(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return favoriteRepository.findByUser(user);
    }

    public Favorite addFavorite(Long userId, String facilityName, String providerCode,
                                String address, Double lat, Double lng, String category) {
        User user = userRepository.findById(userId).orElseThrow();
        if (favoriteRepository.existsByUserAndFacilityName(user, facilityName)) {
            throw new IllegalStateException("이미 즐겨찾기됨");
        }
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setFacilityName(facilityName);
        favorite.setProviderCode(providerCode);
        favorite.setAddress(address);
        favorite.setLat(lat);
        favorite.setLng(lng);
        favorite.setCategory(category);
        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(Long userId, String facilityName) {
        User user = userRepository.findById(userId).orElseThrow();
        favoriteRepository.deleteByUserAndFacilityName(user, facilityName);
    }
}
