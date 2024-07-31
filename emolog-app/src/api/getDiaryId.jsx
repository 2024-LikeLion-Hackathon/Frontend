import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com';

/**
 * 특정 ID의 일기 데이터를 서버로부터 가져오는 함수
 * @param {} date - 가져올 일기의 ID
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const getDiaryId = async (date) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/diary/${date}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching diary data:', error);
    throw error;
  }
};
