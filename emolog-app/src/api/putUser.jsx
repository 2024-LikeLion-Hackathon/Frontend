import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * 사용자 정보를 업데이트하는 함수
 * @param {Object} userData - 업데이트할 사용자 데이터
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const putUser = async (userData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/user`, userData, {
      headers: {
        'Authorization': `Bearer ${token}` // 인증 헤더에 토큰 추가
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};
