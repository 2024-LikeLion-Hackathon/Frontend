import React from "react";
import './Result.css';
import { useNavigate } from "react-router-dom";
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';


function Result(){
    const navigate = useNavigate(); 

    const data = {
        diary: {
            date: "2024-07-21",
            dayOfWeek: "월",
            content: "오늘 아침, 창밖을 보니 비가 부슬부슬 내리고 있었다. 이런 날씨에 집에서 나가기 싫었지만, 출근을 위해 어쩔 수 없이 버스를 타야 했다.우산을 챙겨들고 정류장에 서서 버스를 기다리며, 습기 찬 공기를 들이마셨다. 버스에 올라 자리를 잡고 앉으니, 창문 너머로 빗방울이 흐르는 모습이 보였다. 비 오는 날의 버스 안은 유난히 조용하고 차분하다. 출근길의 무료함을 달래기 위해 이어폰을 꺼내어 좋아하는 노래를 틀었다. 잔잔한 멜로디가 귀에 울리자, 마음이 한결 편안해졌다. 버스가 목적지에 가까워질 때쯤, 주머니 속에서 츄파춥스를 하나 꺼내어 입에 물었다. 달콤한 맛이 피곤함을 조금이나마 덜어주는 것 같았다. 하루 일과를 마치고 집에 돌아와 따뜻한 샤워를 마친 뒤, 침대에 누웠다. 창밖에서는 여전히 비가 내리고 있었다. 빗소리를 자장가 삼아, 서서히 잠에 빠져들었다. "
        },
        color: {
            hexa: "93465c",
            red: 147,
            green: 134,
            blue: 92
        },
        emotion: [
            "가책",
            "손에 땀을 쥐게 하는",
            "달달"
        ],
        comment: "많이 힘들었겠지, 고생했어",
        q_a: [
            {id: 1, sender: 'ai', text: '텍스트텍스트텍스트텍스트텍ㅇ트'},
            {id: 2, sender: 'user', text: '텍스트텍스트텍스트텍스트텍스트'},
            {id: 3, sender: 'ai', text: '텍스트텍스트텍스트텍스트텍ㅇ트텍스트텍스트텟그트'},
            {id: 4, sender: 'ai', text: '텍스트'},
        ]
    }

    const date = parseISO(data.diary.date);

    const month = format(date, 'M', { locale: ko });
    const day = format(date, 'd', { locale: ko });
    const dayOfWeek = format(date, 'EEEE', { locale: ko });
    const emotions = [...data.emotion];


    const MessageList = ({ messages }) => {
        return (
          <div className='messages' >
            {messages.map((message, i) => (
              <Message
                key={i}
                text={message.text}
                sender={message.sender}
              />
            ))}
          </div>
        );
      };

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

    return(
        <div className="result">
        <div id="logoBox">
            <div id="logo"></div>
        </div>
        <div id="secondBox">
            <div id="date">{month}월 {day}일 {dayOfWeek}의 일기</div>
            <div id="btnBox">
                <button 
                    id="finishbtn" 
                    
                >
                    
                </button>
            </div>
        </div>
        <div id="resultBox">
            <div id="img"></div>
            <div id="ment">{data.comment}</div>
            <div id="colorBox">
            
                <div id="color" style={{ backgroundColor: `#${data.color.hexa}` }}></div>
                <div className="color_container"></div>
                
                <div id="rgb">
                    <div id="r" className="rgb_container">
                        <div className="rgbbox">R</div>
                        <div id="r_value" className="rgb_value">{data.color.red}</div>
                        </div>
                    <div id="g"  className="rgb_container">
                        <div className="rgbbox">G</div>
                        <div id="g_value" className="rgb_value">{data.color.blue}</div>
                    </div>
                    <div id="b"  className="rgb_container">
                        <div className="rgbbox">B</div>
                        <div id="b_value" className="rgb_value">{data.color.green}</div>
                    </div>
                </div>
                
            </div>
            <div id="color_hexa">#{data.color.hexa}</div>
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
                <div id="diary_content">{data.diary.content}</div>
                <div id="text">
                    <div id="icon"></div>
                    <div id="chat_rep">MoDi와의 대화 다시보기</div>
                </div>
            
            <div id="chat">
                <MessageList messages={data.q_a} />
             </div>
            <button id="lastbtn">확인</button>
                </div>
            
            
           
        </div>
        <div id="nevi">
            <button id="home" onClick={() => navigate('/')} ></button>
            <button id="diary" onClick={() => navigate('/write')}></button>
            <button id="my" onClick={() => navigate('/mypage')}></button>
        </div>
    </div>
    )
}

export default Result;