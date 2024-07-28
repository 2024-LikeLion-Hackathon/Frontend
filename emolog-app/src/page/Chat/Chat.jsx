import React, { useState } from "react";
import './Chat.css';
import axios from "axios";
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";



function Chat() {
  const Message = ({id,text,sender}) => {
        
    const isOwnMessage = sender === 'ai';
    const messageClass = isOwnMessage ? 'message-right' : 'message-left';
  
    return (
        <div className={messageClass}> {isOwnMessage && <div className="modi"/>}
      <div id={id} className={`message_${messageClass}`}>
        
        <div className="message-text">{text}</div>
      </div>
      </div>
    );
  };

  const MessageList = ({ messages }) => {
    return (
      <div className='messages' style={{ overflowY: 'scroll', maxHeight: '660px' }}>
        {messages.map((message, i) => (
          <Message
            key={i}
            sender={message.sender}
            text={message.text}
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
        sender: 'user'
      };
      onMessageSubmit(message);
      setText('');
    };

    return (
      <div className='message_form'>
        <form id='messageinput' onSubmit={handleSubmit}>
          <input
            placeholder='텍스트를 입력하세요'
            className='textinput'
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <button id='submitbtn' type='submit'/>
        </form>
      </div>
    );
  };

  const data= {
    date: "2024-07-21",
    q_a: [
      {id: 1, sender: 'ai', text: '텍스트텍스트텍스트텍스트텍ㅇ트'},
      {id: 2, sender: 'user', text: '텍스트텍스트텍스트텍스트텍스트'},
      {id: 3, sender: 'ai', text: '텍스트텍스트텍스트텍스트텍ㅇ트텍스트텍스트텟그트'},
      {id: 4, sender: 'ai', text: '텍스트'},
  ]
  };
  const navigate = useNavigate(); 
  const [messages, setMessages] = useState([]);
  const [sender, setSender] = useState('user');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleMessageSubmit = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);

    // 서버에 메시지 전송
    axios.post(`/api/chatroom/message`, { text: message.text, sender: 'user' })
      .then(response => {
        console.log('Message sent successfully');
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };
  const date = parseISO(data.date);
  const month = format(date, 'M', { locale: ko });
  const day = format(date, 'd', { locale: ko });

  const openModal = () => {
    setModalIsOpen(true);
    setTimeout(() => {
        closeModal();
        navigate('/select');
    }, 3000); // 2초 후에 페이지 이동
};

const closeModal = () => {
    setModalIsOpen(false);
};

const handleSubmit = () => {
    openModal();
};


  return (
    <div className="chat">
      <div id="logoBox">
        <div id="logo"></div>
      </div>
      <div id="secondBox">
        <div id="date">{month}월 {day}일의 대화</div>
        <div id="btnBox">
          <button id="emobtn" onClick={handleSubmit}></button>
        </div>
      </div>
      <div id="inputbox">
        <div id="chatbox">
          <MessageList messages={messages} />
          <MessageForm onMessageSubmit={handleMessageSubmit} />
         
        </div>
     </div>
        <div id="nevi">
          <button id="home" onClick={() => navigate('/')} ></button>
          <button id="diary" onClick={() => navigate('/write')}></button>
          <button id="my" onClick={() => navigate('/mypage')}></button>
     </div>

     
     <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Pop up Message"
                ariaHideApp={false}
                className="modal"
                overlayClassName="overlay"
            >
                <img src="load1.gif" alt="Submitting" />
                <div>MoDi가 오늘의 감정을 고르고있어요</div>
                <div>잠시만 기다려주세요</div>
        </Modal>
    </div>
  );
}

export default Chat;
