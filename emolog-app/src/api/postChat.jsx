import axios from 'axios';

const BASE_URL = 'http://43.202.44.75:8000'; // 수정된 BASE_URL

/**
 * 감정 데이터를 가져오는 함수
 * @param {string} id - 일기 ID
 * @param {string} chatting - 사용자의 채팅
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const postContent = async (id, chatting) => {
  try {
    console.log("전송 데이터",id,chatting);
    const response = await axios.post(`${BASE_URL}/api/ai/chat`, {
      diary_id: id,
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
