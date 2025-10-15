package com.example.backend.component;

import com.example.backend.model.Facility;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@Getter
public class FacilityDataLoader {

    private List<Facility> allFacilities = new ArrayList<>();

    @PostConstruct
    public void loadData() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            // ✅ 전국 공공시설 JSON 파일 로드
            File file = new File("src/main/resources/전국공공시설개방정보표준데이터.json");

            allFacilities = mapper.readValue(file, new TypeReference<List<Facility>>() {});

            // ✅ 숫자형 필드 파싱
            for (Facility f : allFacilities) {
                f.parseNumericFields();
            }

            System.out.println("✅ 전국 공공시설 데이터 로드 완료: " + allFacilities.size() + "건");
        } catch (IOException e) {
            System.err.println("❌ 공공시설 데이터 로드 실패: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
