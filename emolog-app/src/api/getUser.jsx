import axios from 'axios';

const BASE_URL = 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com/' || 'localhost:3000';

/**
 * 사용자 정보를 가져오는 함수
 * @returns {Promise<Object>} 사용자 정보
 * @param {string} accessToken
 */
export const getUser = async (accessToken) => {
  const response = await axios.get(`${BASE_URL}/api/user`, {
    headers: {
      'Authorization': `Bearer ${accessToken}` // 인증 헤더에 임시 토큰 추가
    }
  });
  try {
    const response = await axios.get(`${BASE_URL}api/user`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};


