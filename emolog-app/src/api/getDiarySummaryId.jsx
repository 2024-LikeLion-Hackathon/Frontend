import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com';

/**
 * 특정 ID의 일기 요약 데이터를 서버로부터 가져오는 함수
 * @param {String} date - 가져올 일기의 ID
 * @param {string} token - 사용자 토큰
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const getDiarySummaries = async (date,token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/diary/summary/${date}`,{
      headers: {
        'Authorization': `Bearer ${token}`, // 사용자 토큰을 헤더에 추가
      }
    
  });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching diary summary data:', error);
    throw error;
  }
};
