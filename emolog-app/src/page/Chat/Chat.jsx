import React, { useState, useContext, useEffect, useRef } from "react";
import './Chat.css';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import Modal from 'react-modal';
import { useNavigate,useLocation} from "react-router-dom";
import { DiaryContext } from '../../context/DiaryContext';
import { postChat } from '../../api/postChat';

function Chat() {
  const { diary, updateDiary } = useContext(DiaryContext);
  const navigate = useNavigate(); 
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const content =location.state.content;
  

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const initializeChat = async () => {
    try {
      console.log('1',content);
      const initialResponse = await postChat(content, "");
      if (initialResponse) {
        const aiMessage = {
          text: initialResponse.chat,
          sender: 'ai'
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        await updateDiaryWithAIMessage(initialResponse.chat);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  useEffect(() => {
    if (!isInitialized) {
      initializeChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized,content, ""]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // This effect runs whenever `diary` changes
    console.log("Diary state updated:", diary);
  }, [diary]);

  const updateDiaryWithUserMessage = async (message) => {
    const currentAnswers = diary.q_a?.answer || "";
    const newAnswers = currentAnswers
      ? `${currentAnswers}/ ${message}`
      : message;
      
    await updateDiary({
      ...diary,
      q_a: {
        answer: newAnswers
      }
    });
    console.log("Diary Updated with User Message:", { q_a: { answer: newAnswers } });
  };

  const updateDiaryWithAIMessage = async (message) => {
    const currentQuestions = diary.q_a?.question || "";
    const newQuestions = currentQuestions
      ? `${currentQuestions}/ ${message}`
      : message;
      
    await updateDiary({
      ...diary,
      q_a: {
        question: newQuestions
      }
    });
    console.log("Diary Updated with AI Message:", { q_a: { question: newQuestions } });
  };

  const Message = ({ id, text, sender }) => {
    const isOwnMessage = sender === 'ai';
    const messageClass = isOwnMessage ? 'message-right' : 'message-left';
    return (
      <div className={messageClass}>
        {isOwnMessage && <div className="modi" />}
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
        <div ref={messagesEndRef} />
      </div>
    );
  };

  const MessageForm = ({ onMessageSubmit }) => {
    const [text, setText] = useState("");

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
          <button id='submitbtn' type='submit' />
        </form>
      </div>
    );
  };

  const handleMessageSubmit = async (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);

    if (message.sender === 'user') {
      await updateDiaryWithUserMessage(message.text);
    }

    try {
      const response = await postChat(content, message.text);
      
      if (response) {
        const aiMessage = {
          text: response.chat,
          sender: 'ai'
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        await updateDiaryWithAIMessage(response.chat);
        if (response.endpoint === "True") {
          setIsChatEnded(true);
          console.log("Chatting session ended");
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const date = parseISO(diary.date);
  const month = isNaN(date) ? '' : format(date, 'M', { locale: ko });
  const day = isNaN(date) ? '' : format(date, 'd', { locale: ko });

  const openModal = () => {
    setModalIsOpen(true);
    setTimeout(() => {
      closeModal();
      navigate('/select',{ state: { content: content }});
    }, 3000); // 3초 후에 페이지 이동
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
          <button id="emobtn" 
          className={isChatEnded ? 'emotion_selected' : 'emotion_default'} 
          onClick={handleSubmit}
         >

          </button>
        </div>
      </div>
      <div id="inputbox">
        <div id="chatbox">
          <MessageList messages={messages} />
        </div> 
        <MessageForm onMessageSubmit={handleMessageSubmit} />
      </div>
      <div id="nevi">
        <button id="home" onClick={() => navigate('/')}></button>
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
        <div>MoDi가 오늘의 감정을 고르고 있어요</div>
        <div>잠시만 기다려주세요</div>
      </Modal>
    </div>
  );
}

export default Chat;
