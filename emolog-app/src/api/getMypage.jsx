import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL //|| 'https://emolog.kro.kr'; // 기본 URL 설정

/**
 * 마이페이지 정보를 가져오는 함수
 * @param {string} token - 사용자 토큰
 * @returns {Promise<Object>} 마이페이지 정보
 */
export const getMypage = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/mypage`, {
      headers: {
        'Authorization': `Bearer ${token}`, // 사용자 토큰을 헤더에 추가
      }
    });
    console.log('Mypage data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching mypage data:', error.response ? error.response.data : error.message);
    throw error;
  }
};
