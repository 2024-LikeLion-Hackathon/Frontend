// src/page/Chat/Message.jsx

import React from 'react';


const Message = ({ text, time }) => {
  return (
    <div className="message">
      <div className="message-text">{text}</div>
      <div className="message-time">{time}</div>
    </div>
  );
};

export default Message;
