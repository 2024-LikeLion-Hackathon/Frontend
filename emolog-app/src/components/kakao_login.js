import React, { useEffect } from 'react';

const KakaoLogin = () => {
    useEffect(() => {
        // Kakao SDK 초기화
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init('c596db1747e18501bae5782cc0f1caa5');
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
        <div>
            <img
                src="./img/kakao.png"
                alt="Login with Kakao"
                onClick={handleKakaoLogin}
                style={{ cursor: 'pointer' }} // 이미지에 커서 스타일 추가
            />
        </div>
    );
};

export default KakaoLogin;