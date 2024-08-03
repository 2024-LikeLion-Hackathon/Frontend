import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com';


export const fetchAllDiarySummaries = async (token) => {
    // 예시로 월의 모든 다이어리 항목을 가져오는 API 호출
    const response = await axios.get("/api/diaries", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  };
  