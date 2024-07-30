import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * 사용자 정보를 업데이트하는 함수
 * @param {string} userId - 사용자 ID
 * @param {string} accessToken
 * @param {Object} userData - 업데이트할 사용자 데이터
 * @param {string} userData.nickname - 사용자의 닉네임
 * @param {number} userData.age - 사용자의 나이
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const putUser = async (userId, userData, accessToken) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/user`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};
