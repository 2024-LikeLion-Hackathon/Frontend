import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const NaverCallback = () => {
    const history = useHistory();

    useEffect(() => {
        if (window.opener) {
            window.opener.location.href = "/naver-callback";
            window.close();
        } else {
            const naver_id_login = new window.naver.LoginWithNaverId({
                clientId: 'P6SQEjotRA1VH3IMpOGO',
                callbackUrl: 'http://localhost:3000/naver-callback'
            });

            naver_id_login.getLoginStatus(status => {
                if (status) {
                    console.log('Access Token:', naver_id_login.oauthParams.access_token);
                    naver_id_login.get_naver_userprofile('naverSignInCallback()');
                } else {
                    console.log('Failed to get login status');
                }
            });

            window.naverSignInCallback = function () {
                console.log('Email:', naver_id_login.getProfileData('email'));
                console.log('Nickname:', naver_id_login.getProfileData('nickname'));
                history.push('/'); // Redirect to the desired page after login
            };
        }
    }, [history]);

    return (
        <div>
            <h1>Processing Naver Login...</h1>
        </div>
    );
};

export default NaverCallback;
