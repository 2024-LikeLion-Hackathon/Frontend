import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * 마이페이지 정보를 가져오는 함수
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 마이페이지 정보
 */
export const getMypage = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}/mypage`);
    return response.data;
  } catch (error) {
    console.error('Error fetching mypage data:', error);
    throw error;
  }
};
