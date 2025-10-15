import React, { useState, useEffect, useRef } from "react";

const SearchLocation = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const placesRef = useRef(null);
  const debounceRef = useRef(null);
  const [isKakaoReady, setIsKakaoReady] = useState(false);

  // ✅ Kakao Maps API 로드 감지
  useEffect(() => {
    const checkKakao = setInterval(() => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        placesRef.current = new window.kakao.maps.services.Places();
        setIsKakaoReady(true);
        clearInterval(checkKakao);
      }
    }, 300);

    return () => clearInterval(checkKakao);
  }, []);

  // ✅ 자동완성 (keywordSearch)
  useEffect(() => {
    if (!isKakaoReady || !placesRef.current || !keyword.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      placesRef.current.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSuggestions(data.slice(0, 8));
        } else {
          setSuggestions([]);
        }
      });
    }, 300);
  }, [keyword, isKakaoReady]);

  // ✅ 검색 실행
  const handleSearch = (query = keyword) => {
    if (!isKakaoReady || !placesRef.current)
      return alert("⚠️ 지도 로드 중입니다. 잠시만 기다려주세요.");

    if (!query.trim()) return alert("검색어를 입력해주세요.");

    placesRef.current.keywordSearch(query, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        const first = data[0];
        const coords = { lat: parseFloat(first.y), lng: parseFloat(first.x) };
        onSearch(coords);
        setKeyword(first.place_name);
        setSuggestions([]);
        setFocusedIndex(-1);
      } else {
        alert("검색 결과를 찾을 수 없습니다.");
      }
    });
  };

  // ✅ 추천 클릭 시 이동
  const handleSuggestionClick = (place) => {
    const coords = { lat: parseFloat(place.y), lng: parseFloat(place.x) };
    onSearch(coords);
    setKeyword(place.place_name);
    setSuggestions([]);
    setFocusedIndex(-1);
  };

  // ✅ 키보드 이동 (↑ ↓ Enter)
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0 && suggestions[focusedIndex]) {
        handleSuggestionClick(suggestions[focusedIndex]);
      } else {
        handleSearch();
      }
    }
  };

  return (
    <div style={{ position: "relative", width: "75%" }}>
      {/* 🔍 검색창 */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <input
          type="text"
          placeholder={
            isKakaoReady
              ? "예: 서울역, 경복궁, 한강공원 ..."
              : "지도 로딩 중입니다..."
          }
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "15px",
            outline: "none",
          }}
          disabled={!isKakaoReady}
        />
        <button
          onClick={() => handleSearch()}
          disabled={!isKakaoReady}
          style={{
            padding: "9px 15px",
            backgroundColor: isKakaoReady ? "#2b7cff" : "#a0aec0",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: isKakaoReady ? "pointer" : "not-allowed",
            fontWeight: 600,
          }}
        >
          검색
        </button>
      </div>

      {/* 📋 자동완성 목록 */}
      {isFocused && suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "44px",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "6px",
            zIndex: 1000,
            listStyle: "none",
            margin: 0,
            padding: 0,
            maxHeight: "280px",
            overflowY: "auto",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {suggestions.map((place, idx) => (
            <li
              key={idx}
              onMouseDown={() => handleSuggestionClick(place)}
              style={{
                padding: "10px 14px",
                cursor: "pointer",
                backgroundColor:
                  idx === focusedIndex ? "#e8f0fe" : "transparent",
                borderBottom: "1px solid #f1f5f9",
                transition: "background 0.2s",
              }}
            >
              {/* 제목 부분 */}
              <div style={{ fontWeight: "600", fontSize: "15px", color: "#222" }}>
                {place.place_name}
                {place.category_group_name && (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#777",
                      marginLeft: "5px",
                    }}
                  >
                    ({place.category_group_name})
                  </span>
                )}
              </div>

              {/* 부가 설명 (지하철 출구, 빌딩 이름 등) */}
              {place.phone && (
                <div style={{ fontSize: "12px", color: "#888" }}>
                  ☎ {place.phone}
                </div>
              )}

              {/* 주소 */}
              <div style={{ fontSize: "12px", color: "#555" }}>
                {place.road_address_name
                  ? place.road_address_name
                  : place.address_name}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchLocation;
