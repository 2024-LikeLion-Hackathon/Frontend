import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KakaoLogin from "./KakaoLogin";
import "./SignUp.css";

const Signup = () => {
  const navigate = useNavigate();
  const [isNew, setIsNew] = useState(null);

  useEffect(() => {

    const checkIsNew = () => {
      const isNewUser = localStorage.getItem("isNew") === "true";
      setIsNew(isNewUser);
    };

    checkIsNew();
  }, []);

  useEffect(() => {
 
    if (isNew !== null) {
      if (isNew) {
        navigate("/userform");
      } else {
        navigate("/monthly");
      }
    }
  }, [isNew, navigate]);

  return (
    <div className="SignUp">
      <div className="container">
        <div id="back">
          <div id="logo"></div>
          <div id="sign_message"></div>
          <div id="kakao">
            <KakaoLogin  />
          </div>
          <a href="https://emolog.kro.kr/login/oauth2/code/naver">
            <div id="naver" onClick={Signup}></div>
          </a>
          <a href="https://emolog.kro.kr/login/oauth2/code/google">
            <div id="google" onClick={Signup}></div>
          </a>
          <div id="copyright"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
