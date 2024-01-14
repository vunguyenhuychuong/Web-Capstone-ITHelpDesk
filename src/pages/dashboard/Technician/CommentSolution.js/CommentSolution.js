import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Slide,
  Stack,
  TextField,
  Tooltip,
  Typography,
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

const CommentSolution = (props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dataFeedBack, setDataFeedBack] = useState([]);
  const { solutionId } = useParams();
  const [deleteSolutionId, setDeleteSolutionId] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const { loading, data, dataCategories, error, refetch } =
    useSolutionTicketData(solutionId);

  const [dataLike, setDataLike] = useState({
    countDislike:
      props.data && props.data.countDislike !== undefined
        ? props.data.countDislike
        : 0,
    countLike:
      props.data && props.data.countLike !== undefined
        ? props.data.countLike
        : 0,
  });

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

      if (typeof refetch === "function") {
        refetch();
      } else {
        console.error("refetch is not a function");
      }
    } catch (error) {
      console.error("Error liking solution:", error.message || error);
    }
  };

  const handleDislike = async () => {
    try {
      const updatedData = await createDisLike(solutionId);

      refetch();
    } catch (error) {
      console.error("Error disliking solution:", error.message || error);
    }
  };

  useEffect(() => {
    setDataLike({
      countDislike:
        props.data && props.data.countDislike !== undefined
          ? props.data.countDislike
          : 0,
      countLike:
        props.data && props.data.countLike !== undefined
          ? props.data.countLike
          : 0,
    });
  }, [props.data]);

  useEffect(() => {
    setDataLike({
      countDislike:
        data && data.countDislike !== undefined ? data.countDislike : 0,
      countLike: data && data.countLike !== undefined ? data.countLike : 0,
    });
  }, [data]);

  const handleEditComment = async (solutionId) => {
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
    <Stack>
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
          type="button"
        >
          <ThumbUp color={data?.currentReactionUser === 0 ? "primary" : ""} />
        </IconButton>
        <span style={{ marginLeft: "5px" }}>{dataLike.countLike}</span>
        <IconButton
          aria-label="Thumbs Down"
          style={{ marginLeft: "10px" }}
          onClick={handleDislike}
          type="button"
        >
          <ThumbDown color={data?.currentReactionUser === 1 ? "primary" : ""} />
        </IconButton>
        <span style={{ marginLeft: "5px" }}>{dataLike.countDislike}</span>
      </div>
      <Button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        sx={{
          marginX: "1rem",
          color: "#222222",
          backgroundColor: "#CCCCCC",
          textTransform: "none",
        }}
      >
        {isDropdownOpen
          ? `Hide Comments ▲ (${dataFeedBack.length})`
          : `View Comments ▼ (${dataFeedBack.length})`}
      </Button>
      <Stack
        sx={{
          borderLeft: "1px solid #c2c2c2",
          px: "2rem",
          marginLeft: "2rem",
          marginY: "2rem",
        }}
      >
        {isDropdownOpen &&
          dataFeedBack.map((comment) => (
            <Stack
              key={comment.id}
              direction={"row"}
              sx={{
                alignItems: "flex-start",
                marginY: 1,
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
                <Box
                  sx={{
                    backgroundColor: "#c2c2c290",
                    paddingX: 2,
                    paddingY: 1,
                    boxSizing: "content-box",
                    borderRadius: 6,
                    width: "fit-content",
                  }}
                >
                  <Stack flexDirection={"row"} alignItems={"center"}>
                    <Typography variant="h6">
                      {comment.user.lastName} {comment.user.firstName}
                    </Typography>
                    <small style={{ marginLeft: "10px" }}>
                      {formatDate(comment.createdAt)}
                    </small>{" "}
                    {/* {comment.isPublic ? (
                  <LockOpen style={{ color: "#66FF66" }} />
                ) : (
                  <Lock style={{ color: "#FFCC66" }} />
                )} */}
                  </Stack>
                  <p>{comment.comment}</p>
                </Box>
                {isEditingComment(comment.id) ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="edit-comment"
                      name="edit-comment"
                      value={editComment.comment}
                      onChange={(e) =>
                        setEditComment((prevEditComment) => ({
                          ...prevEditComment,
                          comment: e.target.value,
                        }))
                      }
                      style={{ margin: "10px 0", marginRight: "10px" }}
                    />
                    <Stack alignItems={"flex-start"}>
                      <IconButton aria-label="Save" onClick={handleEditComment}>
                        <Save />
                        <span style={{ fontSize: "0.6em" }}>Save</span>
                      </IconButton>
                      <IconButton
                        aria-label="Cancel"
                        onClick={handleCancelEdit}
                        color="error"
                      >
                        <Cancel />
                        <span style={{ fontSize: "0.6em" }}>Cancel</span>
                      </IconButton>
                    </Stack>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {/* <IconButton aria-label="Reply">
                    <Reply />
                    <span style={{ fontSize: "0.6em" }}>Reply</span>
                  </IconButton> */}
                    <IconButton
                      aria-label="Edit"
                      onClick={() => {
                        console.log("Editing comment ID:", comment.id);
                        handleDetailFeedBack(comment.id);
                      }}
                    >
                      <Tooltip title="Edit" arrow>
                        <EditNote />
                      </Tooltip>
                    </IconButton>
                    <IconButton
                      aria-label="Delete"
                      onClick={handleDeleteCommentClick(comment.id)}
                    >
                      <Tooltip title="Delete" arrow>
                        <Delete />
                      </Tooltip>
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
                          <Box
                            sx={{
                              backgroundColor: "#c2c2c290",
                              p: 2,
                              boxSizing: "content-box",
                              borderRadius: 6,
                              width: "fit-content",
                            }}
                          >
                            <Stack flexDirection={"row"} alignItems={"center"}>
                              <Typography variant="h6">
                                {reply.user.lastName} {reply.user.firstName}
                              </Typography>
                              <small style={{ marginLeft: "10px" }}>
                                {formatDate(reply.createdAt)}
                              </small>{" "}
                            </Stack>
                            <p>{reply.comment}</p>
                          </Box>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </Stack>
          ))}
      </Stack>
      <div
        style={{ backgroundColor: "#f2f2f2", padding: "1rem", margin: "1rem" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h4 style={{ color: "#666666", fontWeight: "bold" }}>Add Comment</h4>
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
    </Stack>
  );
};

export default CommentSolution;
