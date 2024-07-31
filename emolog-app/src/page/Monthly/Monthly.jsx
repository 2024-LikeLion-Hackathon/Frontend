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
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [diarySummaries, setDiarySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  
  useEffect(() => {
    // 로컬 스토리지에서 토큰 읽어오기
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const currentYear = today.getFullYear();
  const todayString = `${currentYear}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    const fetchDiarySummaries = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/color?month=${currentMonth + 1}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`, // 사용자 토큰을 헤더에 추가
            },
          }
        );
        setDiarySummaries(response.data || []); // 응답 데이터가 없을 경우 빈 배열로 초기화
      } catch (err) {
        setError("다이어리 요약 정보를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiarySummaries();
  }, [currentMonth, token]);

  const handleDayClick = async (day) => {
    const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const selected = diarySummaries.find(
      (entry) => entry.diary?.date === selectedDate
    ) || { date: selectedDate, diary: null };

    setSelectedDay(selected);
    
    if (selected.diary) {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/diary/summary/${selected.date}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`, // 사용자 토큰을 헤더에 추가
            },
          }
        );
        setSelectedDay({
          ...selected,
          diary: response.data.diary,
          color: response.data.color,
          imageUrl: response.data.imageUrl,
          emotion: response.data.emotion,
          comment: response.data.comment,
        });
      } catch (err) {
        setError("다이어리 세부 정보를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDayIndex = (firstDayIndex + 6) % 7;

  const calendar = generateCalendar(daysInCurrentMonth, adjustedFirstDayIndex);

  const handleWriteDiary = () => {
    navigate("/write", { state: { date: selectedDay?.date } });
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

        <div id="mainBoard">
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
                    {week.map((day, dayIndex) => {
                      const selectedDate = `${currentYear}-${String(
                        currentMonth + 1
                      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const diaryEntry = diarySummaries.find(
                        (entry) => entry.diary?.date === selectedDate
                      );
                      const backgroundColor = diaryEntry
                        ? diaryEntry.color.hexa
                        : "#d9d9d9";

                      return (
                        <div
                          key={dayIndex}
                          className={`calendar-day ${day ? "" : "null"} ${
                            day && selectedDay?.date === selectedDate
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => day && handleDayClick(day)}
                        >
                          {day && (
                            <>
                              <div id="union" style={{ backgroundColor }}></div>
                              {day}
                            </>
                          )}
                        </div>
                      );
                    })}
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
              <div id="no-diary">
                <div id="empty-diary"></div>
                <p>이 날은 일기가 없어요</p>
                <button id="diary_button" onClick={handleWriteDiary}>
                  일기 쓰러 가기
                </button>
              </div>
            ) : error ? (
              <div id="no-diary">
                <div id="empty-diary"></div>
                <p>데이터를 가져오는 중 오류가 발생했습니다</p>
                <button id="diary_button" onClick={handleWriteDiary}>
                  일기 쓰러 가기
                </button>
              </div>
            ) : selectedDay?.diary ? (
              <>
                <h2>
                  {selectedDay.diary.date}
                  <span className="hex-code">{selectedDay.color?.hexa}</span>
                </h2>
                <div className="color-circle-container">
                  {diarySummaries.map((day, index) => (
                    <div
                      key={index}
                      className={`color-circle ${
                        selectedDay.diary.date === day.diary?.date
                          ? "selected"
                          : ""
                      }`}
                      style={{ backgroundColor: day.color.hexa }}
                      onClick={() => handleDayClick(day.diary.date)}
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
              <div id="no-diary">
                <h2>
                  {selectedDay?.date}
                  <span className="hex-code">{selectedDay?.color?.hexa}</span>
                </h2>
                <div id="empty-diary"></div>
                <p>이 날은 일기가 없어요</p>
                <button id="diary_button" onClick={handleWriteDiary}>
                  일기 쓰러 가기
                </button>
              </div>
            )}
          </div>
        </div>
        <div id="nevi">
          <button id="home" onClick={() => navigate('/')}></button>
          <button id="diary" onClick={() => navigate('/write')}></button>
          <button id="my" onClick={() => navigate('/mypage')}></button>
        </div>
      </div>
    </div>
  );
};

export default Monthly;
