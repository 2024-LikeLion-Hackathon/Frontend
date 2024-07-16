import React from "react";
import './WriteLog.css';

function WriteLog(){
    
    return(
        <div id="writelog">
            <div id="logoBox">
                <div id="logo"></div>
            </div>
            <div id="secondBox">
                <div id="date"></div>
                <div id="btnBox">
                    <button id="cancel"></button>
                    <button id="finish"
                            type="submit"></button>
                </div>

            </div>
            <div id="inputbox">
                <input type="text"></input>
            </div>
        </div>
    );
}

export default WriteLog;