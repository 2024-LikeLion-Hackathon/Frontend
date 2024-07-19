import React from 'react';
import KakaoLogin from './KakaoLogin';
import './SignUp.css';

const Signup = () => {
    return (
        <div>
            <img src='./asset/emolog_logo.png' alt='logo_img' id='signup_logo'/>
            <br />
            <img src='./asset/signup_message.png' alt='signup_message' id='signup_mess'/>
            <div>
                <KakaoLogin />
            </div>
        </div>
    );
};

export default Signup;