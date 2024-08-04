import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(Math.ceil(today.getDate() / 7));
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [diarySummaries, setDiarySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const initialDate = location.state?.date || new Date().toISOString().split("T")[0];

  // Token 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  // 데이터 가져오기
  useEffect(() => {
    if (!token) return;
    fetchDiaryData();
  }, [token, selectedWeek, currentMonth]); // token, selectedWeek, currentMonth가 변경될 때마다 호출됨

  const fetchDiaryData = async () => {
    try {
      setLoading(true);

      // 색상 데이터 요청
      const colorResponse = await axios.get(
        `/api/color?month=${currentMonth}&week=${selectedWeek}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDiarySummaries(colorResponse.data);

      // 다이어리 요약 데이터 요청
      const diaryDataResponse = await axios.get(
        `/api/diary/summary/${initialDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDiary(diaryDataResponse.data);
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  };

  const handleErrors = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          switch (error.response.data.error) {
            case "User-101":
              setError("이미 존재하는 회원입니다.");
              break;
            case "User-103":
              setError("OAuth 로그인 중 오류 발생");
              break;
            case "Token-101":
              setError("Token이 유효하지 않습니다.");
              break;
            case "Token-102":
              setError("토큰이 만료되었습니다.");
              break;
            case "Token-103":
              setError("지원되지 않는 토큰입니다.");
              break;
            case "Token-104":
              setError("토큰이 올바른 형식이 아니거나 claim이 비어 있습니다.");
              break;
            case "Diary-201":
              setError("해당 날짜에 일기가 이미 존재합니다.");
              break;
            case "Diary-202":
              setError("해당 일기에 접근 권한이 없습니다.");
              break;
            case "Diary-203":
              setError("이미지 저장 중 오류 발생");
              break;
            case "Diary-204":
              setError("API 연결 중 오류 발생");
              break;
            default:
              setError("클라이언트 오류가 발생했습니다.");
              break;
          }
          break;
        case 401:
          switch (error.response.data.error) {
            case "User-102":
              setError("접근 권한이 없습니다.");
              break;
            case "Token-100":
              setError("존재하지 않는 회원입니다.");
              break;
            case "Token-104":
              setError("해당 RefreshToken에 맞는 회원이 존재하지 않습니다.");
              break;
            default:
              setError("인증 오류가 발생했습니다.");
              break;
          }
          break;
        case 404:
          switch (error.response.data.error) {
            case "Token-105":
              setError("토큰이 존재하지 않습니다.");
              break;
            case "Diary-200":
              setError("해당 일기가 존재하지 않습니다.");
              break;
            default:
              setError("요청한 리소스를 찾을 수 없습니다.");
              break;
          }
          break;
        case 500:
          setError("내부 서버 오류가 발생했습니다.");
          break;
        default:
          setError("서버 오류가 발생했습니다.");
          break;
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      setError("서버로부터 응답을 받지 못했습니다.");
    } else {
      console.error("Error setting up request:", error.message);
      setError("요청을 설정하는 중에 오류가 발생했습니다.");
    }
  };

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
    const selectedDate = day.date;
  
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/diary/summary/${selectedDate}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDiary(response.data);
      setSelectedDay(response.data.diary.date === selectedDate ? response.data : { diary: { date: selectedDate } });
    } catch (err) {
      console.error('Error fetching diary details:', err);
      setError("다이어리 세부 정보를 가져오는 데 실패했습니다.");
      setSelectedDay({ diary: { date: selectedDate } }); // 일기가 없는 날에도 선택되도록 설정
    } finally {
      setLoading(false);
    }
  };
  

  const handleWriteDiary = () => {
    navigate("/write", { state: { date: selectedDay?.diary.date } });
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
                    selectedDay?.diary.date === day.date ? "selected" : ""
                  }`}
                  onClick={() => handleDayClick(day)}
                  style={{
                    backgroundColor:
                      day.color && day.color.hexa
                        ? `#${day.color.hexa}`
                        : `#d9d9d9`,
                  }}
                ></div>
              </div>
            ))}
          </div>
          {loading ? (
            <div id="loading">Loading...</div>
          ) : selectedDay?.diary ? (
            <div className="diary-container">
              <h2>{selectedDay.diary.date}</h2>
              <p id="emotion_text">대표 감정</p>
              <div className="emotions">
                {selectedDay.emotion.map((emotion, index) => (
                  <button key={index} className="emotion">
                    {emotion}
                  </button>
                ))}
              </div>
              <p id="ai_text">모디의 한 마디</p>
              <p className="ai-message">{selectedDay.comment}</p>
              <p id="diary_text">이 날의 일기</p>
              <p className="diary-entry">{selectedDay.diary.content}</p>
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
