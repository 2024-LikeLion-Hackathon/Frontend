import React, { useState } from "react";
import './Chat.css';
import axios from "axios";
import Message from './Message'; // Message 컴포넌트를 가져옵니다.

const MessageList = ({ messages }) => {
  return (
    <div className='messages' style={{ overflowY: 'scroll', maxHeight: '450px' }}>
      {messages.map((message, i) => (
        <Message
          key={i}
          text={message.text}
          time={new Date(message.time).toLocaleTimeString()}
        />
      ))}
    </div>
  );
};

const MessageForm = ({ onMessageSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = {
      text: text,
      time: new Date().toISOString()
    };
    onMessageSubmit(message);
    setText('');
  };

  return (
    <div className='message_form'>
      <form id='messageinput' onSubmit={handleSubmit}>
        <input
          placeholder='메시지 입력'
          className='textinput'
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <h3></h3>
      </form>
    </div>
  );
};

function Chat() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState('');
  const [roomName, setRoomName] = useState('');
  const [users, setUsers] = useState([]);

  const initialize = (data) => {
    const { users, name, roomname } = data;
    setUsers(users);
    setUser(name);
    setRoomName(roomname);
  };

  const messageRecieve = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleMessageSubmit = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);

    // 서버에 메시지 전송
    axios.post(`/api/chatroom/${roomName}/message`, { text: message.text, roomName: roomName, user: user })
      .then(response => {
        console.log('Message sent successfully');
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  let month = 7;
  let day = 3;

  return (
    <div className="chat">
      <div id="logoBox">
        <div id="logo"></div>
      </div>
      <div id="secondBox">
        <div id="date">{month}월 {day}일의 대화</div>
        <div id="btnBox">
          <button id="emobtn">감정 선택하러 가기</button>
        </div>
      </div>
      <div id="inputbox">
        <div id="chatbox">
          <MessageList messages={messages} />
          <MessageForm onMessageSubmit={handleMessageSubmit} />
        </div>
     </div>
        <div>
        <button id="home"></button>
        <button id="diary"></button>
        <button id="my"></button>
     </div>
    </div>
  );
}

export default Chat;
