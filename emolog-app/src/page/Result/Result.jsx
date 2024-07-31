import React, { useState, useEffect } from "react";
import './Result.css';
import { useNavigate, useLocation } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getDiaryId } from '../../api/getDiaryId'; // API 함수 import

function Result() {
    const [diary, setDiary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const date = location.state?.date || new Date().toISOString().split('T')[0]; // 기본값으로 오늘 날짜 사용
    const today = new Date(date); // 날짜 객체 생성

    useEffect(() => {
        const fetchDiary = async () => {
            try {
                const data = await getDiaryId(date);
                setDiary(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDiary();
    }, [date]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading diary data.</div>;
    if (!diary) return <div>No diary data found.</div>;

    // 디스트럭처링
    const { diary: diaryData, color, emotion, comment, q_a } = diary;

    // 날짜 포맷팅
    const diaryDate = diaryData?.date ? parseISO(diaryData.date) : today;
    const month = isNaN(diaryDate) ? '' : format(diaryDate, 'M', { locale: ko });
    const day = isNaN(diaryDate) ? '' : format(diaryDate, 'd', { locale: ko });
    const dayOfWeek = isNaN(diaryDate) ? '' : format(diaryDate, 'EEEE', { locale: ko });

    // 데이터 처리
    const commentText = comment || "코멘트가 없습니다.";
    const emotionsList = emotion || [];
    const questions = parseArray(q_a?.question || '');
    const answers = parseArray(q_a?.answer || '');
    const messages = parseMessages(questions, answers);

    // 문자열을 배열로 변환
    const parseArray = (str) => {
        return str ? str.split(',').map(item => item.trim()).filter(item => item.length > 0) : [];
    };

    // 질문과 답변을 메시지 형태로 변환
    const parseMessages = (questions, answers) => {
        const messages = [];
        const qA = [...questions, ...answers];
        let id = 1;

        qA.forEach((item, index) => {
            const sender = index % 2 === 0 ? 'user' : 'ai';
            messages.push({ id: id++, sender: sender, text: item });
        });

        return messages;
    };

    // 메시지 리스트 컴포넌트
    const MessageList = ({ messages }) => {
        const validMessages = Array.isArray(messages) ? messages : [];
        return (
            <div className='messages'>
                {validMessages.map((message) => (
                    <Message
                        key={message.id}
                        text={message.text}
                        sender={message.sender}
                    />
                ))}
            </div>
        );
    };

    // 개별 메시지 컴포넌트
    const Message = ({ text, sender }) => {
        const isOwnMessage = sender === 'ai';
        const messageClass = isOwnMessage ? 'message-right' : 'message-left';

        return (
            <div className={messageClass}>
                {isOwnMessage && <div className="modi"/>}
                <div className={`message_${messageClass}`}>
                    <div className="message-text">{text}</div>
                </div>
            </div>
        );
    };

    // 삭제 핸들러
    const deleteHandler = () => {
        if (window.confirm('삭제하시겠습니까?')) {
            // 삭제 로직을 여기에 추가하세요.
            console.log('삭제되었습니다.');
        }
    };

    return (
        <div className="result">
            <div id="logoBox">
                <div id="logo"></div>
            </div>
            <div id="secondBox">
                <div id="date">{month}월 {day}일 {dayOfWeek}의 일기</div>
                <div id="btnBox">
                    <button id="finishbtn"></button>
                </div>
            </div>
            <div id="resultBox">
                <div id="img"></div>
                <div id="ment">{commentText}</div>
                <div id="colorBox">
                    <div id="color" style={{ backgroundColor: `#${color.hexa}` }}></div>
                    <div className="color_container"></div>
                    <div id="rgb">
                        <div id="r" className="rgb_container">
                            <div className="rgbbox">R</div>
                            <div id="r_value" className="rgb_value">{color.red}</div>
                        </div>
                        <div id="g" className="rgb_container">
                            <div className="rgbbox">G</div>
                            <div id="g_value" className="rgb_value">{color.green}</div>
                        </div>
                        <div id="b" className="rgb_container">
                            <div className="rgbbox">B</div>
                            <div id="b_value" className="rgb_value">{color.blue}</div>
                        </div>
                    </div>
                </div>
                <div id="color_hexa">#{color.hexa}</div>
                <div id="emotions">
                    {emotionsList.map((emotion) => (
                        <button
                            key={emotion}
                            className={`emotion`}
                        >
                            {emotion}
                        </button>
                    ))}
                </div>
                <div id="dt_container">
                    <div id="diary_content">{diaryData.content}</div>
                    <div id="text">
                        <div id="icon"></div>
                        <div id="chat_rep">MoDi와의 대화 다시보기</div>
                    </div>
                    <div id="chat">
                        <MessageList messages={messages} />
                    </div>
                    <button id="lastbtn" onClick={() => navigate('/')}>확인</button>
                    <button id="deletebtn" onClick={deleteHandler}>삭제하기</button>
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

export default Result;
