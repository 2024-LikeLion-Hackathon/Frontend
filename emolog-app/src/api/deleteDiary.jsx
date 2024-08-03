import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com';

/**
 * 특정 ID의 일기 데이터를 서버로부터 가져오는 함수
 * @param {string} id - 가져올 일기의 ID
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const deleteDiary= async (id, token) => {
  try {
    console.log(id);
    const response = await axios.delete(`${BASE_URL}/api/diary/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // 사용자 토큰을 헤더에 추가
        
       
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching diary data:', error);
    throw error;
  }
};