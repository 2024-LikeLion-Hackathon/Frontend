import React from "react";
import './Modify.css';
import { Navigate, useNavigate } from "react-router-dom";

function Modify(){
    const navigate = useNavigate(); 
    
    const data={
        nickname : "춘식",
        age : 7
    }

    const ages = Array.from({ length: 99 }, (_, i) => i + 1);

    return(
        <div className="modify">
        <div id="logoBox">
            <div id="logo"></div>
        </div>
        <div id="container">
        <div id="secondBox">
            <button id="titlebtn" onClick={() => navigate('/mypage')}>
                <div id="go_icon"></div>
                <div id="title">내 정보 수정하기</div>
            </button>
            <div id="info">닉네임 혹은 사용자 나이를 변경할 수 있어요</div>
     
        <form>
      <div id="formbox">
        
        <div id="nicknamebox">
          <label htmlFor="nickname" id="label_nickname">
            닉네임 변경하기
          </label>
          <input
            type="text"
            id="nickname"
            placeholder={data.nickname}
          />
          <p id="nickname-message">
            닉네임은 2~8자, 영문 혹은 한글로 작성해주세요
          </p>
        </div>
        
        <div id="agebox">
          <label htmlFor="age" id="label_age">
            나이 변경하기
          </label>
          <select id="age" >
          <option id="placeholder" value="" selected disabled hidden>{data.age}세</option>
            {ages.map((age) => (
              <option key={age} value={age}>
                {age}세
              </option>
            ))}
          </select>
        </div>
      
      </div>
      <button type="submit">확인</button>
    </form>
        </div>
        <div id="copyR"> </div>
        </div>
    </div>
    );
}

export default Modify;