import React, { useState, useEffect, useContext } from "react";
import './Select.css';
import { useNavigate } from "react-router-dom";
import Modal from 'react-modal';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DiaryContext } from '../../context/DiaryContext';
import { postDiary } from "../../api/postDiary";
import { postContent } from "../../api/postContent";

function Select() {
    const navigate = useNavigate(); 
    const { diary, updateDiary } = useContext(DiaryContext);
    const [emotions, setEmotions] = useState([]);
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken)
        }
    }, []);

    useEffect(() => {
        const fetchEmotions = async () => {
            try {
                const content = diary.content || '';
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
    
    const closeModal = () => {
        setModalIsOpen(false);
    };
    
    const handleSubmit = async () => {
        const updatedDiary = {
            ...diary,
            emotion: selectedEmotions.join(',')
        };
        
        updateDiary(updatedDiary);
        

        try {
            await postDiary(updatedDiary, token);
            console.log('Diary data posted successfully');
            openModal();
        } catch (error) {
            console.error('Error posting diary data:', error);
        }
    };

    return (
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
                <img src="load2.gif" alt="Submitting" />
                <div>MoDi가 오늘의 색을 만들고있어요</div>
                <div>잠시만 기다려주세요</div>
            </Modal>
        </div>
    );
}

export default Select;
