import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
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
  const [selectedDay, setSelectedDay] = useState(null);
  const [diarySummaries, setDiarySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 현재 연도
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchDiarySummaries = async () => {
      setLoading(true);
      try {
        // API 호출: 특정 월의 일기 요약 데이터를 가져오기
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/diaries/${currentYear}/${currentMonth + 1}`);
        setDiarySummaries(response.data);
        setSelectedDay(response.data.length ? response.data[0] : null);
      } catch (err) {
        setError('Failed to fetch diary summaries');
      } finally {
        setLoading(false);
      }
    };

    fetchDiarySummaries();
  }, [currentMonth, currentYear]);

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
    const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const selected = diarySummaries.find(
      (entry) => entry.diary.date === selectedDate
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
                        day && selectedDay?.diary.date === `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
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
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : selectedDay ? (
            <>
              <h2>
                {selectedDay.diary.date}
                <span className="hex-code">{selectedDay.color.hexa}</span>
              </h2>
              <div className="color-circle-container">
                {diarySummaries.map((day, index) => (
                  <div
                    key={index}
                    className={`color-circle ${
                      selectedDay.diary.date === day.diary.date ? "selected" : ""
                    }`}
                    style={{ backgroundColor: day.color.hexa }}
                    onClick={() => setSelectedDay(day)}
                  ></div>
                ))}
              </div>
              <img src={selectedDay.imageUrl} alt="Diary illustration" />
              <div className="emotions">
                <p id="emotion_text">대표 감정</p>
                {selectedDay.emotion.map((emotion, index) => (
                  <span key={index} className="emotion-tag">
                    {emotion}
                  </span>
                ))}
              </div>
              <p id="ai_text">모디의 한 마디</p>
              <p className="ai-message">{selectedDay.comment}</p>
              <p id="diary_text">이 날의 일기</p>
              <p className="diary-entry">{selectedDay.diary.content}</p>
              <button
                id="diary_button"
                onClick={() =>
                  alert("일기 자세히 보기 기능은 추후 추가될 예정입니다.")
                }
              >
                일기 자세히 보기
              </button>
            </>
          ) : (
            <p>일기 데이터가 없습니다.</p>
          )}
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
