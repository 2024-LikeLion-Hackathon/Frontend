import React from "react";
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

const Form = () => {
  const ages = Array.from({ length: 99 }, (_, i) => i + 1);

  return (
    <form>
      <div id="formbox">
        <div id="nicknamebox">
          <label htmlFor="nickname" id="label_nickname">
            닉네임
          </label>
          <input
            type="text"
            id="nickname"
            placeholder="2~8자, 영문 혹은 한글"
          />
          <p id="nickname-message">
            닉네임은 2~8자, 영문 혹은 한글로 작성해주세요
          </p>
        </div>
        <div id="agebox">
          <label htmlFor="age" id="label_age">
            추가 정보
          </label>
          <select id="age">
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

const Userform = () => {
  return (
    <div className="container">
      <div id="back">
        <Header />
        <Form />
      </div>
    </div>
  );
};

export default Userform;
