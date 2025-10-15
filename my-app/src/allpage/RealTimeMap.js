import React, { useEffect, useRef } from "react";
const { kakao } = window;

const RealTimeMap = ({ facilities }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const openInfoRef = useRef(null);

  useEffect(() => {
    if (!facilities || facilities.length === 0) return;

    kakao.maps.load(() => {
      const container = document.getElementById("realtime-map");
      const map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(36.5, 127.8),
        level: 8,
      });
      mapRef.current = map;

      // ✅ 기존 마커 제거
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // ✅ 시설 마커 생성 (기본 파란 Kakao 마커)
      facilities.forEach((f) => {
        if (!f.lat || !f.lng) return;

        const marker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(f.lat, f.lng),
          map,
        });

        const infoWindow = new kakao.maps.InfoWindow({
          content: `
            <div style="padding:8px; font-size:13px;">
              <strong>${f["개방시설명"] || "시설명 없음"}</strong><br/>
              ${f["소재지도로명주소"] || f["소재지지번주소"] || "주소 정보 없음"}<br/>
              ${
                f["무료개방여부"] === "Y"
                  ? "<span style='color:#2563EB; font-weight:600;'>무료 이용 가능</span>"
                  : f["이용요금"]
                  ? `<span style='color:#2563EB; font-weight:600;'>유료 (${f["이용요금"]})</span>`
                  : "<span style='color:#2563EB;'>요금 정보 없음</span>"
              }<br/>
              ${
                f["홈페이지주소"]
                  ? `<a href="${f["홈페이지주소"]}" target="_blank" style="color:#2563EB; font-weight:600;">예약하기 ▶</a>`
                  : "<span style='color:#888;'>예약 링크 없음</span>"
              }
            </div>
          `,
        });

        kakao.maps.event.addListener(marker, "click", () => {
          if (openInfoRef.current) openInfoRef.current.close();
          infoWindow.open(map, marker);
          openInfoRef.current = infoWindow;
        });

        kakao.maps.event.addListener(map, "click", () => {
          if (openInfoRef.current) {
            openInfoRef.current.close();
            openInfoRef.current = null;
          }
        });

        markersRef.current.push(marker);
      });

      // ✅ 지도 중심 자동 설정
      const avgLat =
        facilities.reduce((sum, f) => sum + (f.lat || 0), 0) / facilities.length;
      const avgLng =
        facilities.reduce((sum, f) => sum + (f.lng || 0), 0) / facilities.length;

      if (!isNaN(avgLat) && !isNaN(avgLng)) {
        map.setCenter(new kakao.maps.LatLng(avgLat, avgLng));
        map.setLevel(facilities.length > 200 ? 11 : 8);
      }
    });
  }, [facilities]);

  return (
    <div
      id="realtime-map"
      style={{
        width: "100%",
        height: "550px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
    ></div>
  );
};

export default RealTimeMap;
