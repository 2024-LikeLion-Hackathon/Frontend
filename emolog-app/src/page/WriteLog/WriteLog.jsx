import React from "react";
import './WriteLog.css';

function WriteLog(){
    let month =7;
    let day = 3;
    
    return(
        <div id="writelog">
            <div id="logoBox">
                <div id="logo"></div>
            </div>
            <div id="secondBox">
                <div id="date"> {month}월{day}일 일기 작성하기</div>
                <div id="btnBox">
                    <button id="cancel">취소</button>
                    <button id="finish"
                            type="submit">완료</button>
                </div>

            </div>
            <div id="inputbox">
                <textarea type="text"
                       id = "loginput"
                       placeholder="오늘의 일기를 작성해보세요"></textarea>
            </div>
        </div>
    );
}

export default WriteLog;