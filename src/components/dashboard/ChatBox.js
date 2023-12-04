import React from "react";
import "../../assets/css/ChatBox.css";
import { useState } from "react";
import { ref, push, onValue } from "firebase/database";
import { useEffect } from "react";
import { database } from "../../firebase";
import { useSelector } from "react-redux";
import { Tooltip } from "@mui/material";

const ChatBox = ({ toggleChatBox }) => {
  const user = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesRef = ref(database, "messages");

  useEffect(() => {
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messagesArray = Object.values(data);
        setMessages(messagesArray);
      }
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMessageObject = {
        text: newMessage,
        timestamp: new Date().toISOString(),
        avatarUrl: user.user.avatarUrl,
        username: user.user.username,
      };
  
      push(messagesRef, newMessageObject);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-box-container">
      <div className="chat-header">
      <div className="user-info">
        <img
          src={user.user.avatarUrl}
          alt="User Avatar"
          className="avatar-header"
        />
        <p className="username">{user.user.username}</p>
      </div>
        <button className="close-button" onClick={toggleChatBox}>
          X
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div className="message" key={index}>
            <div className="message-user-info">
              <img
                 src={message.avatarUrl}
                alt="User Avatar"
                className="avatar"
              />
              
            </div>
            <Tooltip title={message.timestamp} arrow>
              <p className="message-text">{message.text}</p>
            </Tooltip>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
