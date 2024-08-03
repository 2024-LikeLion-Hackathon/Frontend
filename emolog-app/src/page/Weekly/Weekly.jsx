import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDiarySummaryId } from '../../api/getDiarySummaryId';
import { getDiaryId } from '../../api/getDiaryId';
import "./Weekly.css";

const Weekly = () => {
  const navigate = useNavigate();
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(Math.ceil(today.getDate() / 7));
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [diarySummaries, setDiarySummaries] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiarySummaries = async () => {
      setLoading(true);
      try {
        const summaries = await getDiarySummaryId(currentYear, currentMonth);
        setDiarySummaries(summaries);
        setSelectedDay(summaries.length ? summaries[0] : null);
      } catch (err) {
        setError('Failed to fetch diary summaries');
      } finally {
        setLoading(false);
      }
    };

    fetchDiarySummaries();
  }, [currentYear, currentMonth]);

  const handleNextWeek = () => {
    const totalWeeks = Math.ceil(new Date(currentYear, currentMonth, 0).getDate() / 7);
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
      const totalWeeks = Math.ceil(new Date(currentYear, currentMonth - 1, 0).getDate() / 7);
      setSelectedWeek(totalWeeks);
    }
  };

  const getWeekData = (weekNumber) => {
    const startDay = (weekNumber - 1) * 7 + 1;
    const endDay = weekNumber * 7;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    const weekData = [];
    for (let day = startDay; day <= endDay && day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const summary = diarySummaries.find(summary => summary.date === dateStr);
      weekData.push(summary || { date: dateStr, color: { hexa: '#d9d9d9' } });
    }
    return weekData;
  };

  const weekData = getWeekData(selectedWeek);

  const handleDayClick = async (day) => {
    if (!day) return;
    try {
      const diary = await getDiaryId(day.id);
      setSelectedDay(diary || day);
    } catch (err) {
      console.error('Failed to fetch diary details', err);
    }
  };

  const handleWriteDiary = () => {
    navigate("/write");
  };

  return (
    <div className="weekly-container">
      <div id="back">
        <header>
          <div id="logo"></div>
          <div className="tab">
            <span id="month" onClick={() => navigate('/')}>Month</span>
            <span id="bar"></span>
            <span className="active" id="week" onClick={() => navigate('/weekly')}>
              Week
            </span>
          </div>
          <div className="week-navigation">
            <button onClick={handlePreviousWeek}>&lt;</button>
            <h3>{currentMonth}월 {selectedWeek}주차</h3>
            <button onClick={handleNextWeek}>&gt;</button>
          </div>
        </header>
  
        <div className="weekly-content">
          <div className="color-circle-nav">
            {weekData.map((day, index) => (
              <div
                key={index}
                className={`color-circle ${selectedDay?.date === day.date ? "selected" : ""}`}
                style={{ backgroundColor: day ? day.color.hexa : "#d9d9d9" }}
                onClick={() => handleDayClick(day)}
                aria-label={`Select ${day?.date}`}
              ></div>
            ))}
          </div>
          {selectedDay ? (
            <div className="diary-container">
              <h2>{selectedDay.date}</h2>
              {selectedDay.imageUrl && <img src={selectedDay.imageUrl} alt="Diary illustration" />}
              <div className="emotions">
                <p id="emotion_text">대표 감정</p>
                {selectedDay.emotions?.map((emotion, index) => (
                  <span key={index} className="emotion-tag">
                    {emotion}
                  </span>
                )) || <p>감정 정보가 없습니다.</p>}
              </div>
              <p id="ai_text">모디의 한 마디</p>
              <p className="ai-message">{selectedDay.aiMessage || 'AI 메시지가 없습니다.'}</p>
              <p id="diary_text">이 날의 일기</p>
              <p className="diary-entry">{selectedDay.diary || '일기 내용이 없습니다.'}</p>
              <button
                id="diary_button"
                onClick={() => alert("일기 자세히 보기 기능은 추후 추가될 예정입니다.")}
              >
                일기 자세히 보기
              </button>
            </div>
          ) : (
            
            <div className="diary-container" id="no-diary">
              
              <div id="empty-diary"></div>
              <p>이 날의 일기가 없어요</p>
              <button
                id="diary_button"
                onClick={handleWriteDiary}
              >
                일기 쓰러 가기
              </button>
            </div>
          )}
        </div>
      </div>
              
      <div id="nevi">
            <button id="home" onClick={() => navigate('/')} ></button>
            <button id="diary" onClick={() => navigate('/write')}></button>
            <button id="my" onClick={() => navigate('/mypage')}></button>
        </div>
    </div>
  );
}

export default Weekly;
