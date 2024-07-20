import React, { useState } from "react";
import "./Weekly.css";

// 기본 데이터 설정
const todayData = {
  date: "7월 1일 월요일",
  hexCode: "#F29496",
  emotions: ["행복", "차분", "달달"],
  aiMessage: "이 행복을 조금이라도 즐길 수 있길",
  diary:
    "오늘 아침, 행복을 보니 비가 부슬부슬 내리고 있었다. 이런 날씨에 집에서 나가기가 싫었지만...",
  imageUrl: require("../../asset/img/AI_image1.png"),
};

const weeklyData = [
  {
    date: "7월 2일 화요일",
    hexCode: "#A8DADC",
    emotions: ["기쁨", "활기", "평화"],
    aiMessage: "오늘도 행복한 하루 보내세요",
    diary: "오늘은 정말 기쁜 일이 많았어요...",
    imageUrl: require("../../asset/img/AI_image1.png"),
  },
  {
    date: "7월 3일 수요일",
    hexCode: "#457B9D",
    emotions: ["슬픔", "우울", "침착"],
    aiMessage: "힘든 하루가 되겠지만 잘 견뎌봐요",
    diary: "오늘은 좀 우울한 일이 있었어요...",
    imageUrl: require("../../asset/img/AI_image1.png"),
  },
  // 여기에 추가 데이터
  {
    date: "7월 4일 목요일",
    hexCode: "#F1FAEE",
    emotions: ["흥미", "기대", "호기심"],
    aiMessage: "새로운 하루, 새로운 기대",
    diary: "오늘은 새로운 도전이 있었어요...",
    imageUrl: require("../../asset/img/AI_image1.png"),
  },
  {
    date: "7월 5일 금요일",
    hexCode: "#E63946",
    emotions: ["활기", "기쁨", "열정"],
    aiMessage: "주말이 오고 있어요!",
    diary: "금요일, 주말이 가까워지는 기분이 좋아요...",
    imageUrl: require("../../asset/img/AI_image1.png"),
  },
  {
    date: "7월 6일 토요일",
    hexCode: "#F1FAEE",
    emotions: ["편안", "즐거움", "여유"],
    aiMessage: "편안한 주말 되세요",
    diary: "오늘은 편안하게 쉬는 날이에요...",
    imageUrl: require("../../asset/img/AI_image1.png"),
  },
  {
    date: "7월 7일 일요일",
    hexCode: "#A8DADC",
    emotions: ["행복", "기쁨", "기대"],
    aiMessage: "좋은 하루 되세요",
    diary: "일요일, 가족과 함께 시간을 보냈어요...",
    imageUrl: require("../../asset/img/AI_image1.png"),
  },
  {
    date: "7월 8일 월요일",
    hexCode: "#F29496",
    emotions: ["새로움", "기대", "흥미"],
    aiMessage: "새로운 한 주의 시작!",
    diary: "새로운 한 주가 시작되었어요...",
    imageUrl: require("../../asset/img/AI_image1.png"),
  },
  // 이후 주차의 데이터도 추가
];

const getWeekData = (weekNumber) => {
  const startIndex = (weekNumber - 1) * 7;
  return [todayData, ...weeklyData].slice(startIndex, startIndex + 7);
};

const Weekly = () => {
  const [selectedDay, setSelectedDay] = useState(todayData);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const handleNextWeek = () => {
    setSelectedWeek(selectedWeek + 1);
    setSelectedDay(getWeekData(selectedWeek + 1)[0]);
  };

  const handlePreviousWeek = () => {
    if (selectedWeek > 1) {
      setSelectedWeek(selectedWeek - 1);
      setSelectedDay(getWeekData(selectedWeek - 1)[0]);
    }
  };

  const weekData = getWeekData(selectedWeek);

  return (
    <div className="weekly-container">
      <div id="back">
        <header>
          <div id="logo"></div>
          <div className="tab">
            <span id="month">Month</span><span id="bar"></span><span className="active" id="week">Week</span>
          </div>
          <div className="week-navigation">
              <button onClick={handlePreviousWeek}>&lt;</button>
              <h3>{selectedWeek}주차</h3>
              <button onClick={handleNextWeek}>&gt;</button>
            </div>
        </header>

        <div className="weekly-content">
          <div className="color-circle-nav">
            {weekData.map((day, index) => (
              <div
                key={index}
                className="color-circle"
                style={{ backgroundColor: day.hexCode }}
                onClick={() => setSelectedDay(day)}
                aria-label={`Select ${day.date}`}
              ></div>
            ))}
          </div>
          <div className="diary-container">
            <h2>{selectedDay.date}</h2>
            <img src={selectedDay.imageUrl} alt="Diary illustration" />
            <div className="emotions">
                <p id="emotion_text">대표 감정</p>
              {selectedDay.emotions.map((emotion, index) => (
                <span key={index} className="emotion-tag">
                  {emotion}
                </span>
              ))}
            </div>
            <p id="ai_text">모디의 한 마디</p>
            <p className="ai-message">{selectedDay.aiMessage}</p>
            <p id="diary_text">이 날의 일기</p>
            <p className="diary-entry">{selectedDay.diary}</p>
            <button id="diary_button"
              onClick={() =>
                alert("일기 자세히 보기 기능은 추후 추가될 예정입니다.")
              }
            >
              일기 자세히 보기
            </button>
          </div>
        </div>
      </div>
      <div id="nevi">
                <button id="home"></button>
                <button id="diary"></button>
                <button id="my"></button>
            </div>
    </div>
  );
};

export default Weekly;
