import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postKakaoUser } from '../../api/postKakaoUser'; 
import "./SignUp.css";

const KakaoLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loadKakaoSdk = () => {
      if (!window.Kakao) {
        const script = document.createElement('script');
        script.src = "https://developers.kakao.com/sdk/js/kakao.js";
        script.onload = () => {
          window.Kakao.init(process.env.REACT_APP_KAKAO_SECRET); 
        };
        document.head.appendChild(script);
      } else if (!window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.REACT_APP_KAKAO_SECRET);
      }
    };

    loadKakaoSdk();
  }, []);

  const handleKakaoLogin = async () => {
    if (!window.Kakao) {
      console.error("Kakao SDK가 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.login({
      scope: "profile_nickname,account_email",
      success: async function (authObj) {
        try {
          const response = await window.Kakao.API.request({ url: "/v2/user/me" });
          const kakaoAccount = response.kakao_account;
          console.log(kakaoAccount);

          // 사용자 정보를 서버로 전송
          const result = await postKakaoUser({
            id: response.id,
            connected_at: response.connected_at,
            profile: {
              nickname: kakaoAccount.profile.nickname,
              thumbnail_image_url: kakaoAccount.profile.thumbnail_image_url,
              profile_image_url: kakaoAccount.profile.profile_image_url,
              is_default_image: kakaoAccount.profile.is_default_image
            },
            email: kakaoAccount.email,
            is_email_valid: kakaoAccount.is_email_valid,
            is_email_verified: kakaoAccount.is_email_verified
          }, authObj.access_token);

          console.log('사용자 데이터가 서버에 성공적으로 전송되었습니다.');
          console.log('서버 응답:', result);

          if (result.accessToken) {
            // 응답에 토큰이 있는 경우 저장
            console.log('토큰:', result.accessToken);
            localStorage.setItem('token', result.accessToken);
          } else {
            console.error('서버 응답에 토큰이 없습니다.');
          }
            if(!result.new){ navigate('/');}
            else{navigate('/userform');}
          
         
        } catch (error) {
          console.error('카카오 사용자 데이터를 가져오거나 서버에 전송하는 중 오류가 발생했습니다:', error);
        }
      },
      fail: (error) => {
        console.error("카카오 로그인 실패:", error);
      },
    });
  };

  return (
    <div className="kakaoIdLogin">
      <button onClick={handleKakaoLogin}>
      </button>
    </div>
  );
};

export default KakaoLogin;
