import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Monthly.css";

const months = [
  "1월",
  "2월",
  "3월",
  "4월",
  "5월",
  "6월",
  "7월",
  "8월",
  "9월",
  "10월",
  "11월",
  "12월",
];

const monthlyData = [
  {
    date: "7월 1일 월요일",
    hexCode: "#F29496",
    emotions: ["행복", "차분", "달달"],
    aiMessage: "이 행복을 조금이라도 즐길 수 있길",
    diary:
      "오늘 아침, 행복을 보니 비가 부슬부슬 내리고 있었다. 이런 날씨에 집에서 나가기가 싫었지만...",
    imageUrl: require("../../asset/img/AI_image1.png"),
  },
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
];

const generateCalendar = (daysInMonth, firstDayIndex) => {
  const calendar = [];
  let day = 1;

  for (let week = 0; week < 6; week++) {
    const weekRow = [];
    for (let weekday = 0; weekday < 7; weekday++) {
      if (week === 0 && weekday < firstDayIndex) {
        weekRow.push(null);
      } else if (day > daysInMonth) {
        weekRow.push(null);
      } else {
        weekRow.push(day);
        day++;
      }
    }
    calendar.push(weekRow);
  }

  return calendar;
};

const Monthly = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 현재 월(0-11 범위)
  const [selectedDay, setSelectedDay] = useState(monthlyData[0]);

  // 현재 연도
  const currentYear = new Date().getFullYear();

  // 월을 이동하는 함수
  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

  // 현재 월과 연도에 따른 일 수와 첫날 인덱스 계산
  const daysInCurrentMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate(); // 현재 월의 일 수
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 현재 월의 첫날 인덱스

  // JavaScript Date 객체에서 일요일을 0으로 반환하므로, 월요일을 0으로 맞추기 위해 인덱스 조정
  const adjustedFirstDayIndex = (firstDayIndex + 6) % 7;

  const calendar = generateCalendar(daysInCurrentMonth, adjustedFirstDayIndex);

  const handleDayClick = (day) => {
    const selectedDate = `${months[currentMonth]} ${day}일`;
    const selected = monthlyData.find(
      (entry) => entry.date.startsWith(selectedDate)
    );
    if (selected) setSelectedDay(selected);
  };
  

  return (
    <div className="monthly-container">
      <div id="back">
        <header>
          <div className="logo">
            <img src={require("../../asset/img/logo.png")} alt="Logo" />
          </div>
          <div className="tab">
            <span
              className="active"
              id="month"
              onClick={() => navigate("/monthly")}
            >
              Month
            </span>
            <span id="bar"></span>
            <span id="week" onClick={() => navigate("/weekly")}>
              Week
            </span>
          </div>
        </header>

        <div id="month_tab">
          <div id="month_text">
            {currentYear}년 {currentMonth + 1}월
          </div>
          <div id="button_tab">
            <button onClick={handlePreviousMonth}>&lt;</button>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
        </div>

        <div className="calendar-container">
          <div className="calendar">
            <div className="calendar-header">
              {["월", "화", "수", "목", "금", "토", "일"].map((day, index) => (
                <div key={index} className="calendar-header-day">
                  {day}
                </div>
              ))}
            </div>
            <div className="calendar-body">
              {calendar.map((week, weekIndex) => (
                <div key={weekIndex} className="calendar-week">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`calendar-day ${day ? "" : "null"} ${
                        day && selectedDay.date === `7월 ${day}일 월요일`
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => day && handleDayClick(day)}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div id="devider">
            <img
              src={require("../../asset/img/devider.png")}
              alt="------------------"
            />
          </div>
        </div>

        <div className="diary-section">
  <h2>
    {selectedDay.date}
    <span className="hex-code">{selectedDay.hexCode}</span>
  </h2>
  <div className="color-circle-container">
    {monthlyData.map((day, index) => (
      <div
        key={index}
        className={`color-circle ${
          selectedDay.date === day.date ? "selected" : ""
        }`}
        style={{ backgroundColor: day.hexCode }}
        onClick={() => setSelectedDay(day)}
      ></div>
    ))}
  </div>
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
            <button
              id="diary_button"
              onClick={() =>
                alert("일기 자세히 보기 기능은 추후 추가될 예정입니다.")
              }
            >
              일기 자세히 보기
            </button>
          </div>

<div id="nevi">
  <button id="home"></button>
  <button id="diary"></button>
  <button id="my"></button>
</div>
</div>
</div>

  );
};

export default Monthly;
