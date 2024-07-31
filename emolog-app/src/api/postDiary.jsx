import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com';

/**
 * 일기 데이터를 서버로 전송하는 함수
 * @param {Object} diaryData - 전송할 일기 데이터
 * @param {string} token - 사용자 토큰
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const postDiary = async (diaryData, token) => {
  try {
    console.log('Sending diary data:', diaryData); // 추가된 로그
    const response = await axios.post(`${BASE_URL}/api/diary`, diaryData, {
      headers: {
        'Authorization': `Bearer ${token}`, // 사용자 토큰을 헤더에 추가
       
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버에서 응답을 받았지만 상태 코드가 2xx 범위에 있지 않을 경우
      const { status, data } = error.response;
      console.error('Error response:', status, data);
    } else if (error.request) {
      // 요청이 이루어졌으나 응답을 받지 못함
      console.error('No response received:', error.request);
    } else {
      // 요청을 설정하는 중에 오류가 발생함
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};
