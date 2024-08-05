import axios from 'axios';
import FormData from 'form-data';


const BASE_URL = process.env.REACT_APP_BASE_URL //|| 'https://emolog.kro.kr'; // 수정된 BASE_URL

/**
 * 감정 데이터를 가져오는 함수
 * @param {string} content - 일기 내용
 * @param {string} date - 일기 날짜
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const fetchUrl = async (content, date, token) => {
  
  
  try {
    // FormData 객체 생성 및 데이터 추가
    const formData = new FormData();
    formData.append('content', content);
    formData.append('date', date);

    // 요청 보내기
    console.log(formData);
    const response = await axios.post(`${BASE_URL}/api/image/fetch-url`, formData, {
      headers: {
      // FormData 헤더 추가  ...formData.getHeaders(), 
        'Authorization': `Bearer ${token}`, // 인증 헤더 추가
      },
    });

    console.log("반환값", response.data);
   
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      console.error('Error response:', status, data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};
