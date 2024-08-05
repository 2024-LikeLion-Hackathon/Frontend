import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL; //|| 'https://emolog.kro.kr';

export const fetchColor = async (token ,month, week) => {
  try {
    const response = await axios.get(`/api/color?month=${month}&week=${week}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // 사용자 토큰을 헤더에 추가

      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching color data:", error);
    throw error;
  }
};