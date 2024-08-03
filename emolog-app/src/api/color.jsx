import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://emolog-server.ap-northeast-2.elasticbeanstalk.com';


export const fetchColorData = async (month, week) => {
    try {
      const response = await axios.get(`/api/color?month={month}&week={week}`, {
        params: { month, week },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching color data:", error);
      throw error;
    }
  };