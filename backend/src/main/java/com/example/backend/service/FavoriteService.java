package com.example.backend.service;

import com.example.backend.model.Facility;
import com.example.backend.model.Favorite;
import com.example.backend.model.User;
import com.example.backend.repository.FavoriteRepository;
import com.example.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private UserRepository userRepository;

    public Favorite addFavorite(Long userId, String facilityName, String providerCode) {
        User user = userRepository.findById(userId).orElseThrow();

        if (favoriteRepository.existsByUserAndFacilityName(user, facilityName)) {
            throw new IllegalStateException("이미 즐겨찾기됨");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setFacilityName(facilityName);
        favorite.setProviderCode(providerCode);

        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(Long userId, String facilityName) {
        User user = userRepository.findById(userId).orElseThrow();
        favoriteRepository.deleteByUserAndFacilityName(user, facilityName);
    }

    public List<Favorite> getUserFavorites(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return favoriteRepository.findByUser(user);
    }

    // 즐겨찾기 페이지용: 실제 시설 정보 리스트
    public List<Map<String, Object>> getUserFavoriteFacilities(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<Favorite> favorites = favoriteRepository.findByUser(user);

        List<Map<String, Object>> result = new ArrayList<>();

        try {
            InputStream is = getClass().getResourceAsStream("/전국공공시설개방정보표준데이터.json");
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(is);
            JsonNode records = root.get("records");
            if (records == null || !records.isArray()) return result;

            for (JsonNode rec : records) {
                Facility f = mapper.treeToValue(rec, Facility.class);

                boolean matched = favorites.stream().anyMatch(fav ->
                        fav.getFacilityName().equals(f.개방시설명) &&
                                fav.getProviderCode().equals(f.제공기관코드)
                );

                if (matched) {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", f.개방시설명);
                    map.put("place", f.개방장소명);
                    map.put("type", f.개방시설유형구분);
                    map.put("address", f.소재지도로명주소);
                    map.put("homepage", f.홈페이지주소);
                    map.put("lat", safeParseDouble(f.위도));
                    map.put("lng", safeParseDouble(f.경도));
                    map.put("providerCode", f.제공기관코드);

                    result.add(map);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return result;
    }

    private Double safeParseDouble(String s) {
        try {
            return s == null ? null : Double.parseDouble(s);
        } catch (Exception e) {
            return null;
        }
    }
}
