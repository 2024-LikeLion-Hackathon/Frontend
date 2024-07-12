import React from 'react';
import NaverLogin from './naver_login';
import KakaoLogin from './kakao_login';
import GoogleLogin from './google_login';
import '../signup.css';

const Signup = () => {
    return (
        <div>
            <img src='./img/emolog_logo.png' alt='logo_img' id='signup_logo'/>
            <br />
            <img src='./img/signup_message.png' alt='signup_message' id='signup_mess'/>
            <div>
                <KakaoLogin />
                <NaverLogin />
                <GoogleLogin />
            </div>
        </div>
    );
};

export default Signup;
