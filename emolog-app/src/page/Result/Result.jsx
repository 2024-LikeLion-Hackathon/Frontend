import React, { useContext } from "react";
import './Result.css';
import { useNavigate } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import { DiaryContext } from '../../context/DiaryContext'; // DiaryContext import

function Result() {
    const navigate = useNavigate(); 
    const { diary } = useContext(DiaryContext); // DiaryContext에서 diary 데이터 가져오기

    const date = diary.date ? parseISO(diary.date) : new Date();
    const month = isNaN(date) ? '' : format(date, 'M', { locale: ko });
    const day = isNaN(date) ? '' : format(date, 'd', { locale: ko });
    const dayOfWeek = isNaN(date) ? '' : format(date, 'EEEE', { locale: ko });
    const comment = diary.comment || "코멘트가 없습니다.";
    const color = {
        "hexa": "93865c",
        "red": 147,
        "green": 134,
        "blue": 92
    } ;

     // 문자열을 배열로 변환
     const parseArray = (str) => {
        return str ? str.split(',').map(item => item.trim()).filter(item => item.length > 0) : [];
    };

    const emotions = parseArray(diary.emotion || ''); // diary.emotion을 배열로 변환

    // 문자열을 메시지 배열로 변환
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

    // 예시로 제공된 질문과 답변 데이터. 실제 데이터는 diary.q_a.question과 diary.q_a.answer에서 가져옵니다.
    const questions = parseArray(diary.q_a.question || '');
    const answers = parseArray(diary.q_a.answer || '');
    const messages = parseMessages(questions, answers);

    const MessageList = ({ messages }) => {
        // messages가 배열인지 확인하고, 아니면 빈 배열로 설정
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
    
    const deletehandler = () =>{
        alert('삭제하시겠습니까?');
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
                <div id="ment">{comment}</div>
                <div id="colorBox">
                    {/* 백엔드 연결되면 색 앞에 diary. 붙이기 */}
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
                    <div id="diary_content">{diary.content}</div>
                    <div id="text">
                        <div id="icon"></div>
                        <div id="chat_rep">MoDi와의 대화 다시보기</div>
                    </div>
                    <div id="chat">
                        <MessageList messages={diary.q_a || []} />
                    </div>
                    <button id="lastbtn" onClick={() => navigate('/')}>확인</button>
                    <button id="deletebtn" onClick={deletehandler}>삭제하기</button>
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
