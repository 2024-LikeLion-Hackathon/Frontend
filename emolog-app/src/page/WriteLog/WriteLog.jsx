import React, { useState, useContext, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './WriteLog.css';

import { DiaryContext } from '../../context/DiaryContext';
import { fetchUrl } from "../../api/fetch-url";
import { getDiarySummaries } from "../../api/getDiarySummaries";



function WriteLog() {
    const { updateDiary } = useContext(DiaryContext);
    const navigate = useNavigate(); 
    const location = useLocation();
    const maxLength = 1500;
    const [text, setText] = useState("");
    const initialDate = location.state?.date || new Date().toISOString().split('T')[0];
    const today = new Date(initialDate);
    const date = today.toISOString().split('T')[0];
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const [token, setToken] = useState('');
  

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken)
        }
    }, []);

    const handleChange = (event) => {
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
        }
    };


    const textStyle = {
        color: text.length >= maxLength ? 'red' : '#666',
    };
   

  
    const handleSubmit = () => {
        navigate('/chat', { state: { content: text } });
    
        updateDiary({ date, content:text });
        console.log("Diary Updated:", { date }); // 확인용 로그
        console.log(text);
    
        fetchUrl(text, date, token)
          .then((res) => {
            updateDiary({ url: res.url });
          })
          .catch((error) => {
            console.error('Error in handleSubmit:', error);
          });
      };

    const handleDiaryButtonClick = async () => {
        const todayDate = new Date().toISOString().split('T')[0];
        try {
          const response = await getDiarySummaries(todayDate, token);
          if (response && response.diary && response.diary.date) {
            navigate('/result', { state: { date: todayDate } });
          } else {
            navigate('/write');
          }
        } catch (error) {
          console.error("Error fetching today's diary:", error);
          navigate('/write');
        }
      };
    return (
        <div className="cont">
        <div className="writelog">
            <div id="logoBox">
                <div id="logo"></div>
            </div>
            <div id="secondBox">
                <div id="date">{month}월 {day}일 일기 작성하기</div>
                <div id="btnBox">
                    <button id="cancel" onClick={() => navigate('/')}>취소</button>
                    <button id="finish"
                            onClick={handleSubmit}
                            type="submit">완료</button>
                </div>
            </div>
            <div id="inputbox">
                <textarea type="text"
                          id="loginput"
                          maxLength={maxLength}
                          value={text}
                          onChange={handleChange}
                          placeholder="오늘의 일기를 작성해보세요
                          2줄 이상 작성해야 모디가 읽을 수 있어요 :)">
                </textarea>
                <div id="counter" style={textStyle}> 
                    {text.length}/{maxLength}
                </div>
            </div> 
            <div id="nevi">
                <button id="home" onClick={() => navigate('/')}></button>
                <button id="diary" onClick={handleDiaryButtonClick}></button>
                <button id="my" onClick={() => navigate('/mypage')}></button>
            </div>

           
        </div>
    </div>
    );
}

export default WriteLog;
