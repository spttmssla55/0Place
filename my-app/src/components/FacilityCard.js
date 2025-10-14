import React from "react";
import "./FacilityCard.css";

const FacilityCard = ({ facility }) => {

    const usageFee = facility["사용료"] ? facility["사용료"].trim() : "";

  return (
    <div className="facility-card">
      <h3 className="facility-title">{facility["개방시설명"]}</h3>
      <p className="facility-address">{facility["소재지도로명주소"]}</p>
      <p className="facility-info">
        운영시간(평일): {facility["평일운영시작시각"]} ~ {facility["평일운영종료시각"]}
      </p>
      <p className="facility-info">
        {
            // ⭐️ 수정된 로직: 유료이고 (Y), 사용료 정보가 실제로 있을 때만 표시 ⭐️
            facility["유료사용여부"] === "Y" && usageFee
               ? `${usageFee}원` 
               : "무료시설" // 유료지만 사용료 정보가 없거나(빈 문자열), 유료 사용 여부가 'N'일 경우
        }
      </p>
    </div>
  );
};

export default FacilityCard;
