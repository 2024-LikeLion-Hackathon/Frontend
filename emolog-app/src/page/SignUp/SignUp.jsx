import React from "react";
import KakaoLogin from "./KakaoLogin";
import "./SignUp.css";

const Signup = () => {

  const naverUrl = "https://emolog.kro.kr/login/oauth2/code/naver";
  const googleUrl = "https://emolog.kro.kr/login/oauth2/code/google"
  
  return (
    <div className="SignUp">
      <div className="container">
        <div id="back">
          <div id="logo"></div>
          <div id="sign_message"></div>
          <div id="kakao">
            <KakaoLogin />
          </div>
          <button id="naver" onClick={window.location.replace(naverUrl)}></button>
         <button id="google" onClick={window.location.replace(googleUrl)}></button>
          <div id="copyright"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
