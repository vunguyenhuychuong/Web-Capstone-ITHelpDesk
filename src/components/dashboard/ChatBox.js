import React from 'react';
import "../../assets/css/ChatBox.css"

const ChatBox = ({toggleChatBox}) => {
  return (
    <div className="chat-box-container">
      <div className="chat-header">
        <h3>Chat</h3>
        <button className="close-button" onClick={toggleChatBox}>X</button>
      </div>
      <div className="chat-messages">
        {/* Chat messages go here */}
        <div className="message">
          <p>Friend: Hey, how are you?</p>
        </div>
        <div className="message">
          <p>You: Hi! I'm doing well, thanks.</p>
        </div>
        {/* Add more messages as needed */}
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Type your message..." />
        <button className="send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;