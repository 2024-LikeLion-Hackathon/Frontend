import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000/';


const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

/**
 * 새로운 accessToken을 발급받기 위해 refreshToken을 서버에 요청하는 함수
 * @param {String} token - 사용자 refreshToken
 * @returns {Promise<Object>} 새로운 accessToken 데이터
 */
export const refreshToken = async (token) => {
    try {
        const response = await axios.post('/api/token', {
            refreshToken: getCookie('refresh_token'),
        }, {
            headers: {
               'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
    
        if (response.status === 200) {
      const result = response.data;
      // 재발급이 성공하면 로컬 스토리지값을 새로운 액세스 토큰으로 교체
      localStorage.setItem('access_token', result.accessToken);
      console.log(result.accessToken);
      return result.accessToken;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
    }
    
};