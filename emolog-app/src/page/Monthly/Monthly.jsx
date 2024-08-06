import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { fetchMonthlyColors } from "../../api/color"; // 주간 컴포넌트와 동일한 방식으로 import
import { getDiarySummaries } from "../../api/getDiarySummaries";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import "./Monthly.css";

const Monthly = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [diary, setDiary] = useState({
    diary: {
      date: "",
      dayOfWeek: "",
      content: "",
    },
    color: {
      hexa: "",
      red: "",
      green: "",
      blue: "",
    },
    emotion: [],
    comment: "",
    q_a: {
      question: "",
      answer: "",
    },
    summary: "",
    url: "",
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [diarySummaries, setDiarySummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const location = useLocation();
  const initialDate =
    location.state?.date || new Date().toISOString().split("T")[0];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchDiaryData = async () => {
      try {
        setLoading(true);

        const colorData = await fetchMonthlyColors(token, currentMonth, currentYear);
        const colorMap = colorData.reduce((acc, entry) => {
          acc[entry.date] = `#${entry.hexa}`;
          return acc;
        }, {});

        setDiarySummaries(colorMap);

        const DiaryData = await getDiarySummaries(initialDate, token);
        setDiary(DiaryData);
        setSelectedDay(DiaryData.diary.date === initialDate ? DiaryData : null);
      } catch (error) {
        console.error("Error fetching diary data:", error);
        setError("Error fetching diary data");
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryData();
  }, [token, currentMonth, currentYear]);

  const handleDayClick = async (day) => {
    const selectedDate = `${currentYear}-${String(currentMonth).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    try {
      setLoading(true);
      const response = await axios.get(`/api/diary/summary/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDiary(response.data);
      setSelectedDay(
        response.data.diary.date === selectedDate
          ? response.data
          : { diary: { date: selectedDate, emotion: [], comment: "" } }
      );
    } catch (err) {
      console.error("Error fetching diary details:", err);
      setError("다이어리 세부 정보를 가져오는 데 실패했습니다.");
      setSelectedDay({
        diary: { date: selectedDate, emotion: [], comment: "" },
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleDiaryButtonClick = async () => {
    const todayDate = new Date().toISOString().split("T")[0];
    try {
      const response = await getDiarySummaries(todayDate, token);
      if (response && response.diary && response.diary.date) {
        navigate("/result", { state: { date: todayDate } });
      } else {
        navigate("/write");
      }
    } catch (error) {
      console.error("Error fetching today's diary:", error);
      navigate("/write");
    }
  };

  const formatDate = (dateStr) => {
    const date = parseISO(dateStr);
    return format(date, "M월 d일 EEEE", { locale: ko });
  };

  const daysInCurrentMonth = new Date(
    currentYear,
    currentMonth,
    0
  ).getDate();

  const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay();
  const adjustedFirstDayIndex = (firstDayIndex + 6) % 7;

  const calendar = [];
  let day = 1;

  for (let week = 0; week < 6; week++) {
    const weekRow = [];
    for (let weekday = 0; weekday < 7; weekday++) {
      if (week === 0 && weekday < adjustedFirstDayIndex) {
        weekRow.push(null);
      } else if (day > daysInCurrentMonth) {
        weekRow.push(null);
      } else {
        weekRow.push(day);
        day++;
      }
    }
    calendar.push(weekRow);
  }

  return (
    <div className="monthly-container">
      <div id="back">
        <header>
          <div className="logo">
            <img src={require("../../asset/img/logo.png")} alt="Logo" />
          </div>
          <div className="tab">
            <span className="active" id="month" onClick={() => navigate("/")}>
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
              {currentYear}년 {currentMonth}월
            </div>
            <div id="button_tab">
              <button onClick={handlePreviousMonth}>&lt;</button>
              <button onClick={handleNextMonth}>&gt;</button>
            </div>
          </div>

          <div className="calendar-container">
            <div className="calendar">
              <div className="calendar-header">
                {["월", "화", "수", "목", "금", "토", "일"].map(
                  (day, index) => (
                    <div key={index} className="calendar-header-day">
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="calendar-body">
                {calendar.map((week, weekIndex) => (
                  <div key={weekIndex} className="calendar-week">
                    {week.map((day, dayIndex) => {
                      const selectedDate = day
                        ? `${currentYear}-${String(currentMonth).padStart(
                            2,
                            "0"
                          )}-${String(day).padStart(2, "0")}`
                        : null;
                      const backgroundColor = selectedDate
                        ? diarySummaries[selectedDate] || "#d9d9d9"
                        : "#d9d9d9";
                      return (
                        <div
                          key={dayIndex}
                          className={`calendar-day ${day ? "" : "null"} ${
                            day && selectedDay?.diary.date === selectedDate
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => day && handleDayClick(day)}
                        >
                          {day && (
                            <>
                              <div
                                id="union"
                                style={{
                                  backgroundColor: backgroundColor,
                                }}
                              ></div>
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
          </div>

          {loading ? (
            <div id="loading">Loading...</div>
          ) : selectedDay?.diary ? (
            <div className="diary-section">
              <h2 id="daily">
                {formatDate(selectedDay.diary.date)}
                {selectedDay.diary.content && (
                  <span className="hex-code">#{diary.color?.hexa}</span>
                )}
              </h2>
              {selectedDay.diary.content ? (
                <div className="diary-content">
                  <img id="aiimage" src={diary.url} alt="Diary illustration" />
                  <p id="emotion_text">대표 감정</p>
                  <div className="emotions">
                    {diary.emotion.map(
                      (emotion, index) =>
                        index < 3 && (
                          <button key={index} className="emotion">
                            {emotion}
                          </button>
                        )
                    )}
                  </div>

                  <p id="ai_text">모디의 한 마디</p>
                  <p className="ai-message">{selectedDay.comment}</p>

                  <div className="diary-details">
                    <p id="diary_text">이 날의 일기</p>
                    <p className="diary-entry">{selectedDay.diary.content}</p>
                    <button
                      id="diary_button"
                      onClick={() =>
                        navigate("/result", {
                          state: { date: selectedDay.diary.date },
                        })
                      }
                    >
                      일기 자세히 보기
                    </button>
                  </div>
                </div>
              ) : (
                <div className="diary-container" id="no-diary">
                  <div id="empty-diary"></div>
                  <p>이 날의 일기가 없어요</p>
                  <button
                    id="diary_button"
                    onClick={() =>
                      navigate("/write", {
                        state: { date: selectedDay?.diary.date },
                      })
                    }
                  >
                    일기 쓰러 가기
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="diary-container" id="no-diary">
              <div id="empty-diary"></div>
              <p>이 날의 일기가 없어요</p>
              <button
                id="diary_button"
                onClick={() =>
                  navigate("/write", {
                    state: { date: selectedDay?.diary.date },
                  })
                }
              >
                일기 쓰러 가기
              </button>
            </div>
          )}
        </div>
      </div>

      <div id="nevi">
        <button id="home" onClick={() => navigate("/")}></button>
        <button id="diary" onClick={handleDiaryButtonClick}></button>
        <button id="my" onClick={() => navigate("/mypage")}></button>
      </div>
    </div>
  );
};

export default Monthly;
