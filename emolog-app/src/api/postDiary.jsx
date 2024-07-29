import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * 일기 데이터를 서버로 전송하는 함수
 * @param {Object} diaryData - 전송할 일기 데이터
 * @param {string} diaryData.date - 일기 작성 날짜 (LocalDate 형식)
 * @param {string} diaryData.content - 일기 내용
 * @param {Object} diaryData.q_a - 일기 질문과 답변
 * @param {string} diaryData.q_a.question - 질문 내용
 * @param {string} diaryData.q_a.answer - 답변 내용
 * @param {string} diaryData.emotion - 감정 (콤마로 구분된 문자열)
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const postDiary = async (diaryData) => {
  try {
    console.log('Sending diary data:', diaryData); // 디버깅용 로그
    const response = await axios.post(`${BASE_URL}api/diary`, diaryData, {withCredentials: true,});
    
    return response.data;
  } catch (error) {
    console.error('Error posting diary data:', error);
    throw error;
  }
};
