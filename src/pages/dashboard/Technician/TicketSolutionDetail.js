import React, { useState } from "react";
import "../../../assets/css/ticket.css";
import "../../../assets/css/ServiceTicket.css";
import { Box, Grid, MenuItem, Select, Tab, Tabs } from "@mui/material";
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

const TicketSolutionDetail = () => {
  const [value, setValue] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const { solutionId } = useParams();
  const navigate = useNavigate();
  const { loading, data, dataCategories, error, refetch } =
    useSolutionTicketData(solutionId);
  const associationsRequesterCount = 42;
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const [fileName, setFileName] = useState("");

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

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
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
                <Button
                  type="button"
                  className="btn btn-link narrow-input"
                  style={{
                    backgroundColor: "#f2f2f2",
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
                <Select
                  displayEmpty
                  value={selectedValue}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "Without label" }}
                  style={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: "5px",
                    paddingLeft: "10px",
                    height: "45px",
                    padding: "10px 0",
                    marginBottom: "10px",
                    zIndex: 9999,
                  }}
                >
                  {selectedValue !== "" ? null : (
                    <MenuItem value="" disabled>
                      <em className="action-menu-item">Action</em>
                    </MenuItem>
                  )}

                  <MenuItem
                    value={10}
                    onClick={() => handleClickChangePublic(solutionId)}
                  >
                    {data.isPublic ? <>Private</> : <>Public</>}
                  </MenuItem>

                  {userRole === 2 && [
                    <MenuItem
                      key={20}
                      value={20}
                      onClick={() => handleApproveTicketSolution(solutionId)}
                    >
                      Approve
                    </MenuItem>,
                    <MenuItem
                      key={30}
                      value={30}
                      onClick={() => handleRejectTicketSolution(solutionId)}
                    >
                      Reject
                    </MenuItem>,
                  ]}
                </Select>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBRow className="mb-4">
          <MDBCol
            md="6"
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
          <textarea
            type="text"
            id="description"
            name="description"
            className="form-control input-field-2"
            rows="6"
            defaultValue={data.content}
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{ marginBottom: "10px" }}>{fileName}</div>
          <input
            type="file"
            name="file"
            className="form-control input-field"
            id="attachmentUrl"
            onChange={handleFileChange}
          />
        </Grid>

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
            {value === 0 ? <CommentSolution /> : <LoadingSkeleton />}
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
              <h2 className="heading-padding">Solution</h2>
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4 mt-4">
          <MDBRow className="mb-4">
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 ">Solution ID</div>
              <div className="data-col col-md-8">{data.id}</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 ">Status</div>
              <div className="data-col col-md-8">
                {data.isApproved ? (
                  <>
                    <Square
                      className="square-icon"
                      style={{ color: "green" }}
                    />
                    <span>Approved</span>
                  </>
                ) : (
                  <>
                    <Square className="square-icon" />
                    <span>Not Approved</span>
                  </>
                )}
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 ">Type</div>
              <div className="data-col col-md-8">Solution</div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 "> Visibility</div>
              <div className="data-col col-md-8">
                {data.isPublic ? (
                  <>
                    <LockOpen
                      className="square-icon"
                      style={{ color: "green" }}
                    />{" "}
                    <span>Public</span>
                  </>
                ) : (
                  <>
                    <Lock className="square-icon" /> Private
                  </>
                )}
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4 ">Review Date</div>
              <div className="data-col col-md-8">
                {formatDate(data.reviewDate)}
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4">Expiry Date</div>
              <div className="data-col col-md-8">
                {formatDate(data.expiredDate)}
              </div>
            </MDBCol>
            <MDBCol md="12" className="mt-2 text-box">
              <div className="label-col col-md-4">Views</div>
              <div className="data-col col-md-8">1</div>
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
                  {getRoleName(data.owner.role)}
                </span>{" "}
                {formatDate(data.createdAt)}
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
                  {getRoleName(data.owner.role)}
                </span>{" "}
                {formatDate(data.modifiedAt)}
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
    </Grid>
  );
};

export default TicketSolutionDetail;
