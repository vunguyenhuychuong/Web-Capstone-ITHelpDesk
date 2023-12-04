import React, { useState } from "react";
import Avatar from "../chatList/Avatar";

const ChatItem = (props) => {
  return (
    <div style={{ animationDelay: `0.8s` }} className={`chat__item`}>
      <div className="chat__item__content">
        <div className="chat__msg">{props.newMessage}</div>
        <div className="chat__meta">
          <span>{props.timeMessage}</span>
        </div>
      </div>
      <Avatar isOnline="active" image={props.image} />
    </div>
  );
};

export default ChatItem;
