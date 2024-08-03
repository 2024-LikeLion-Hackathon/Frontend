import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * 사용자 정보를 업데이트하는 함수
<<<<<<< HEAD
 * @param {string} userId - 사용자 ID
 * @param {string} accessToken
=======
>>>>>>> 3c224261b6d475f7015df867e0f0d61f7a27891c
 * @param {Object} userData - 업데이트할 사용자 데이터
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} 서버 응답 데이터
 */
<<<<<<< HEAD
export const putUser = async (userId, userData, accessToken) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/user`, userData);
=======
export const putUser = async (userData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/user`, userData, {
      headers: {
        'Authorization': `Bearer ${token}` // 인증 헤더에 토큰 추가
      }
    });
>>>>>>> 3c224261b6d475f7015df867e0f0d61f7a27891c
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};
