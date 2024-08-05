import React, { useEffect, useState } from "react";
import './Mypage.css';
import {  useNavigate } from "react-router-dom";
import { getMypage } from '../../api/getMypage';
import { postLogout } from "../../api/postLogout";
import { getDiarySummaries } from "../../api/getDiarySummaries";

function Mypage() {
    const navigate = useNavigate();  

    const [data, setData] = useState({
        nickname: "",
        diaryCount: 0,
        colorCount: 0
    });
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 로컬 스토리지에서 토큰 읽어오기
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        } else {
            setError('No token found');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!token) return; // 토큰이 없으면 데이터를 가져오지 않음

        // 마이페이지 정보를 가져오는 함수 호출
        const fetchMypageData = async () => {
            try {
                setLoading(true);
                const mypageData = await getMypage(token);
                setData(mypageData);
            } catch (error) {
                console.error('Error fetching mypage data:', error);
                setError('Error fetching mypage data');
            } finally {
                setLoading(false);
            }
        };

        fetchMypageData();
    }, [token]);

    const logoutHandler = async (token) => {
        try {
            postLogout(token);
            localStorage.removeItem('token');
            navigate('/signup');
            console.log('로그아웃 성공!');
            
        } catch (error) {
            console.error('Error fetching emotions:', error);
        }
    };
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    const handleDiaryButtonClick = async () => {
        const todayDate = new Date().toISOString().split('T')[0];
        try {
          const response = await getDiarySummaries(todayDate, token);
          if (response && response.diary && response.diary.date) {
            navigate('/result', { state: { date: todayDate } });
          } else {
            navigate('/write');
          }
        } catch (error) {
          console.error("Error fetching today's diary:", error);
          navigate('/write');
        }
      };
    return (
        <div className="Mypage">
            <div id="logoBox">
                <div id="logo"></div>
            </div>
            <div id="welcome">{data.nickname}님 반가워요!</div>
            <div id="secondBox">
                <div className="btnCont" id="d_count">
                    <div className="info">이번 달 쓴 일기</div>
                    <div id="d_img"></div>
                    <div className="count">{data.diaryCount}회</div>
                </div>
                <div className="btnCont" id="c_count">
                    <div className="info">내 감정 팔레트는</div>
                    <div id="c_img"></div>
                    <div className="count">{data.colorCount}회</div>
                </div>
                <button className="btnCont" id="goWrite" onClick={() => navigate('/write')}></button>
            </div>
            <div id="thirdBox">
                <button className="longBtn" id="modify" onClick={() => navigate('/modify')}><div id="modify.t">내 정보 수정하기</div><div id="a"></div></button>
                <button className="longBtn" id="logout" onClick={()=> logoutHandler(token)}>로그아웃</button>
            </div>
            <div id="copyR"></div>
            <div id="nevi">
                <button id="home" onClick={() => navigate('/')} ></button>
                <button id="diary" onClick={handleDiaryButtonClick}></button>
                <button id="my" onClick={() => navigate('/mypage')}></button>
            </div>
        </div>
    );
}

export default Mypage;
