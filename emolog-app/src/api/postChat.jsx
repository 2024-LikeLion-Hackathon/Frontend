import axios from 'axios';

const BASE_URL = 'https://emolog.kro.kr'; // 수정된 BASE_URL

/**
 * 감정 데이터를 가져오는 함수
 * @param {string} content - 일기 내용
 * @param {string} chatting - 사용자의 채팅
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const postChat = async (content, chatting) => {
  console.log("전송 데이터",content,chatting);
  try {
    
    const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
      content: content,
      chatting: chatting
    });
    console.log(response.data);
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
