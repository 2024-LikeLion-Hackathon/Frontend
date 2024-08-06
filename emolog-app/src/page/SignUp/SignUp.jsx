import React from "react";
import KakaoLogin from "./KakaoLogin";
import "./SignUp.css";

const Naver = () => {
  const NaverLogin = () => {
    window.location.href = "https://emolog.kro.kr/oauth2/authorization/naver";
  };

  return <button id="naver" onClick={NaverLogin}></button>;
};


const Google = () => {

  const handleLogin = () => {
    window.location.href = "https://emolog.kro.kr/oauth2/authorization/google";
  
  };

  return <button id="google"onClick={handleLogin}></button>;
}

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
          <div>
            <Naver />
          </div>
          <div >
            <Google />
          </div>
          <div id="copyright"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
