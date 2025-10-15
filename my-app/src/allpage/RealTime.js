import React, { useEffect, useState } from "react";
import axios from "axios";
import RealTimeMap from "./RealTimeMap";
import "./RealTime.css";

const API_BASE_URL = "http://localhost:8080/api/facilities";

// ✅ 시도 / 시군구 목록에 "전체" 추가
const REGION_OPTIONS = {
  전체: ["전체"],
  서울특별시: ["강남구", "강서구", "마포구", "종로구", "송파구"],
  경기도: ["수원시", "성남시", "용인시", "고양시", "의정부시"],
  부산광역시: ["해운대구", "수영구", "남구", "동래구", "북구"],
  대구광역시: ["수성구", "달서구", "중구", "북구"],
  인천광역시: ["연수구", "남동구", "부평구"],
  광주광역시: ["서구", "남구", "북구", "동구"],
};

const RealTime = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("전체");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const [filteredFacilities, setFilteredFacilities] = useState([]);

  // ✅ 카테고리 분류
  const getCategory = (facility) => {
    const name = (facility["개방시설명"] || "").toLowerCase();

    const sports = [
      "체육", "운동", "헬스", "수영", "스포츠", "축구", "야구", "농구", "테니스",
      "풋살", "배드민턴", "탁구", "골프", "씨름", "게이트볼", "체조", "운동장",
      "피트니스", "요가", "클라이밍", "체육관"
    ];
    const culture = [
      "문화", "공연", "도서관", "박물관", "미술관", "전시", "문예", "예술", "갤러리"
    ];
    const education = [
      "교육", "강의", "세미나", "학습", "평생", "강당", "강좌", "강의실"
    ];
    const etc = ["주차", "공원", "광장", "회의", "청사"];

    if (sports.some((w) => name.includes(w))) return "체육시설";
    if (culture.some((w) => name.includes(w))) return "문화시설";
    if (education.some((w) => name.includes(w))) return "교육시설";
    if (etc.some((w) => name.includes(w))) return "기타";
    return "기타";
  };

  // ✅ 전체 시설 데이터 불러오기
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/all`)
      .then((res) => setFacilities(res.data || []))
      .catch((err) => console.error("시설 전체 불러오기 실패:", err));
  }, []);

  // ✅ 선택된 지역에 따라 필터링
  useEffect(() => {
    if (!facilities.length) return;

    const normalize = (s) => s?.replace(/\s+/g, "").trim() || "";

    let filtered = facilities;

    if (selectedCity !== "전체") {
      filtered = facilities.filter((f) => {
        const road = normalize(f["소재지도로명주소"]);
        const jibun = normalize(f["소재지지번주소"]);
        const addr = `${road}${jibun}`;
        const city = normalize(selectedCity);
        const dist = normalize(selectedDistrict);
        return (
          addr.includes(city) &&
          (selectedDistrict === "전체" || addr.includes(dist))
        );
      });
    }

    setFilteredFacilities(filtered);
  }, [selectedCity, selectedDistrict, facilities]);

  // ✅ 요금 / 색상 헬퍼 (무료 + 유료 구분)
  const getFeeInfo = (f) => {
    const usageFee =
      f["이용요금"] || f["사용료"] || f["이용 요금"] || "요금 정보 없음";

    const isFree =
      f["무료개방여부"] === "Y" ||
      f["유료사용여부"] === "N" ||
      usageFee.includes("무료");

    if (isFree)
      return { text: "무료 이용 가능", color: "#2563EB" }; // 파랑

    if (usageFee.match(/[0-9]/))
      return {
        text: `₩${usageFee.replace(/[^0-9]/g, "")}`,
        color: "#F59E0B",
      };

    return { text: "유료 (요금 정보 없음)", color: "#999" };
  };

  return (
    <div className="realtime-page">
      <h1 className="realtime-title">🌏 지역별 공공시설 보기</h1>

      {/* ✅ 지역 선택 (전체 포함) */}
      <div className="realtime-region-select">
        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedDistrict(REGION_OPTIONS[e.target.value][0]);
          }}
        >
          {Object.keys(REGION_OPTIONS).map((city) => (
            <option key={city}>{city}</option>
          ))}
        </select>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          {REGION_OPTIONS[selectedCity].map((dist) => (
            <option key={dist}>{dist}</option>
          ))}
        </select>
      </div>

      {/* ✅ 지도 */}
      <div className="realtime-map-section">
        <RealTimeMap facilities={filteredFacilities} />
      </div>

      {/* ✅ 카테고리별 카드 */}
      {["체육시설", "문화시설", "교육시설", "기타"].map((category) => (
        <div key={category} className="realtime-category-section">
          <div className="realtime-category-header">
            <h2>{category}</h2>
          </div>

          <div className="realtime-card-list">
            {filteredFacilities
              .filter((f) => getCategory(f) === category)
              .slice(0, 12)
              .map((f, i) => {
                const { text, color } = getFeeInfo(f);
                return (
                  <div className="realtime-card" key={i}>
                    <div className="realtime-card-content">
                      <h3>{f["개방시설명"] || "시설명 없음"}</h3>
                      <p>{f["소재지도로명주소"] || f["소재지지번주소"] || "주소 없음"}</p>
                      <p style={{ color, fontWeight: 600 }}>{text}</p>
                      {f["홈페이지주소"] ? (
                        <a
                          href={f["홈페이지주소"]}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#2563EB",
                            fontWeight: "600",
                            textDecoration: "none",
                          }}
                        >
                          예약하기 ▶
                        </a>
                      ) : (
                        <p style={{ color: "#888" }}>예약 링크 없음</p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RealTime;
