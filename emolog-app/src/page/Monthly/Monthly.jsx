import React, { useState } from "react";
import "./Monthly.css";

const monthlyData = [
  {
    date: "7월 0일",
    hexCode: "#F29496",
    emotions: ["행복", "차분", "달달"],
    aiMessage: "이 행복을 조금이라도 즐길 수 있길",
    diary: "오늘 아침, 행복을 보니 비가 부슬부슬 내리고 있었다. 이런 날씨에 집에서 나가기가 싫었지만...",
    imageUrl: "path/to/your/image1.png"
  },
  // Add more data for other days
];

const Monthly = () => {
  const [selectedDay, setSelectedDay] = useState(monthlyData[0]);

  return (
    <div className="monthly-container">
      <header>
        <div className="tab">
          <span className="active">Month</span> | <span>Week</span>
        </div>
      </header>

      <div className="monthly-content">
        <div className="color-circle-container">
          {monthlyData.map((day, index) => (
            <div
              key={index}
              className="color-circle"
              style={{ backgroundColor: day.hexCode }}
              onClick={() => setSelectedDay(day)}
            ></div>
          ))}
        </div>
        <div className="diary-container">
          <h2>{selectedDay.date}</h2>
          <img src={selectedDay.imageUrl} alt="Diary illustration" />
          <div className="emotions">
            {selectedDay.emotions.map((emotion, index) => (
              <span key={index} className="emotion-tag">
                {emotion}
              </span>
            ))}
          </div>
          <p className="ai-message">{selectedDay.aiMessage}</p>
          <p className="diary-entry">{selectedDay.diary}</p>
          <button>일기 자세히 보기</button>
        </div>
      </div>
    </div>
  );
};

export default Monthly;
