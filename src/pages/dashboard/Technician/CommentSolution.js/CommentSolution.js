import React, { useState } from "react";
import { Avatar, Button, Checkbox, IconButton, TextField } from "@mui/material";
import {
  Delete,
  EditNote,
  Info,
  Lock,
  Reply,
  Send,
  ThumbDown,
  ThumbUp,
} from "@mui/icons-material";
import "../../../../assets/css/ticketSolution.css";

const CommentSolution = ({ comments }) => {
  const [newComment, setNewComment] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [thumbsUpCount, setThumbsUpCount] = useState(0);
  const [thumbsDownCount, setThumbsDownCount] = useState(0);
  const handleThumbsUp = () => {
    setThumbsUpCount(thumbsUpCount + 1);
  };

  const handleThumbsDown = () => {
    setThumbsDownCount(thumbsDownCount + 1);
  };
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handlePostComment = () => {
    setNewComment("");
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          marginLeft: "10px",
          marginTop: "10px",
        }}
      >
        <small style={{ color: "grey" }}>Was this solution helpful?</small>
        <IconButton
          aria-label="Thumbs Up"
          style={{ marginLeft: "10px" }}
          onClick={handleThumbsUp}
        >
          <ThumbUp />
        </IconButton>
        <span style={{ marginLeft: "5px" }}>{thumbsUpCount}</span>
        <IconButton
          aria-label="Thumbs Down"
          style={{ marginLeft: "10px" }}
          onClick={handleThumbsDown}
        >
          <ThumbDown />
        </IconButton>
        <span style={{ marginLeft: "5px" }}>{thumbsDownCount}</span>
      </div>
      <Button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{ marginLeft: "10px", cursor: "pointer", color: "#222222",backgroundColor: "#CCCCCC",textTransform: "none" }}
      >
        {isDropdownOpen
          ? `Comments ▲ (${comments.length})`
          : `Comments ▼ (${comments.length})`}
      </Button>
      {isDropdownOpen &&
        comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <Avatar
              alt={comment.user.name}
              src={comment.user.avatarUrl}
              className="avatar"
            />
            <div
              style={{
                marginLeft: "10px",
                display: "flex",
                flexDirection: "column",
                flex: "1",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <strong>{comment.user.name}</strong>
                <small style={{ marginLeft: "10px" }}>
                  {comment.dateTime}
                </small>{" "}
                <Lock style={{ color: "#FFCC66" }} />
              </div>
              <p>{comment.text}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton aria-label="Reply">
                  <Reply />
                  <span style={{ fontSize: "0.6em" }}>Reply</span>
                </IconButton>
                <IconButton aria-label="Edit">
                  <EditNote />
                  <span style={{ fontSize: "0.6em" }}>Edit</span>
                </IconButton>
                <IconButton aria-label="Delete">
                  <Delete />
                  <span style={{ fontSize: "0.6em" }}>Delete</span>
                </IconButton>
              </div>
            </div>
          </div>
        ))}
      <div style={{ backgroundColor: "#f2f2f2", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4
            style={{ color: "#666666",  fontWeight: "bold" }}
          >
            Add Comment
          </h4>
          <p
            style={{ color: "#666666" }}
          ><Info style={{ color: "#33CCFF" }}/>
            Tag Technician(@Technician-name) to notify them
          </p>
        </div>
        {/* Text area for posting new comments */}
        <TextField
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          placeholder="Write a comment..."
          value={newComment}
          onChange={handleCommentChange}
          style={{ marginBottom: "10px" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", marginRight: "auto" }}>
            <Checkbox color="primary" />
            <span style={{ marginTop: "10px" }}>
              Show a comment to requester
            </span>
          </div>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Send />}
            onClick={handlePostComment}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSolution;
