package com.example.backend.component;

import com.example.backend.model.Facility;
import com.fasterxml.jackson.core.type.TypeReference; // 💡 새롭게 추가된 Import
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.stereotype.Component;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
@Getter
public class FacilityDataLoader {

    private List<Facility> allFacilities = new ArrayList<>();
    private static final String FILE_NAME = "전국공공시설개방정보표준데이터.json";

    @PostConstruct
    public void loadData() {
        ObjectMapper mapper = new ObjectMapper();
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(FILE_NAME)) {
            if (is == null) {
                System.err.println("🔴 " + FILE_NAME + " 파일을 찾을 수 없습니다. src/main/resources에 파일을 배치했는지 확인해 주세요.");
                return;
            }
            
            JsonNode rootNode = mapper.readTree(is);
            // "records" 노드를 찾습니다.
            JsonNode recordsNode = rootNode.path("records");

            // ❌ 오류 나는 코드 대체
            // ✅ recordsNode (JSON 배열)를 List<Facility>로 변환
            List<Facility> rawFacilities = mapper.readValue(
                recordsNode.traverse(), // JsonNode를 순회 가능한 스트림으로 변환
                new TypeReference<List<Facility>>() {} // 대상 타입을 List<Facility>로 명시
            );
            
            for (Facility facility : rawFacilities) {
                facility.parseNumericFields(); // 위도, 경도, 면적, 인원수 파싱
                // 유효한 좌표를 가진 시설만 리스트에 추가
                if (facility.getLat() != 0.0 && facility.getLng() != 0.0) {
                    allFacilities.add(facility);
                }
            }
            System.out.println("✅ 총 " + allFacilities.size() + "개의 시설 데이터 로드 완료.");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("🔴 시설 데이터 로딩 중 오류 발생. JSON 구조나 Jackson 의존성을 확인하세요.");
        }
    }
}