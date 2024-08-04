import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com';

/**
 * 새로운 accessToken을 발급받기 위해 refreshToken을 서버에 요청하는 함수
 * @param {String} refreshToken - 사용자 refreshToken
 * @returns {Promise<Object>} 새로운 accessToken 데이터
 */
export const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/refresh-token`, {
      refreshToken
    });
    return response.data; // { accessToken }
  } catch (error) {
    console.error('Error refreshing access token:', error.response ? error.response.data : error.message);
    throw error;
  }
};
