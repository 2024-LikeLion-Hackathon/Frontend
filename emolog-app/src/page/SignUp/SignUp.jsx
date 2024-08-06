import React from "react";
import KakaoLogin from "./KakaoLogin";
import "./SignUp.css";

const Signup = () => {
  return (
    <div className="SignUp">
      <div className="container">
        <div id="back">
          <div id="logo"></div>
          <div id="sign_message"></div>
          <div id="kakao">
            <KakaoLogin />
          </div>
          <a href="https://emolog.kro.kr/login/oauth2/code/naver"><div id="naver" ></div></a>
          <a href="https://emolog.kro.kr/login/oauth2/code/google"><div id="google"></div></a>
          <div id="copyright"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
