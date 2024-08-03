import axios from 'axios';

const BASE_URL = '//emolog-server.ap-northeast-2.elasticbeanstalk.com';

/**
 * 사용자 정보를 저장하는 함수
 * @param {string} userId 유저 ID
 * @param {Object} userData 사용자 데이터
 * @param {string} userData.nickname 닉네임
 * @param {number} userData.age 나이
 * @returns {Promise<void>}
 */
export const postUser = async (userId, userData) => {
    try {
      await axios.post(`${BASE_URL}/user-info/${userId}`, userData);
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  };