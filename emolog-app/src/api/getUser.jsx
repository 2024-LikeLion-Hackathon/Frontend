import axios from 'axios';

<<<<<<< HEAD
const BASE_URL = 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com/' || 'localhost:3000';

=======
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com'; // 기본 URL 설정
>>>>>>> 3c224261b6d475f7015df867e0f0d61f7a27891c
/**
 * 사용자 정보를 가져오는 함수
 * @returns {Promise<Object>} 사용자 정보
 * @param {string} accessToken
 */
<<<<<<< HEAD
export const getUser = async (accessToken) => {
  const response = await axios.get(`${BASE_URL}/api/user`, {
    headers: {
      'Authorization': `Bearer ${accessToken}` // 인증 헤더에 임시 토큰 추가
    }
  });
  try {
    const response = await axios.get(`${BASE_URL}api/user`);
=======
export const getUser = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);
>>>>>>> 3c224261b6d475f7015df867e0f0d61f7a27891c
    return response.data;
  } catch (error) {
    if (error.response) {
      // 서버에서 응답을 받았지만 상태 코드가 2xx 범위에 있지 않을 경우
      const { status, data } = error.response;
      console.error(`Error fetching user data. Status: ${status}, Data: ${JSON.stringify(data)}`);
    } else if (error.request) {
      // 요청이 이루어졌으나 응답을 받지 못함
      console.error('No response received from the server.');
    } else {
      // 요청을 설정하는 중에 오류가 발생함
      console.error('Error setting up the request:', error.message);
    }
    throw error;
  }
};
