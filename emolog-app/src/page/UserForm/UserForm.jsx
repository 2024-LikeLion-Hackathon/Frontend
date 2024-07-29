import React, { useState, useEffect } from "react";
import { getUser } from "../../api/getUser"; 
import { postUser } from "../../api/postUser";
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

const Form = ({ userId }) => {
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");

  const ages = Array.from({ length: 99 }, (_, i) => i + 1);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!nickname || !age) {
      alert("닉네임과 나이를 모두 입력해주세요.");
      return;
    }
    try {
      await postUser(userId, { nickname, age });
      alert("사용자 정보가 저장되었습니다.");
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
      <button type="submit">확인</button>
    </form>
  );
};

const UserForm = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUserId(userData.id); // 서버에서 유저 ID를 가져오는 것으로 가정
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="UserForm">
      <div className="container">
        <div id="back">
          <Header />
          {userId ? <Form userId={userId} /> : <p>Loading...</p>}
        </div>
      </div>
    </div>
  );
};

export default UserForm;
