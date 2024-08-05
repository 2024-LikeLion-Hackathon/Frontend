import React, { useState, useContext, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './WriteLog.css';
import Modal from 'react-modal';
import { DiaryContext } from '../../context/DiaryContext';
import { fetchUrl } from "../../api/fetch-url";



Modal.setAppElement('#root'); // 접근성 설정

function WriteLog() {
    const { updateDiary } = useContext(DiaryContext);
    const navigate = useNavigate(); 
    const location = useLocation();
    const maxLength = 1500;
    const [text, setText] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const initialDate = location.state?.date || new Date().toISOString().split('T')[0];
    const today = new Date(initialDate);
    const date = today.toISOString().split('T')[0];
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const [token, setToken] = useState('');
  

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken)
        }
    }, []);

    const handleChange = (event) => {
        if (event.target.value.length <= maxLength) {
            setText(event.target.value);
        }
    };


    const textStyle = {
        color: text.length >= maxLength ? 'red' : '#666',
    };
   
    const openModal = () => {
        setModalIsOpen(true);
        setTimeout(() => {
            closeModal();
            navigate('/chat', { state: { content: text }});
        }, 3000); // 3초 후에 페이지 이동
    };
    
    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSubmit = async () => {
        try {
            openModal();
            updateDiary({ date });
            console.log("Diary Updated:", { date }); //확인용 로그
            console.log(text);
        const backres = fetchUrl(text, date, token);
        console.log('백엔드서버응답:',backres);

        } catch (error) {
            console.error('Error in handleSubmit:', error);
        } 
    };

    return (
        <div className="cont">
        <div className="writelog">
            <div id="logoBox">
                <div id="logo"></div>
            </div>
            <div id="secondBox">
                <div id="date">{month}월 {day}일 일기 작성하기</div>
                <div id="btnBox">
                    <button id="cancel" onClick={() => navigate('/')}>취소</button>
                    <button id="finish"
                            onClick={handleSubmit}
                            type="submit">완료</button>
                </div>
            </div>
            <div id="inputbox">
                <textarea type="text"
                          id="loginput"
                          maxLength={maxLength}
                          value={text}
                          onChange={handleChange}
                          placeholder="오늘의 일기를 작성해보세요
                          2줄 이상 작성해야 모디가 읽을 수 있어요 :)">
                </textarea>
                <div id="counter" style={textStyle}> 
                    {text.length}/{maxLength}
                </div>
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
                <div>MoDi가 일기를 읽어보고 있어요</div>
                <div>잠시만 기다려주세요</div>
            </Modal>
        </div>
    </div>
    );
}

export default WriteLog;
