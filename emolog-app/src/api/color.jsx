import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || 'https://emolog.kro.kr';

// 월 단위로 색상 데이터를 가져오는 함수
export const fetchMonthlyColors = async (token, month) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/color?month=${month}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching monthly color data:", error);
    throw error;
  }
};

// 주 단위로 색상 데이터를 가져오는 함수
export const fetchColor = async (token, month, week) => {
  try {
    const fetchWeekData = async (weekNumber) => {
      const response = await axios.get(`${BASE_URL}/api/color?month=${month}&week=${weekNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    };

    // 현재 주와 다음 주의 데이터 요청
    const [currentWeekData, nextWeekData] = await Promise.all([
      fetchWeekData(week),
      fetchWeekData(week + 1),
    ]);

    // 두 주의 데이터를 병합
    const allWeekData = [...currentWeekData, ...nextWeekData];

    return allWeekData;
  } catch (error) {
    console.error("Error fetching color data:", error);
    throw error;
  }
};
