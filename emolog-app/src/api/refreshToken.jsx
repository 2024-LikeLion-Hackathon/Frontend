import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000/';

/**
 * 쿠키에서 값을 가져오는 유틸리티 함수
 * @param {string} name - 쿠키 이름
 * @returns {string} 쿠키 값
 */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null; // 쿠키가 존재하지 않으면 null 반환
}


/**
 * 새로운 accessToken을 발급받기 위해 refreshToken을 서버에 요청하는 함수
 * @param {String} token - 사용자 refreshToken
 * @returns {Promise<string>} 새로운 accessToken
 */
export const refreshToken = async (token) => {
  try {
    const refreshToken = getCookie('refresh_token');
    console.log(refreshToken);
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const response = await axios.delete(`${BASE_URL}/api/refresh-token`, {
      data: {
        refreshToken
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const result = response.data;
      // 재발급이 성공하면 로컬 스토리지 값을 새로운 액세스 토큰으로 교체
      localStorage.setItem('access_token', result.accessToken);
      console.log('새 토큰', result.accessToken);
      return result.accessToken;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};
