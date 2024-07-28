import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || '';

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
    if (error.response) {
      // 서버에서 응답을 받았지만 상태 코드가 2xx 범위에 있지 않을 경우
      const { status, data } = error.response;
      switch (status) {
        case 400:
          if (data.error === 'User-101') {
            console.error('이미 존재하는 회원입니다.');
          } else if (data.error === 'User-103' || data.error === 'Token-102') {
            console.error('잘못된 요청입니다. 요청 형식을 확인해주세요.');
          }
          break;
        case 401:
          if (data.error === 'Token-100' || data.error === 'Token-103') {
            console.error('토큰이 유효하지 않습니다.');
          } else if (data.error === 'Token-101') {
            console.error('토큰이 만료되었습니다.');
          }
          break;
        case 403:
          if (data.error === 'User-102') {
            console.error('접근 권한이 없습니다.');
          }
          break;
        case 404:
          if (data.error === 'User-100' || data.error === 'Token-105') {
            console.error('존재하지 않는 회원 또는 토큰입니다.');
          }
          break;
        default:
          console.error('알 수 없는 오류가 발생했습니다.');
      }
    } else if (error.request) {
      // 요청이 이루어졌으나 응답을 받지 못함
      console.error('서버로부터 응답을 받지 못했습니다. 네트워크를 확인해주세요.');
    } else {
      // 요청을 설정하는 중에 오류가 발생함
      console.error('요청 설정 중 오류가 발생했습니다:', error.message);
    }
    throw error;
  }
};
