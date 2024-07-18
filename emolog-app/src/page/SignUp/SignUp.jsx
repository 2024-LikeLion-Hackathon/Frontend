import React from 'react';
import NaverLogin from './naver_login';
import KakaoLogin from './kakao_login';
import GoogleLogin from './google_login';
import '../signup.css';

const Signup = () => {
    return (
        <div>
            <img src='./assertemolog_logo.png' alt='logo_img' id='signup_logo'/>
            <br />
            <img src='./asset/signup_message.png' alt='signup_message' id='signup_mess'/>
            <div>
                <KakaoLogin />
            </div>
        </div>
    );
};

export default Signup;