import axios from 'axios';
import { refreshToken } from './refreshToken'; // 경로를 실제 파일 위치에 맞게 조정

const BASE_URL = process.env.REACT_APP_BASE_URL //|| 'https://emolog.kro.kr';

/**
 * 특정 날짜의 일기 요약 데이터를 서버로부터 가져오는 함수
 * @param {String} date - 가져올 일기의 날짜 (형식: YYYY-MM-DD)
 * @param {String} token - 사용자 accessToken
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const getDiarySummaries = async (date, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/diary/summary/${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // 사용자 accessToken을 헤더에 추가
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) { // 401 Unauthorized 에러 발생 시
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { accessToken } = await refreshToken(refreshToken);
          localStorage.setItem('token', accessToken); // 새로운 accessToken 저장
          // 갱신된 accessToken으로 요청 다시 시도
          const retryResponse = await axios.get(`${BASE_URL}/api/diary/summary/${date}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          });
          return retryResponse.data;
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError.response ? refreshError.response.data : refreshError.message);
          throw refreshError;
        }
      }
    }
    console.error('Error fetching diary summary data:', error.response ? error.response.data : error.message);
    throw error;
  }
};