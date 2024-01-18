import React, { useState } from "react";
import Avatar from "./Avatar";

const ChatListItems = (props) => {
  const selectChat = () => {
    props.onSelectConversation();
  };
  return (
    <div
      style={{ animationDelay: `0.${props.animationDelay}s` }}
      onClick={selectChat}
      className={`chatlist__item`}
    >
      {props.participants?.map((participant) => (
        <Avatar
          key={participant.id}
          image={
            participant.avatarUrl
              ? participant.avatarUrl
              : "http://placehold.it/80x80"
          }
          isOnline={props.isOnline}
        />
      ))}

      {/* {props.participants?.map((participant) => (
      <div className="userMeta">
        <p>-{participant.lastName} {participant.firstName}</p>
      </div>
       ))} */}
    </div>
  );
};

export default ChatListItems;
