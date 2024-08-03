import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDiaryId } from "../../api/getDiaryId";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import axios from "axios";
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
   // 문자열을 배열로 변환
   const parseArray = (str) => {
    return str ? str.split('/').map(item => item.trim()).filter(item => item.length > 0) : [];
};
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
    summary:"",
    url:"",
  });
  const emotions = parseArray(diary.emotion.join('/'));
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [diarySummaries, setDiarySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const location = useLocation();
  const initialDate =
    location.state?.date || new Date().toISOString().split("T")[0];
  


  useEffect(() => {
    // 로컬 스토리지에서 토큰 읽어오기
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const currentYear = today.getFullYear();
  const todayString = `${currentYear}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    if (!token) return; // 토큰이 없으면 데이터를 가져오지 않음

    // 마이페이지 정보를 가져오는 함수 호출
    const fetchDiaryData = async () => {
      try {
        setLoading(true);
        const DiaryData = await getDiaryId(initialDate, token);
        setDiary(DiaryData);
      } catch (error) {
        console.error("Error fetching mypage data:", error);
        setError("Error fetching mypage data");
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryData();
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading diary data.</div>;

  const handleDayClick = async (day) => {
    const selectedDate = `${currentYear}-${String(currentMonth + 1).padStart(
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
    currentYear,
    currentMonth + 1,
    0
  ).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const adjustedFirstDayIndex = (firstDayIndex + 6) % 7;

  const calendar = generateCalendar(daysInCurrentMonth, adjustedFirstDayIndex);

  const handleWriteDiary = () => {
    navigate("/write", { state: { date: selectedDay?.date } });
  };

  // 날짜 포맷팅
  const diaryDate = diary.diary.date ? parseISO(diary.diary.date) : new Date();
  const month = isNaN(diaryDate) ? "" : format(diaryDate, "M", { locale: ko });
  const day = isNaN(diaryDate) ? "" : format(diaryDate, "d", { locale: ko });
  const dayOfWeek = isNaN(diaryDate)
    ? ""
    : format(diaryDate, "EEEE", { locale: ko });

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
                      const selectedDate = `${currentYear}-${String(
                        currentMonth + 1
                      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const diaryEntry = diarySummaries.find(
                        (entry) => entry.date === selectedDate
                      );
                      

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
                              <div id="union" style={{ backgroundColor: diary.color.hexa ? `#${diary.color.hexa}` : 'black' }}></div>
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
                  {month}월 {day}일 {dayOfWeek}
                  <span className="hex-code">#{diary.color?.hexa}</span>
                </h2>

                <div className="color-circle-container">
                  <div
                    className={`color-circle ${
                      selectedDay?.diary?.date === diary.diary.date ? "selected" : ""
                    }`}
                    style={{ backgroundColor: `#${diary.color.hexa}` }}
                  ></div>
                </div>
                <img src={diary.imageUrl}  alt="Diary illustration"/>
                <p id="emotion_text">대표 감정</p>
                <div className="emotions">
                  {emotions.map((emotion, index) => (
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
                  onClick={() =>
                    alert("일기 자세히 보기 기능은 추후 추가될 예정입니다.")
                  }
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
