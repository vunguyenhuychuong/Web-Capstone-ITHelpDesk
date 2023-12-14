import React, { useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Slide,
  TextField,
} from "@mui/material";
import {
  Cancel,
  Delete,
  EditNote,
  Info,
  Lock,
  LockOpen,
  Reply,
  Save,
  Send,
  ThumbDown,
  ThumbUp,
} from "@mui/icons-material";
import "../../../../assets/css/ticketSolution.css";
import {
  createDisLike,
  createFeedBack,
  createLike,
  deleteFeedBack,
  editFeedBack,
  getAllFeedBack,
  getDetailFeedBack,
} from "../../../../app/api/feedback";
import { useCallback } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../../../helpers/FormatDate";
import { toast } from "react-toastify";
import useSolutionTicketData from "../SolutionTicketData";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CommentSolution = (data) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dataFeedBack, setDataFeedBack] = useState([]);
  const { solutionId } = useParams();
  const [deleteSolutionId, setDeleteSolutionId] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);

  const [dataLike, setData] = useState({
    countDislike: data.countDislike || 0,
    countLike: data.countLike || 0,
  })


  const [dataCmt, setDataCmt] = useState({
    id: 1,
    userId: 1,
    solutionId: 1,
    comment: "",
    isPublic: true,
    countDislike: 0,
    countLike: 0,
  });

  const [editComment, setEditComment] = useState({
    id: 1,
    userId: 1,
    solutionId: 1,
    comment: "",
    isPublic: true,
  });

  const handleDetailFeedBack = async (commentId) => {
    try {
      const feedback = await getDetailFeedBack(commentId);
      if (feedback) {
        setDataCmt({
          id: feedback.id || "",
          userId: feedback.userId || "",
          solutionId: feedback.solutionId || "",
          comment: feedback.comment || "",
          isPublic: feedback.isPublic || "",
          createdAt: feedback.createdAt || "",
          modifiedAt: feedback.modifiedAt || "",
        });
        setDataCmt({
          id: 1,
          userId: 1,
          solutionId: 1,
          comment: "",
          isPublic: true,
        });
      } else {
        console.error("Invalid or missing data in feedback result");
      }
    } catch (error) {
      console.error("Error while fetching detail Feed Back:", error);
    } finally {
      setEditCommentId(commentId);
    }
  };

  const handleLike = async () => {
    try {
      const updatedData = await createLike(solutionId);
      setData(updatedData);
      setDataCmt((prevDataCmt) => ({
        ...prevDataCmt,
        countLike: updatedData.countLike,
      }));
    } catch (error) {
      console.error("Error liking solution:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const updatedData = await createDisLike(solutionId);
      setData(updatedData);
      setDataCmt((prevDataCmt) => ({
        ...prevDataCmt,
        countDislike: updatedData.countDislike,
      }));
    } catch (error) {
      console.error("Error disliking solution:", error);
    }
  };

  const handleEditComment = async () => {
    try {
      const payload = {
        comment: editComment.comment,
        isPublic: editComment.isPublic,
      };

      await editFeedBack(editComment.id, payload);
      fetchDataListFeedBack();
      setEditCommentId(null);
    } catch (error) {
      toast.error("Failed to update comment");
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setEditCommentId(null);
    setEditComment({
      id: 1,
      userId: 1,
      solutionId: 1,
      comment: "",
      isPublic: true,
    });
    setDataCmt({
      id: 1,
      userId: 1,
      solutionId: 1,
      comment: "",
      isPublic: true,
    });
  };

  const isEditingComment = (commentId) => {
    return editCommentId === commentId;
  };

  const fetchDataListFeedBack = useCallback(async () => {
    try {
      const response = await getAllFeedBack(solutionId);
      setDataFeedBack(response);
    } catch (error) {
      console.log(error);
    }
  }, [solutionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDataCmt((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitFeedBack = async (e) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
        await createFeedBack({
        solutionId: solutionId,
        comment: dataCmt.comment,
        isPublic: dataCmt.isPublic,
      });
     
        setDataCmt((prevData) => ({
          ...prevData,
          comment: "",
        }));
      fetchDataListFeedBack();
    } catch (error) {
      console.log("Please check data input", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCommentClick = (commentId) => () => {
    setDeleteSolutionId(commentId);
    setOpen(true);
  };

  const handleDeleteFeedBack = async () => {
    if (isDeleting) {
      return;
    }
    setIsDeleting(true);
    try {
      const result = await deleteFeedBack(deleteSolutionId);
      if (result.dataCmt && result.dataCmt.responseException.exceptionMessage) {
        console.log(result.dataCmt.responseException.exceptionMessage);
      } else {
        toast.success("Feedback created successfully");
        fetchDataListFeedBack();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    fetchDataListFeedBack();
  }, [fetchDataListFeedBack]);

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
          onClick={handleLike}
        >
          <ThumbUp />
        </IconButton>
        <span style={{ marginLeft: "5px" }}>{dataLike.countLike}</span>
        <IconButton
          aria-label="Thumbs Down"
          style={{ marginLeft: "10px" }}
          onClick={handleDislike}
        >
          <ThumbDown />
        </IconButton>
        <span style={{ marginLeft: "5px" }}>{dataLike.countDislike}</span>
      </div>
      <Button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        style={{
          marginLeft: "10px",
          cursor: "pointer",
          color: "#222222",
          backgroundColor: "#CCCCCC",
          textTransform: "none",
        }}
      >
        {isDropdownOpen
          ? `Comments ▲ (${dataFeedBack.length})`
          : `Comments ▼ (${dataFeedBack.length})`}
      </Button>
      {isDropdownOpen &&
        dataFeedBack.map((comment) => (
          <div
            key={comment.id}
            style={{
              display: "flex",
              // alignItems: "center",
              alignItems: "flex-start",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <Avatar
              alt={comment.user.username}
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
                <strong>
                  {comment.user.lastName} {comment.user.firstName}
                </strong>
                <small style={{ marginLeft: "10px" }}>
                  {formatDate(comment.createdAt)}
                </small>{" "}
                {comment.isPublic ? (
                  <LockOpen style={{ color: "#66FF66" }} />
                ) : (
                  <Lock style={{ color: "#FFCC66" }} />
                )}
              </div>
              <p>{comment.comment}</p>
              {isEditingComment(comment.id) ? (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    id="edit-comment"
                    name="edit-comment"
                    value={editComment.comment}
                    onChange={(e) => setEditComment((prevEditComment) => ({ ...prevEditComment, comment: e.target.value }))}
                    style={{ margin: "10px 0", marginRight: "10px" }}
                  />
                  <IconButton aria-label="Save" onClick={handleEditComment}>
                    <Save />
                    <span style={{ fontSize: "0.6em" }}>Save</span>
                  </IconButton>
                  <IconButton aria-label="Cancel" onClick={handleCancelEdit}>
                    <Cancel />
                    <span style={{ fontSize: "0.6em" }}>Cancel</span>
                  </IconButton>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconButton aria-label="Reply">
                    <Reply />
                    <span style={{ fontSize: "0.6em" }}>Reply</span>
                  </IconButton>
                  <IconButton
                    aria-label="Edit"
                    onClick={() => {
                      console.log("Editing comment ID:", comment.id);
                      handleDetailFeedBack(comment.id)}
                    }
                  >
                    <EditNote />
                    <span style={{ fontSize: "0.6em" }}>Edit</span>
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    onClick={handleDeleteCommentClick(comment.id)}
                  >
                    <Delete />
                    <span style={{ fontSize: "0.6em" }}>Delete</span>
                  </IconButton>
                </div>
              )}
              {comment.feedbackReplies &&
                comment.feedbackReplies.length > 0 && (
                  <div style={{ marginLeft: "20px" }}>
                    {comment.feedbackReplies.map((reply) => (
                      <div
                        key={reply.id}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Avatar
                          alt={reply.user.username}
                          src={reply.user.avatarUrl}
                          className="avatar"
                        />
                        <div
                          style={{ marginLeft: "10px", marginBottom: "25px" }}
                        >
                          <strong>
                            {reply.user.lastName} {reply.user.firstName}
                          </strong>
                          <small style={{ marginLeft: "10px" }}>
                            {formatDate(reply.createdAt)}
                          </small>
                          {reply.isPublic ? (
                            <LockOpen style={{ color: "#66FF66" }} />
                          ) : (
                            <Lock style={{ color: "#FFCC66" }} />
                          )}
                          <p>{reply.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        ))}
      <div style={{ backgroundColor: "#f2f2f2", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 style={{ color: "#666666", fontWeight: "bold" }}>Add Comment</h4>
          <p style={{ color: "#666666" }}>
            <Info style={{ color: "#33CCFF" }} />
            Tag Technician(@Technician-name) to notify them
          </p>
        </div>
        <TextField
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          id="comment"
          name="comment"
          placeholder="Write a comment..."
          value={dataCmt.comment}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", marginRight: "auto" }}>
            <Checkbox color="primary" onChange={handleInputChange} />
            <span style={{ marginTop: "10px" }}>
              Show a comment to requester
            </span>
          </div>
          <Button
            variant="contained"
            color="primary"
            endIcon={<Send />}
            onClick={handleSubmitFeedBack}
          >
            Add
          </Button>
        </div>
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure want to delete this comment.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteFeedBack}>Yes</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CommentSolution;
