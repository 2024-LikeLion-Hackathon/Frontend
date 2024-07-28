import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

/**
 * 카카오 사용자 정보를 서버로 전송하는 함수
 * @param {string} email - 사용자의 이메일
 * @param {string} name - 사용자의 이름
 * @param {string} accessToken - 사용자에게 발급된 액세스 토큰
 * @returns {Promise<Object>} 서버 응답 데이터
 */
export const postKakaoUser = async (email, name, accessToken) => {
  try {
    const response = await axios.post(`${BASE_URL}/kakao-user`, {
      email,
      name,
      accessToken
    });
    return response.data;
  } catch (error) {
    console.error('Error posting Kakao user data:', error);
    throw error;
  }
};
