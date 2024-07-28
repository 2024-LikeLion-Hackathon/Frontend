import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

/**
 * 특정 ID의 일기 데이터를 서버로부터 가져오는 함수
 * @param {number} diaryId - 가져올 일기의 ID
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const getDiaryId = async (diaryId) => {
  try {
    const response = await axios.get(`${BASE_URL}/diary/${diaryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching diary data:', error);
    throw error;
  }
};
