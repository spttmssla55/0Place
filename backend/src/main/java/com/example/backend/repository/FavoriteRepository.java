package com.example.backend.repository;

import com.example.backend.model.Favorite;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUser(User user);
    void deleteByUserAndFacilityName(User user, String facilityName);
    boolean existsByUserAndFacilityName(User user, String facilityName);
}
