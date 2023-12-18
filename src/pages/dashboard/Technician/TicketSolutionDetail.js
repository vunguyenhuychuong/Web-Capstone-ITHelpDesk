import React, { useEffect, useState } from "react";
import "../../../assets/css/ticket.css";
import "../../../assets/css/ServiceTicket.css";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import {
  ArrowBack,
  Feedback,
  Lock,
  LockOpen,
  Square,
  TipsAndUpdates,
  WorkHistory,
} from "@mui/icons-material";
import CommentSolution from "./CommentSolution.js/CommentSolution";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import CountBox from "../../helpers/CountBox";
import useSolutionTicketData from "./SolutionTicketData";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate } from "../../helpers/FormatDate";
import {
  approveTicketSolution,
  changePublicSolution,
  rejectTicketSolution,
} from "../../../app/api/ticketSolution";
import { toast } from "react-toastify";
import { getRoleName } from "../../helpers/tableComlumn";
import { Button } from "flowbite-react";
import { useSelector } from "react-redux";
import UploadComponent from "../../helpers/UploadComponent";
import { FaEye } from "react-icons/fa";

const TicketSolutionDetail = () => {
  const [value, setValue] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const { loading, data, dataCategories, error, refetch } =
    useSolutionTicketData(solutionId);

  const associationsRequesterCount = 42;
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const [fileName, setFileName] = useState("");
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [views, setViews] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenEditTicketSolution = () => {
    navigate(`/home/editSolution/${solutionId}`);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setFileName(file.name);
    }
  };
  
  useEffect(() => {
    setViews((prevViews) => prevViews + 1);
  }, []);

  const handleBackTicketSolution = () => {
    navigate("/home/ticketSolution");
    refetch();
  };

  const handleClickChangePublic = async (solutionId) => {
    try {
      await changePublicSolution(solutionId);
      toast.success("Change Ticket Solution public");
      refetch();
    } catch (error) {
      console.log("Error while changing public", error);
    }
  };

  const handleApproveTicketSolution = async () => {
    try {
      await approveTicketSolution(solutionId);
      toast.success("Approve Ticket Solution");
      refetch();
    } catch (error) {
      console.log("Error while Approve ticket solution", error);
    }
  };

  const handleRejectTicketSolution = async () => {
    try {
      await rejectTicketSolution(solutionId);
      toast.success("Reject Ticket Solution");
      refetch();
    } catch (error) {
      console.log("Error while reject ticket solution ", error);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleImageDialogOpen = () => {
    setOpenImageDialog(true);
  };

  const handleImageDialogClose = () => {
    setOpenImageDialog(false);
  };

  return (
    <Grid
      container
      style={{
        border: "1px solid #ccc",
        paddingRight: "10px",
        paddingLeft: "10px",
      }}
    >
      <Grid item xs={9} style={{ paddingRight: "12px" }}>
        <MDBCol md="12">
          <MDBRow className="border-box" style={{ backgroundColor: "#EEEEEE" }}>
            <MDBCol md="1" className="mt-2">
              <div className="d-flex align-items-center">
                <button type="button" className="btn btn-link icon-label">
                  <ArrowBack
                    onClick={handleBackTicketSolution}
                    style={{ color: "#0099FF" }}
                  />
                </button>
              </div>
            </MDBCol>
            <MDBCol md="2" className="mt-2">
              <div className="d-flex align-items-center">
                {userRole === 2 ? (
                  <Button
                    type="button"
                    className="btn btn-link narrow-input"
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "5px",
                      paddingLeft: "10px",
                      height: "45px",
                      padding: "10px 0",
                      marginBottom: "10px",
                    }}
                    onClick={() => handleOpenEditTicketSolution()}
                  >
                    <span
                      className="action-menu-item"
                      style={{ fontSize: "16px", textTransform: "none" }}
                    >
                      Edit
                    </span>
                  </Button>
                ) : null}
                {userRole === 2 ? (
                  <>
                    <Button
                      type="button"
                      className="btn btn-link narrow-input"
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                        paddingLeft: "10px",
                        height: "45px",
                        padding: "10px 0",
                        marginBottom: "10px",
                        color: "#0099FF", 
                      }}
                      onClick={() => handleClickChangePublic(solutionId)}
                    >
                      <span
                        className="action-menu-item"
                        style={{ fontSize: "16px", textTransform: "none" }}
                      >
                        {data.isPublic ? "Private" : "Public"}
                      </span>
                    </Button>

                    {userRole === 2 && (
                      <>
                        <Button
                          type="button"
                          className="btn btn-link narrow-input"
                          style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "5px",
                            height: "45px",
                            padding: "10px 0",
                            marginBottom: "10px",
                            color: "#28a745", 
                          }}
                          onClick={() =>
                            handleApproveTicketSolution(solutionId)
                          }
                        >
                          <span
                            className="action-menu-item"
                            style={{ fontSize: "16px", textTransform: "none", marginLeft: "5px",marginLeft: "auto",
                            marginRight: "auto",}}
                          >
                            Approve
                          </span>
                        </Button>

                        <Button
                          type="button"
                          className="btn btn-link narrow-input"
                          style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "5px",
                            paddingLeft: "10px",
                            height: "45px",
                            padding: "10px 0",
                            marginBottom: "10px",
                            color: "#dc3545", 
                          }}
                          onClick={() => handleRejectTicketSolution(solutionId)}
                        >
                          <span
                            className="action-menu-item"
                            style={{ fontSize: "16px", textTransform: "none" }}
                          >
                            Reject
                          </span>
                        </Button>
                      </>
                    )}
                  </>
                ) : null}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBRow className="mb-4">
          <MDBCol
            md="10"
            className="mt-2"
            style={{ display: "flex", alignItems: "center" }}
          >
            <div className="circular-container" style={{ marginRight: "10px" }}>
              <TipsAndUpdates size="2em" style={{ color: "#FFCC33" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ marginBottom: "5px", fontSize: "1.5em" }}>
                {data.title}
              </span>
              <span style={{ fontSize: "0.8em" }}>
                <span>Topic: </span>{" "}
                <span className="bold-text">
                  {dataCategories.find(
                    (category) => category.id === data.categoryId
                  )?.name || "Unknown Category"}
                </span>
              </span>
            </div>
          </MDBCol>
        </MDBRow>
        <Grid item xs={12}>
          <div className="labelContainer">
            <Typography
              variant="subtitle1"
              color="textSecondary"
              className="descriptionLabel"
              style={{
                fontSize: "1.2em",
                fontWeight: "bold",
                color: "#007bff",
              }}
            >
              Description
            </Typography>
            <ArrowBack className="icon" />
          </div>
          <TextField
            id="description"
            name="description"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={data?.content || ""}
            disabled
            InputProps={{
              style: { fontSize: "1.5em" },
            }}
          />
          <UploadComponent />
        </Grid>
        <div className="buttonContainer">
          {data.attachmentUrl && (
            <Button
              variant="contained"
              className="button"
              onClick={handleImageDialogOpen}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              See Image
            </Button>
          )}
        </div>

        <Box sx={{ width: "100%" }}>
          <Tabs
            onChange={handleTabChange}
            value={value}
            aria-label="Tabs where selection follows focus"
            selectionFollowsFocus
            sx={{
              "& .MuiTabs-root": {
                color: "#007bff",
              },
            }}
          >
            <Tab
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textTransform: "none",
                  }}
                >
                  <Feedback sx={{ marginRight: 1 }} /> Feedback
                </div>
              }
              className="custom-tab-label"
            />
            <Tab
              label={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    textTransform: "none",
                  }}
                >
                  <WorkHistory sx={{ marginRight: 1 }} /> History
                </div>
              }
              className="custom-tab-label"
            />
          </Tabs>
          <Box role="tabpanel" hidden={value !== 0}>
            {value === 0 ? (
              <CommentSolution data={data} refetch={refetch} />
            ) : (
              <LoadingSkeleton />
            )}
          </Box>
          {/* <Box role="tabpanel" hidden={value !== 1}>
            {value === 1 ? <HistorySolution /> : <LoadingSkeleton />}
          </Box> */}
        </Box>
      </Grid>
      <Grid
        item
        xs={3}
        style={{
          paddingBottom: "10px",
          borderLeft: "1px solid #ccc",
          paddingLeft: "11px",
        }}
      >
        <MDBRow className="border-box" style={{ backgroundColor: "#EEEEEE" }}>
          <MDBCol md="12">
            <div className="d-flex">
              <h2
                className="heading-padding"
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#007bff",
                }}
              >
                More
              </h2>
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4 mt-4">
          <MDBRow className="mb-4">
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 font-weight-bold">
                Solution ID:
              </div>
              <div className="data-col col-md-8">{data.id}</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 font-weight-bold">
                Approval Status:
              </div>
              <div className="data-col col-md-8">
                {data.isApproved ? (
                  <>
                    <Square
                      className="square-icon"
                      style={{ color: "green" }}
                    />
                    <span className="text-success">Approved</span>
                  </>
                ) : (
                  <>
                    <Square className="square-icon" />
                    <span className="text-danger">Not Approved</span>
                  </>
                )}
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 font-weight-bold">Type:</div>
              <div className="data-col col-md-8">{data.type}</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 font-weight-bold">
                Visibility:
              </div>
              <div className="data-col col-md-8">
                {data.isPublic ? (
                  <>
                    <LockOpen
                      className="square-icon"
                      style={{ color: "green" }}
                    />
                    <span className="text-success">Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="square-icon" />{" "}
                    <span className="text-danger">Private</span>
                  </>
                )}
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 font-weight-bold">
                Review Date:
              </div>
              <div className="data-col col-md-8">
                {formatDate(data.reviewDate)}
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 font-weight-bold">
                Expiry Date:
              </div>
              <div className="data-col col-md-8">
                {formatDate(data.expiredDate)}
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 font-weight-bold">Views:</div>
              <div className="data-col col-md-8">{views} <FaEye /> </div>
            </MDBCol>
          </MDBRow>
        </MDBRow>

        <MDBRow
          className="mb-4 mt-4"
          style={{ border: "1px solid #ccc", padding: "5px" }}
        >
          <MDBRow className="mb-4">
            <MDBCol md="12" className="mt-2 text-box">
              <div
                className="label-col col-md-5 "
                style={{ fontWeight: "bold" }}
              >
                Created By
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-12">
                <span style={{ color: "#3399FF" }}>
                  {data.owner && data.owner.role
                    ? getRoleName(data.owner.role)
                    : "Unknown Role"}
                </span>{" "}
                {data.owner ? formatDate(data.owner.createdAt) : "Unknown Date"}
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div
                className="label-col col-md-5 "
                style={{ fontWeight: "bold" }}
              >
                Last Updated By
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-12">
                <span style={{ color: "#3399FF" }}>
                  {data.owner && data.owner.role
                    ? getRoleName(data.owner.role)
                    : "Unknown Role"}
                </span>{" "}
                {data.owner ? formatDate(data.modifiedAt) : "Unknown Date"}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBRow>

        <MDBRow className="mb-4 mt-4">
          <MDBRow className="mb-4">
            <MDBCol md="12" className="mt-2 text-box">
              <div className="col-md-5 " style={{ fontWeight: "bold" }}>
                Associations
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className=" col-md-11">Associations Requester</div>
              <CountBox count={associationsRequesterCount} />
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="col-md-11">Associations Problems</div>
              <CountBox count={associationsRequesterCount} />
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="col-md-11">Linked Solutions</div>
              <CountBox count={associationsRequesterCount} />
            </MDBCol>
          </MDBRow>
        </MDBRow>
      </Grid>
      <Dialog
        open={openImageDialog}
        onClose={handleImageDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Image</DialogTitle>
        <DialogContent>
          <div
            style={{
              background: `url(${data.attachmentUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "100%",
              height: "70vh",
            }}
          ></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default TicketSolutionDetail;
