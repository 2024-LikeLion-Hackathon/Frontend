import React, { useState, useEffect, useContext } from "react";
import './Result.css';
import { useNavigate, useLocation } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getDiaryId } from '../../api/getDiaryId';
import { deleteDiary } from "../../api/deleteDiary";
import { DiaryContext } from "../../context/DiaryContext";

function Result() {
    const navigate = useNavigate();
    const location = useLocation();
    const { resetDiary } = useContext(DiaryContext);
    const initialDate = location.state?.date || new Date().toISOString().split('T')[0];
    const [diary, setDiary] = useState({
        diary: {
            date: "",
            dayOfWeek: "",
            content: ""
        },
        color: {
            hexa: "",
            red: 147,
            green: 134,
            blue: 92
        },
        emotion: [],
        comment: "",
        url: "",
        q_a: {
            question: "",
            answer: ""
        }

    });
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [diaryId, setDiaryId] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            console.log(location.state);
        }
    }, []);

    useEffect(() => {
        if (!token) return;

        const fetchDiaryData = async () => {
            try {
                setLoading(true);
                const storedDiaryId = localStorage.getItem(initialDate);
                if (!storedDiaryId) {
                    
                    const DiaryData = await getDiaryId(initialDate, token);
                     setDiary(DiaryData);
                     return; // Diary ID가 없으면 함수 종료
                }
                else{
                setDiaryId(storedDiaryId); // 상태에 ID 저장
                const DiaryData = await getDiaryId(initialDate, token);
                setDiary(DiaryData);}
            } catch (error) {
                console.error('Error fetching diary data:', error);
                setError('Error fetching diary data');
            } finally {
                setLoading(false);
            }
        };
        

        fetchDiaryData();
    }, [token, initialDate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading diary data.</div>;

    // 날짜 포맷팅
    const diaryDate = diary.diary.date ? parseISO(diary.diary.date) : new Date();
    const month = isNaN(diaryDate) ? '' : format(diaryDate, 'M', { locale: ko });
    const day = isNaN(diaryDate) ? '' : format(diaryDate, 'd', { locale: ko });
    const dayOfWeek = isNaN(diaryDate) ? '' : format(diaryDate, 'EEEE', { locale: ko });

    // 문자열을 배열로 변환
    const parseArray = (str) => {
        return str ? str.split('/').map(item => item.trim()).filter(item => item.length > 0) : [];
    };

    const emotions = parseArray(diary.emotion.join('/'));

    // 문자열을 메시지 배열로 변환 (질문과 답변을 따로 파싱하고 순서대로 합침)
    const parseMessages = (questions, answers) => {
        const messages = [];
        const qArray = parseArray(questions);
        const aArray = parseArray(answers);
        const maxLength = Math.max(qArray.length, aArray.length);

        let id = 1;

        for (let i = 0; i < maxLength; i++) {
            if (i < qArray.length) {
                messages.push({ id: id++, sender: 'ai', text: qArray[i] });
            }
            if (i < aArray.length) {
                messages.push({ id: id++, sender: 'user', text: aArray[i] });
            }
        }

        return messages;
    };

    const messages = parseMessages(diary.q_a.question, diary.q_a.answer);

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

    const deleteHandler = async () => {
        console.log("1",diaryId);
        if (window.confirm('삭제하시겠습니까?')) {
            try {
                
                await deleteDiary(diaryId ,token);
                console.log('삭제되었습니다.');
                navigate('/'); // 삭제 후 메인 페이지로 이동
            } catch (error) {
                console.error('Error deleting diary:', error);
                setError('Error deleting diary');
            }
        }
    };

    const handleFinish = () => {
        resetDiary(); // DiaryContext 초기화
        navigate('/'); // 메인 페이지로 이동
    };

    return (
        <div className="common-flex">
            <div className="result">
                <div id="logoBox">
                    <div id="logo"></div>
                </div>
                <div id="secondBox">
                    <div id="date">{month}월 {day}일 {dayOfWeek}의 일기</div>
                    <div id="btnBox">
                        <button id="finishbtn" onClick={handleFinish}></button>
                    </div>
                </div>
                <div id="resultBox">
                    <div id="img" style={{ backgroundImage:`url(${diary.url})` }}></div>
                    <div id="ment">{diary.comment}</div>
                    <div id="colorBox">
                        <div id="color" style={{ backgroundColor: diary.color.hexa ? `#${diary.color.hexa}` : 'black' }}></div>

                        <div className="color_container"></div>
                        <div id="rgb">
                            <div id="r" className="rgb_container">
                                <div className="rgbbox">R</div>
                                <div id="r_value" className="rgb_value">{diary.color.red}</div>
                            </div>
                            <div id="g" className="rgb_container">
                                <div className="rgbbox">G</div>
                                <div id="g_value" className="rgb_value">{diary.color.green}</div>
                            </div>
                            <div id="b" className="rgb_container">
                                <div className="rgbbox">B</div>
                                <div id="b_value" className="rgb_value">{diary.color.blue}</div>
                            </div>
                        </div>
                    </div>
                    <div id="color_hexa">#{diary.color.hexa}</div>
                    <div id="emotions">
                        {emotions.map((emotion) => (
                            <button
                                key={emotion}
                                className={`emotion`}
                            >
                                {emotion}
                            </button>
                        ))}
                    </div>
                    <div id="dt_container">
                        <div id="diary_content">{diary.diary.content}</div>
                        <div id="text">
                            <div id="icon"></div>
                            <div id="chat_rep">MoDi와의 대화 다시보기</div>
                        </div>
                        <div id="chat">
                            <MessageList messages={messages} />
                        </div>
                        <button id="lastbtn" onClick={handleFinish}>확인</button>
                        <button id="deletebtn" onClick={deleteHandler}>삭제하기</button>
                    </div>
                </div>
                <div id="nevi">
                    <button id="home" onClick={() => navigate('/')}></button>
                    <button id="diary" onClick={() => navigate('/write')}></button>
                    <button id="my" onClick={() => navigate('/mypage')}></button>
                </div>
            </div>
        </div>
    );
}

export default Result;