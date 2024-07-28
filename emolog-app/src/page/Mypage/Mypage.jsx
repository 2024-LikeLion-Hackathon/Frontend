import React from "react";
import './Mypage.css';
import { Navigate, useNavigate } from "react-router-dom";

function Mypage(){
    const navigate = useNavigate(); 

    const data={
        nickname: "프로도",
        diaryCount: 0,
        colorCount: 0
    }

    return(
        <div className="Mypage">
        <div id="logoBox">
            <div id="logo"></div>
        </div>
        <div id="welcome">{data.nickname}님 반가워요!</div>
        <div id="secondBox">
           <div className="btnCont" id="d_count">
                <div className="info">이번 달 쓴 일기</div>
                <div id="d_img"></div>
                <div className="count">{data.diaryCount}회</div>
           </div>
           <div className="btnCont" id="c_count">
                <div className="info">내 감정 팔레트는</div>
                <div id="c_img"></div>
                <div className="count">{data.colorCount}회</div>
           </div>
           <button className="btnCont" id="goWrite" onClick={()=> navigate('/write')}></button>
        </div>
        <div id="thirdBox">
            <button className="longBtn" id="modify" onClick={() => navigate('/modify')}><div id="modify.t">내 정보 수정하기</div><div id="a"></div></button>
            <button className="longBtn" id="logout">로그아웃</button>
        </div>
        <div id="copyR">

        </div>

       
        <div id="nevi">
        <button id="home" onClick={() => navigate('/')} ></button>
            <button id="diary" onClick={() => navigate('/write')}></button>
            <button id="my" onClick={() => navigate('/mypage')}></button>
        </div>
    </div>
    );
}

export default Mypage;