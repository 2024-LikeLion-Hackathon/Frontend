import React, { useState, useEffect, useContext } from "react";
import './Select.css';
import { useNavigate, useLocation } from "react-router-dom";
import Modal from 'react-modal';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DiaryContext } from '../../context/DiaryContext';
import { postDiary } from "../../api/postDiary";
import { postContent } from "../../api/postContent";
import { getDiarySummaries } from "../../api/getDiarySummaries";

function Select() {
    const navigate = useNavigate(); 
    const location = useLocation();
    const { diary, updateDiary } = useContext(DiaryContext);
    const [emotions, setEmotions] = useState([]);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modal1IsOpen, setModal1IsOpen] = useState(false);
    const [token, setToken] = useState('');
    const content = location.state.content;
   
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken)
        }
    }, []);

    useEffect(() => {
        openModal1();
        const fetchEmotions = async () => {
            try {
                
                const response = await postContent(content);
                if (response.emotion_list) {
                    setEmotions(response.emotion_list);
                }
            } catch (error) {
                console.error('Error fetching emotions:', error);
            }
        };
        fetchEmotions();
    }, [diary.content]);

    const date = diary.date ? parseISO(diary.date) : new Date();
    const month = isNaN(date) ? '' : format(date, 'M', { locale: ko });
    const day = isNaN(date) ? '' : format(date, 'd', { locale: ko });

    const emoClicked = (emotion) => {
        if (selectedEmotions.includes(emotion)) {
            setSelectedEmotions(selectedEmotions.filter((emo) => emo !== emotion));
        } else if (selectedEmotions.length < 3) {
            setSelectedEmotions([...selectedEmotions, emotion]);
        }    
    };

    const openModal = () => {
        setModalIsOpen(true);
        setTimeout(() => {
            closeModal();
            navigate('/result', { state: { date: diary.date } });
           
        }, 3000);
    };

    const openModal1 = () => {
        setModal1IsOpen(true);
        setTimeout(() => {
            closeModal1();
        }, 3000);
    };

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
    const closeModal = () => {
        setModalIsOpen(false);
    };
    const closeModal1 = () => {
        setModal1IsOpen(false);
    };
    
    const handleSubmit = async () => {
        const updatedDiary = {
            ...diary,
            emotion: selectedEmotions.join('/')
        };
        
        updateDiary(updatedDiary);
        

        try {
            const backres = await postDiary(updatedDiary, token);
            console.log('Diary data posted successfully');
             // 로컬 스토리지에 날짜와 ID 매핑 저장
            const diaryDate = diary.date;
            const diaryId = backres.id;
            localStorage.setItem(diaryDate, diaryId);
            openModal();
        } catch (error) {
            console.error('Error posting diary data:', error);
        }
    };

    return (
        <div className="common-flex">
            <div className="select">
                <div id="logoBox">
                    <div id="logo"></div>
                </div>
                <div id="secondBox">
                    <div id="date">{month}월 {day}일 감정 선택하기</div>
                    <div id="btnBox">
                        <button 
                            id="finishbtn" 
                            className={selectedEmotions.length === 3 ? 'finish' : 'disabled'}
                            disabled={selectedEmotions.length !== 3}
                            onClick={handleSubmit}
                        >
                            
                        </button>
                    </div>
                </div>
                <div id="selectEmo">
                    <div id="info">
                        <span id="modi">MoDi가 추천해주는 감정들 순서대로 보여드려요 </span>
                        오늘의 감정과 가장 잘 어울리는 단어 3가지를 골라주세요
                    </div>
                    <div id="emos">
                        {emotions.map((emotion) => (
                            <button
                                key={emotion}
                                className={`emotion_${selectedEmotions.includes(emotion) ? 'selected' : ''}`}
                                onClick={() => emoClicked(emotion)}
                            >
                                {emotion}
                            </button>
                        ))}
                    </div>
                </div>
                <div id="nevi">
                    <button id="home" onClick={() => navigate('/')} ></button>
                    <button id="diary" onClick={handleDiaryButtonClick}></button>
                    <button id="my" onClick={() => navigate('/mypage')}></button>
                </div>
                <Modal
                    isOpen={modal1IsOpen}
                    onRequestClose={closeModal1}
                    contentLabel="Pop up Message"
                    ariaHideApp={false}
                    className="modal"
                    overlayClassName="overlay"
                >
                    <img src="load1.gif" alt="Submitting" />
                    <div>MoDi가 오늘의 감정을 고르고 있어요</div>
                    <div>잠시만 기다려주세요</div>
                </Modal>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Pop up Message"
                    ariaHideApp={false}
                    className="modal"
                    overlayClassName="overlay"
                >
                    <img src="load2.gif" alt="Submitting" />
                    <div>MoDi가 오늘의 색을 만들고있어요</div>
                    <div>잠시만 기다려주세요</div>
                </Modal>
            </div>
        </div>
    );
}

export default Select;
