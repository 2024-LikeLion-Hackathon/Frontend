import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { fetchColor } from "../../api/color";
import { getDiarySummaries } from "../../api/getDiarySummaries";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import "./Weekly.css";

const Weekly = () => {
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
  const [selectedDay, setSelectedDay] = useState({
    diary: { date: "", emotion: [], comment: "", content: "" },
  });
  const [selectedWeek, setSelectedWeek] = useState(
    Math.ceil(today.getDate() / 7)
  );
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [diarySummaries, setDiarySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [weekData, setWeekData] = useState([]);
  const location = useLocation();
  const initialDate =
    location.state?.date || new Date().toISOString().split("T")[0];

  // Token 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    setToken(storedToken);
    setRefreshToken(storedRefreshToken);
  }, []);

  // 데이터 가져오기
  useEffect(() => {
    if (!token) return;

    const fetchDiaryData = async () => {
      try {
        setLoading(true);

        // 색상 데이터 요청
        const colorData = await fetchColor(token, currentMonth, selectedWeek);
        console.log('Color Data:', colorData); // 색상 데이터 확인
        const colorArray = colorData.map((entry) => ({
          date: entry.date,
          color: `#${entry.hexa}`,
        }));

        setDiarySummaries(colorArray); // 배열로 설정

        // 다이어리 요약 데이터 요청
        const DiaryData = await getDiarySummaries(initialDate, token);
        setDiary(DiaryData);
        setSelectedDay(DiaryData.diary.date === initialDate ? DiaryData : { diary: { date: initialDate, emotion: [], comment: "" } });
      } catch (error) {
        handleErrors(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiaryData();
  }, [token, selectedWeek, currentMonth]);

  // 오류 처리
  const handleErrors = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          setError(`클라이언트 오류: ${error.response.data.error}`);
          break;
        case 401:
          setError("인증 오류가 발생했습니다.");
          break;
        case 404:
          setError("리소스를 찾을 수 없습니다.");
          break;
        case 500:
          setError("서버 내부 오류가 발생했습니다.");
          break;
        default:
          setError("알 수 없는 오류가 발생했습니다.");
          break;
      }
    } else if (error.request) {
      setError("서버로부터 응답을 받지 못했습니다.");
    } else {
      setError("요청을 설정하는 중에 오류가 발생했습니다.");
    }
  };

  // 날짜가 변경될 때 주간 데이터를 업데이트
  useEffect(() => {
    if (diarySummaries.length > 0) {
      setWeekData(getWeekData(selectedWeek));
    }
  }, [diarySummaries, selectedWeek, currentMonth, currentYear]);

  // 주간 데이터 생성
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
      weekData.push(summary || { date: dateStr, color: "#d9d9d9" });
    }
    console.log('Week Data:', weekData); // 주간 데이터 확인
    return weekData;
  };

  // 다이어리 버튼 클릭 핸들러
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

  // 일기 클릭 핸들러
  const handleDayClick = async (day) => {
    const selectedDate = day.date;

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
      console.log("성공");
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

  // 날짜 포맷팅 함수
  const formatDate = (dateStr) => {
    const date = parseISO(dateStr);
    return format(date, "M월 d일 EEEE", { locale: ko });
  };

  const formattedDate = formatDate(
    selectedDay.diary.date || today.toISOString()
  );

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
                <div id="weekly_circle"></div>
                <div
                  className={`color-circle ${
                    selectedDay?.diary.date === day.date ? "selected" : ""
                  }`}
                  onClick={() => handleDayClick(day)}
                  style={{
                    backgroundColor: day.color || `#d9d9d9`,
                  }}
                ></div>
              </div>
            ))}
          </div>
          {loading ? (
            <div id="loading">Loading...</div>
          ) : selectedDay?.diary ? (
            <div className="diary-container">
              <h2 id="daily">
                {formattedDate}
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
                    <button id="diary_button" onClick={handleResultDiary}>
                      일기 자세히 보기
                    </button>
                  </div>
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
        <button id="diary" onClick={handleDiaryButtonClick}></button>
        <button id="my" onClick={() => navigate("/mypage")}></button>
      </div>
    </div>
  );
};

export default Weekly;
