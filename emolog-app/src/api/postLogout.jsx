import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL //||'https://emolog.kro.kr';

export const postLogout = async (token) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/api/logout`,
            {}, // POST 요청의 바디 (여기서는 빈 객체)
            {
                headers: {
                    'Authorization': `Bearer ${token}` // 인증 헤더에 토큰 추가
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
};
