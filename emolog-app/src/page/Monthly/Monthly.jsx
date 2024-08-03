import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDiaryId } from "../../api/getDiaryId";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import "./Monthly.css";

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
  const [diary, setDiary] = useState({
    diary: {
      date: "",
      dayOfWeek: "",
      content: "",
    },
    color: {
      hexa: "",
      red: 147,
      green: 134,
      blue: 92,
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
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [diaryColors, setDiaryColors] = useState({}); // 날짜별 색상 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const location = useLocation();
  const initialDate =
    location.state?.date || new Date().toISOString().split("T")[0];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchDiaryData = async () => {
      try {
        setLoading(true);
        
        // 현재 달의 모든 날짜를 검사하여 색상을 초기화합니다.
        const allDaysInMonth = generateCalendar(
          new Date(today.getFullYear(), currentMonth + 1, 0).getDate(),
          (new Date(today.getFullYear(), currentMonth, 1).getDay() + 6) % 7
        ).flat().filter(Boolean); // 현재 달의 모든 날짜

        // 모든 날짜에 대해 색상을 가져옵니다.
        const colorMap = {};
        await Promise.all(allDaysInMonth.map(async (day) => {
          const date = `${today.getFullYear()}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          try {
            const response = await getDiaryId(date, token);
            colorMap[date] = response.color.hexa || "#d9d9d9";
          } catch {
            colorMap[date] = "#d9d9d9"; // 실패할 경우 기본 색상 설정
          }
        }));

        setDiaryColors(colorMap);

        // 선택된 날짜의 다이어리 데이터 가져오기
        const DiaryData = await getDiaryId(initialDate, token);
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
  }, [token, currentMonth]);

  const handleDayClick = async (day) => {
    const selectedDate = `${today.getFullYear()}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    try {
      setLoading(true);
      const response = await getDiaryId(selectedDate, token);
      setDiary(response);
      setSelectedDay(response.diary.date === selectedDate ? response : null);
    } catch (err) {
      setError("다이어리 세부 정보를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
  };

  const daysInCurrentMonth = new Date(
    today.getFullYear(),
    currentMonth + 1,
    0
  ).getDate();
  const firstDayIndex = new Date(today.getFullYear(), currentMonth, 1).getDay();
  const adjustedFirstDayIndex = (firstDayIndex + 6) % 7;

  const calendar = generateCalendar(daysInCurrentMonth, adjustedFirstDayIndex);

  const handleWriteDiary = () => {
    navigate("/write", { state: { date: selectedDay?.diary.date } });
  };

  const handleResultDiary = () => {
    if (selectedDay?.diary.date) {
      navigate('/result', { state: { date:selectedDay.diary.date } });
    } else {
      alert("No diary entry selected");
    }
  };

  // 날짜 포맷팅
  const diaryDate = diary.diary.date ? parseISO(diary.diary.date) : new Date();
  const month = isNaN(diaryDate) ? '' : format(diaryDate, 'M', { locale: ko });
  const day = isNaN(diaryDate) ? '' : format(diaryDate, 'd', { locale: ko });
  const dayOfWeek = isNaN(diaryDate) ? '' : format(diaryDate, 'EEEE', { locale: ko });

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
              {today.getFullYear()}년 {currentMonth + 1}월
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
                      const selectedDate = `${today.getFullYear()}-${String(
                        currentMonth + 1
                      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const backgroundColor = diaryColors[selectedDate] || "#d9d9d9";
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
                <p>이 날의 일기가 없어요</p>
                <button id="diary_button" onClick={handleWriteDiary}>
                  일기 쓰러 가기
                </button>
              </div>
            ) : error ? (
              <div id="no-diary">
                <div id="empty-diary"></div>
                <p>이 날의 일기가 없어요</p>
                <button id="diary_button" onClick={handleWriteDiary}>
                  일기 쓰러 가기
                </button>
              </div>
            ) : selectedDay?.diary ? (
              <>
                <h2>
                  {month}월 {day}일 {dayOfWeek}
                  <span className="hex-code">#{diary.color?.hexa}</span>
                </h2>
                <img src={diary.url} alt="Diary illustration" />
                <p id="emotion_text">대표 감정</p>
                <div className="emotions">
                  {diary.emotion.map((emotion, index) => (
                    <button key={index} className="emotion">
                      {emotion}
                    </button>
                  ))}
                </div>
                <p id="ai_text">모디의 한 마디</p>
                <p className="ai-message">{diary.comment}</p>
                <p id="diary_text">이 날의 일기</p>
                <p className="diary-entry">{diary.diary.content}</p>
                <button
                  id="diary_button"
                  onClick={handleResultDiary}
                >
                  일기 자세히 보기
                </button>
              </>
            ) : (
              <div id="no-diary">
                <h2>{selectedDay?.date}</h2>
                <div id="empty-diary"></div>
                <p>이 날의 일기가 없어요</p>
                <button id="diary_button" onClick={handleWriteDiary}>
                  일기 쓰러 가기
                </button>
              </div>
            )}
          </div>
        </div>
        <div id="nevi">
          <button id="home" onClick={() => navigate("/")}></button>
          <button id="diary" onClick={() => navigate("/write")}></button>
          <button id="my" onClick={() => navigate("/mypage")}></button>
        </div>
      </div>
    </div>
  );
};

export default Monthly;
