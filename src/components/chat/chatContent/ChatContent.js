import React, { useState } from "react";

import "./chatContent.css";
import Avatar from "../chatList/Avatar";
import ChatItem from "./ChatItem";

const ChatContent = ({
  selectedConversation,
  messages,
  sendMessage,
  setNewMessages,
}) => {
  console.log("Selected Conversation in ChatContent:", selectedConversation);

  if (!selectedConversation) {
    // Render a placeholder or default UI when no conversation is selected
    return (
      <div className="main__chatcontent">
        <p>Select a conversation to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="main__chatcontent">
      <div className="content__header">
        <div className="blocks">
          <div className="current-chatting-user">
            <Avatar
              isOnline="active"
              map
              image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTA78Na63ws7B7EAWYgTr9BxhX_Z8oLa1nvOA&usqp=CAU"
            />
            <p>Tim Hover</p>
          </div>
        </div>

        <div className="blocks">
          <div className="settings">
            <button className="btn-nobg">
              <i className="fa fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
      <div className="content__body">
        <div className="chat__items">
          {messages?.map((message, index) => (
            <ChatItem
              animationDelay={index + 2}
              key={message.key}
              user={message.username}
              newMessage={message.text}
              timeMessage={message.timestamp}
              image={message.avatarUrl}
            />
          ))}
        </div>
      </div>
      <div className="content__footer">
        <div className="sendNewMessage">
          <button className="addFiles">
            <i className="fa fa-plus"></i>
          </button>
          <input
            type="text"
            placeholder="Type a message here"
            onChange={(e) => setNewMessages(e.target.value)}
          />
          <button
            className="btnSendMsg"
            id="sendMsgBtn"
            onClick={() => sendMessage()}
          >
            <i className="fa fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContent;
