import React, { useEffect } from 'react';

const NaverLogin = () => {
    useEffect(() => {
        const initNaverLogin = () => {
            const naver_id_login = new window.naver.LoginWithNaverId({
                clientId: 'P6SQEjotRA1VH3IMpOGO',
                callbackUrl: 'http://localhost:3000/naver-callback',
                isPopup: true,
                loginButton: { color: 'green', type: 3, height: 60 }
            });
            naver_id_login.init();
        };

        if (!window.naver) {
            const script = document.createElement('script');
            script.src = 'https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js';
            script.type = 'text/javascript';
            script.charset = 'utf-8';
            script.onload = initNaverLogin;
            document.head.appendChild(script);
        } else {
            initNaverLogin();
        }
    }, []);

    return (
        <div id="naverIdLogin">
            <img
                src="./img/naver.png"
                alt="Login with naver"
                onClick={NaverLogin}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
};

export default NaverLogin;
