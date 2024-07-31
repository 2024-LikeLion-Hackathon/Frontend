import React, { useEffect, useState } from "react";
import './Modify.css';
import { Navigate, useNavigate } from "react-router-dom";
import { getUser } from '../../api/getUser'; // getUser 함수 import
import { putUser } from "../../api/putUser";

function Modify() {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("");
    const [age, setAge] = useState("");
    const [token, setToken] = useState('');

    const ages = Array.from({ length: 99 }, (_, i) => i + 1);

    useEffect(() => {
      // 로컬 스토리지에서 토큰 읽어오기
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
          setToken(storedToken);
          console.log(storedToken);
      }
  }, []);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUser(token);
                setNickname(
                   data.nickname);
                setAge(data.age);
         
            } catch (err) {
                console.error('Error fetching user data:', err);
               
            }
        };

        fetchUserData();
    }, []);


    const handleSubmit =async (event) => {
      event.preventDefault();
        
      try {
        await putUser({ nickname, age }, token);
       alert("사용자 정보가 저장되었습니다.");
        navigate('/');
      } catch (error) {
      alert("사용자 정보를 저장하는 중 오류가 발생했습니다.");
    }
    };

    return (
        <div className="modify">
            <div id="logoBox">
                <div id="logo"></div>
            </div>
            <div id="container">
                <div id="secondBox">
                    <button id="titlebtn" onClick={() => navigate('/mypage')}>
                        <div id="go_icon"></div>
                        <div id="title">내 정보 수정하기</div>
                    </button>
                    <div id="info">닉네임 혹은 사용자 나이를 변경할 수 있어요</div>

                    <form onSubmit={handleSubmit}>
                        <div id="formbox">
                            <div id="nicknamebox">
                                <label htmlFor="nickname" id="label_nickname">
                                    닉네임 변경하기
                                </label>
                                <input
                                    type="text"
                                    id="nickname"
                                    value={nickname}
                                    onChange={(e) => setNickname( e.target.value )}
                                    placeholder="닉네임"
                                />
                                <p id="nickname-message">
                                    닉네임은 2~8자, 영문 혹은 한글로 작성해주세요
                                </p>
                            </div>

                            <div id="agebox">
                                <label htmlFor="age" id="label_age">
                                    나이 변경하기
                                </label>
                                <select
                                    id="age"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value, 10)}
                                >
                                    <option value="" disabled hidden>나이 선택</option>
                                    {ages.map((age) => (
                                        <option key={age} value={age}>
                                            {age}세
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button type="submit">확인</button>
                    </form>
                </div>
                <div id="copyR"> </div>
            </div>
        </div>
    );
}

export default Modify;
