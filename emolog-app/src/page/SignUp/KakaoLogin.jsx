import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { postKakaoUser } from '../../api/postKakaoUser'; 
import "./SignUp.css";

const KakaoLogin = () => {
  const navigate = useNavigate(); // Use the hook to get the navigate function

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
      console.error("Kakao SDK is not loaded.");
      return;
    }

    window.Kakao.Auth.login({
      scope: "profile_nickname",
      success: async function (authObj) {
        try {
          const response = await window.Kakao.API.request({ url: "/v2/user/me" });
          const { kakao_account } = response;
          console.log(kakao_account);

          // 사용자 정보를 서버로 전송
          await postKakaoUser(
            kakao_account.email || '',
            kakao_account.profile.nickname || '',
            authObj.access_token
          );
          console.log('User data successfully posted to server');

          // Navigate to /userform on successful login
          navigate('/userform');
        } catch (error) {
          console.error('Error fetching Kakao user data or posting to server:', error);
        }
      },
      fail: (error) => {
        console.error("Kakao login failed:", error);
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
