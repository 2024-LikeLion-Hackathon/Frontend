import React, { useState, useEffect } from "react";
import { putUser } from "../../api/putUser";
import { useNavigate } from "react-router-dom";
import "./UserForm.css";

const Header = () => {
  return (
    <header>
      <div id="logobox">
        <div id="logo"></div>
      </div>
      <div id="textbox">
        <div id="text">
          <h1>환영해요!</h1>
          <p>원활한 서비스 이용을 위해 몇 가지 정보를 작성해주세요</p>
        </div>
      </div>
    </header>
  );
};

const Form = ({ token }) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");

  const ages = Array.from({ length: 99 }, (_, i) => i + 1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nickname || !age) {
      alert("닉네임과 나이를 모두 입력해주세요.");
      return;
    }

    console.log({ nickname, age }, token);

    // 수정할 데이터 콘솔 출력
    console.log('수정할 데이터:', { nickname, age });

    try {
      await putUser({ nickname, age }, token);
      alert("사용자 정보가 저장되었습니다.");
      navigate('/monthly');
    } catch (error) {
      alert("사용자 정보를 저장하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div id="formbox">
        <div id="nicknamebox">
          <label htmlFor="nickname" id="label_nickname">
            닉네임
          </label>
          <input
            type="text"
            id="nickname"
            placeholder="2~8자, 영문 혹은 한글"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <p id="nickname-message">
            닉네임은 2~8자, 영문 혹은 한글로 작성해주세요
          </p>
        </div>
        <div id="agebox">
          <label htmlFor="age" id="label_age">
            추가 정보
          </label>
          <select
            id="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option value="" id="placehold">
              나이를 선택해주세요
            </option>
            {ages.map((age) => (
              <option key={age} value={age}>
                {age}세
              </option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" onClick={handleSubmit}>확인</button>
    </form>
  );
};

const UserForm = () => {
  const [token, setToken] = useState('');
  
   useEffect(() => {
     // 로컬 스토리지에서 토큰 읽어오기
     const storedToken = localStorage.getItem('token');
     setToken(storedToken);
   }, []);

  return (
    <div className="UserForm">
      <div className="container">
        <div id="back">
          <Header />
          <Form token={token} />
        </div>
      </div>
    </div>
  );
};

export default UserForm;
