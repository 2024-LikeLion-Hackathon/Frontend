import React from 'react';
import './userform.css';

const Header = () => {
  return (
    <header>
      <img src='./img/emolog_logo.png' alt='logo_img'/>
      <h1>환영해요!</h1>
      <p>원활한 서비스 이용을 위해 몇 가지 정보를 작성해주세요</p>
    </header>
  );
};

const Form = () => {
    const ages = Array.from({ length: 99 }, (_, i) => i + 1);
  
    return (
      <form>
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input type="text" id="nickname" placeholder="2~8자, 영문 혹은 한글" />
          <p className="error-message">닉네임은 2~8자, 영문 혹은 한글로 작성해주세요</p>
        </div>
        <div className="form-group">
          <label htmlFor="age">추가 정보</label>
          <select id="age">
            <option value="">나이를 선택해주세요</option>
            {ages.map(age => (
              <option key={age} value={age}>{age}세</option>
            ))}
          </select>
        </div>
        <button type="submit">확인</button>
      </form>
    );
  };

const Footer = () => {
  return (
    <footer>
      <p>Copyright 2024. 감정마스터. All rights reserved</p>
    </footer>
  );
};

const Userform = () => {
  return (
    <div className="container">
      <Header />
      <Form />
      <Footer />
    </div>
  );
};

export default Userform;