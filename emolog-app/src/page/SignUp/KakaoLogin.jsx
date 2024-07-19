import React, { useEffect } from 'react';

const KakaoLogin = () => {
    useEffect(() => {
        // Kakao SDK 초기화
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init('process.env.KAKAO_SECRET');
        }
    }, []);

    const handleKakaoLogin = () => {
        window.Kakao.Auth.login({
            scope: 'profile_nickname',
            success: function(authObj) {
                console.log(authObj);
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: (res) => {
                        const { kakao_account } = res;
                        console.log(kakao_account);
                    },
                    fail: (error) => {
                        console.error('Failed to request Kakao API:', error);
                    }
                });
            },
            fail: (error) => {
                console.error('Kakao login failed:', error);
            }
        });
    };

    return (
        <div className='kakaoIdLogin'>
            <img
                src="./asset/kakao.png"
                alt="Login with Kakao"
                onClick={handleKakaoLogin}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
};

export default KakaoLogin;