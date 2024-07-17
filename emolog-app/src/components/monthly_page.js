import React, { useEffect, useRef } from 'react';
import $ from 'jquery';

const Monthly = () => {
  const calendarRef = useRef(null);

  useEffect(() => {
    const events = [
      {
        id: 1,
        name: "예시 이벤트",
        startdate: "2024-07-01",
        enddate: "2024-07-31",
        color: "#ff0000"
      }
    ];

    if (calendarRef.current) {
      $(calendarRef.current).monthly({
        mode: 'event',
        dataType: 'json',
        locale: 'ko',
        events,
        monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        dayNames: ["일", "월", "화", "수", "목", "금", "토"],
        weekStart: '월',
        stylePast: true,
      });
    }
  }, []);

  return (
    <div className="calendar-container">
      <div ref={calendarRef} id="calendar" className="monthly"></div>
    </div>
  );
};

export default Monthly;
