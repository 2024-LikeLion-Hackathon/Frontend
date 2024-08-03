import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getDiaryId } from "../../api/getDiaryId";
import { fetchColorData } from "../../api/color";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import axios from "axios";
import "./Weekly.css";

const Weekly = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(
    Math.ceil(today.getDate() / 7)
  );
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [diarySummaries, setDiarySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const initialDate =
    location.state?.date || new Date().toISOString().split("T")[0];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return; // 토큰이 없으면 데이터를 가져오지 않음

    const fetchDiaryData = async () => {
      try {
        setLoading(true);

        // 주별 색상 데이터를 가져옵니다.
        const response = await axios.get(
          `/api/color?month=${currentMonth}&week=${selectedWeek}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDiarySummaries(response.data);

        const DiaryData = await getDiaryId(initialDate, token);
        setDiary(DiaryData);
      } catch (error) {
        console.error("Error fetching diary data:", error);
        setError("Error fetching diary data");
      } finally {
        setLoading(false);
      }
    };

    fetchDiaryData();
  }, [token, currentMonth, selectedWeek, initialDate]);

  const handleNextWeek = () => {
    const totalWeeks = Math.ceil(
      new Date(currentYear, currentMonth, 0).getDate() / 7
    );
    if (selectedWeek < totalWeeks) {
      setSelectedWeek(selectedWeek + 1);
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
      setSelectedWeek(1);
    }
  };

  const handlePreviousWeek = () => {
    if (selectedWeek > 1) {
      setSelectedWeek(selectedWeek - 1);
    } else {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
      const totalWeeks = Math.ceil(
        new Date(currentYear, currentMonth - 1, 0).getDate() / 7
      );
      setSelectedWeek(totalWeeks);
    }
  };

  const getWeekData = (weekNumber) => {
    const startDay = (weekNumber - 1) * 7 + 1;
    const endDay = weekNumber * 7;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const weekData = [];
    for (let day = startDay; day <= endDay && day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const summary = diarySummaries.find(
        (summary) => summary.date === dateStr
      );
      weekData.push(summary || { date: dateStr, color: { hexa: "d9d9d9" } });
    }
    return weekData;
  };

  const weekData = getWeekData(selectedWeek);

  const handleDayClick = async (day) => {
    const selectedDate = `${currentYear}-${String(currentMonth).padStart(
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

  const handleWriteDiary = () => {
    navigate("/write", { state: { date: selectedDay?.date } });
  };

  const handleResultDiary = () => {
    if (selectedDay?.diary.date) {
      navigate("/result", { state: { date: selectedDay.diary.date } });
    } else {
      alert("No diary entry selected");
    }
  };

  return (
    <div className="weekly-container">
      <div id="back">
        <header>
          <div id="logo"></div>
          <div className="tab">
            <span id="month" onClick={() => navigate("/")}>
              Month
            </span>
            <span id="bar"></span>
            <span
              className="active"
              id="week"
              onClick={() => navigate("/weekly")}
            >
              Week
            </span>
          </div>
          <div className="week-navigation">
            <button onClick={handlePreviousWeek}>&lt;</button>
            <h3>
              {currentMonth}월 {selectedWeek}주차
            </h3>
            <button onClick={handleNextWeek}>&gt;</button>
          </div>
        </header>

        <div className="weekly-content">
          <div className="color-circle-nav">
            {weekData.map((day, index) => (
              <div
                key={index}
                className={`color-circle-container ${
                  selectedDay?.diary.date === day.date ? "selected" : ""
                }`}
              >
                <div
                  className={`color-circle ${
                    selectedDay?.date === day.date ? "selected" : ""
                  }`}
                  onClick={() => handleDayClick(day)}
                  style={{
                    backgroundColor:
                      diary.color && diary.color.hexa
                        ? `#${diary.color.hexa}`
                        : `#d9d9d9`,
                  }}
                ></div>
              </div>
            ))}
          </div>
          {selectedDay ? (
            <div className="diary-container">
              <h2>{selectedDay.date}</h2>
              {selectedDay.imageUrl && (
                <img src={selectedDay.imageUrl} alt="Diary illustration" />
              )}
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
              <button id="diary_button" onClick={handleResultDiary}>
                일기 자세히 보기
              </button>
            </div>
          ) : (
            <div className="diary-container" id="no-diary">
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
  );
};

export default Weekly;
