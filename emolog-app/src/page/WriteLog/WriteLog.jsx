import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './WriteLog.css';
import axios from 'axios';


function WriteLog(){
    let month =7;
    let day = 3;
    const navigate = useNavigate(); 
    const maxLength = 1500;
    const [text, setText] = useState('');

    const handleChange = (event) => {
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
        }
    };

    const textStyle = {
        color: text.length >= maxLength ? 'red' : '#666',
    };
   
    
    const handleSubmit = () =>{
        navigate('/chat');
    }

   
   

    return(
        <div class="writelog">
            <div id="logoBox">
                <div id="logo"></div>
            </div>
            <div id="secondBox">
                <div id="date"> {month}월{day}일 일기 작성하기</div>
                <div id="btnBox">
                    <button id="cancel" onClick={() => navigate('/')}>취소</button>
                    <button id="finish"
                            onClick={handleSubmit }
                            
                            type="submit">완료</button>
                </div>

            </div>
            <div id="inputbox">
                <textarea type="text"
                       id = "loginput"
                       maxLength={maxLength}
                       value={text}
                       onChange={handleChange}
                       placeholder="오늘의 일기를 작성해보세요">
                       </textarea>
                   <div id="counter" style={textStyle}> 
                {text.length}/{maxLength}
                </div>
            </div> 
            
                   
            <div id="nevi">
                <button id="home" onClick={() => navigate('/')} ></button>
                <button id="diary" onClick={() => navigate('/write')}></button>
                <button id="my" onClick={() => navigate('/mypage')}></button>
            </div>
        </div>
    );
}

export default WriteLog;