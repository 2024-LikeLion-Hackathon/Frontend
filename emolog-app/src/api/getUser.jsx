import axios from 'axios';

const BASE_URL = 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com/';

/**
 * 사용자 정보를 가져오는 함수
 * @returns {Promise<Object>} 사용자 정보
 */
export const getUser = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/user-info`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

