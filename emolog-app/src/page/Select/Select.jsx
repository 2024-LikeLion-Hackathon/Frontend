import React, { useState } from "react";
import './Select.css';
import { useNavigate } from "react-router-dom";

function Select() {
    const navigate = useNavigate(); 
    // 임시 감정 배열
    const emotions = ["가책", "간이 콩알만해지는", "머리칼이 곤두서는", "묘한", "몸 둘 바를 모르는", "손에 땀을 쥐는 듯한", "쓰러질 것 같은"];
    const [selectedEmotions, setSelectedEmotions] = useState([]);

    const emoClicked = (emotion) => {
        if (selectedEmotions.includes(emotion)) {
            setSelectedEmotions(selectedEmotions.filter((emo) => emo !== emotion));
        } else if (selectedEmotions.length < 3) { // 최대 3개의 감정 선택 가능
            setSelectedEmotions([...selectedEmotions, emotion]);
        }
    };

    let month = 7;
    let day = 3;

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
        </div>
    );
}

export default Select;
