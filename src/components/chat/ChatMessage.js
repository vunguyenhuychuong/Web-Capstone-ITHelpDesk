import { useState } from "react";
import { useSelector } from "react-redux";
import Nav from "./nav/Nav";
import ChatBody from "./chatBody/ChatBody";

const ChatMessage = () => {
  return (
    <div className="__main">
      <Nav />
      <ChatBody />
    </div>
  );
};

export default ChatMessage;
