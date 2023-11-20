import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow, MDBTable, MDBTableBody } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "../../../assets/css/EditTicket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import CategoryApi from "../../../app/api/category";
import ModeApi from "../../../app/api/mode";
import { FaPlus, FaTicketAlt } from "react-icons/fa";
import {
  ArrowBack,
  ArrowRight,
  ChatOutlined,
  Feedback,
  MessageSharp,
  Square,
  Task,
  WorkHistory,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import useTicketData from "./useTicketData";
import AssignTicketModal from "./AssignTicketModal";
import { Avatar, Grid, Tab, Tabs } from "@mui/material";
import {
  getGenderById,
  priorityOption,
  roleOptions,
} from "../../helpers/tableComlumn";
import { formatDate } from "../../helpers/FormatDate";
import { Box } from "@mui/system";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import Details from "./Details";
import TicketTaskList from "../Technician/TicketTaskList";
import { stringAvatar } from "../../../components/dashboard/Navbar";
import { useSelector } from "react-redux";
import AccessibleTable from "../Technician/CommentSolution.js/HistorySolution";

const DetailTicket = () => {
  const { ticketId } = useParams();
  const { data, loading, setData } = useTicketData(ticketId);
  const [dataCategories, setDataCategories] = useState([]);
  const [dataMode, setDataMode] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const userName = data.requester
    ? `${data.requester.lastName} ${data.requester.firstName}`
    : "";

  const fetchDataManager = async () => {
    try {
      const fetchCategories = await CategoryApi.getAllCategories();
      const fetchModes = await ModeApi.getMode();
      setDataCategories(fetchCategories);
      setDataMode(fetchModes);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenEditTicket = (ticketId) => {
    navigate(`/home/editTicket/${ticketId}`);
  };

  const handleOpenAssignTicket = () => {
    setDialogOpen(true);
  };

  const handleCloseAssignTicket = () => {
    setDialogOpen(false);
  };

  const handleGoBack = () => {
    if (userRole === 2) {
      navigate(`/home/homeManager?tab=1`);
    } else if (userRole === 3) {
      navigate(`/home/homeTechnician?tab=1`);
    } else if (userRole === 1) {
      navigate(`/home/requestCustomerList`);
    }
  };

  useEffect(() => {
    fetchDataManager();
    setValue(0);
  }, []);

  const roleName =
    data.requester && data.requester.role
      ? roleOptions.find((role) => role.id === data.requester.role)
      : null;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section style={{ backgroundColor: "#fff" }}>
      <Grid
        container
        style={{
          border: "1px solid #ccc",
          paddingRight: "10px",
          paddingLeft: "10px",
        }}
      >
        <Grid
          item
          style={{
            flex: 1,
            paddingLeft: "10px",
          }}
        >
          <MDBCol md="12">
            <MDBRow className="border-box-detail">
              <MDBCol md="1" className="mt-2">
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-link icon-label">
                    <ArrowBack onClick={handleGoBack} />
                  </button>
                </div>
              </MDBCol>
              <MDBCol md="2" className="mt-2">
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-link narrow-input icon-label"
                    onClick={() => handleOpenEditTicket(ticketId)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-link narrow-input icon-label"
                    onClick={handleOpenAssignTicket}
                  >
                    Assign
                  </button>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <MDBRow className="mb-4">
            <MDBCol
              md="12"
              className="mt-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                className="circular-container"
                style={{ marginRight: "10px" }}
              >
                <FaTicketAlt size="2em" color="#007bff" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ marginBottom: "5px", fontSize: "1.5em" }}>
                  #{data.requesterId} {data.title}
                </span>
                <span style={{ fontSize: "0.8em" }}>
                  by{" "}
                  <span className="bold-text">
                    {roleName && roleName.name ? roleName.name : "Unknown Role"}
                  </span>{" "}
                  <ChatOutlined color="#007bff" /> on:
                  {formatDate(data.scheduledStartTime)} |
                  <span className="bold-text">DueBy:</span>{" "}
                  {formatDate(data.scheduledEndTime)}
                </span>
              </div>
            </MDBCol>
          </MDBRow>
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
                    <Feedback sx={{ marginRight: 1 }} /> Details
                  </div>
                }
                className="custom-tab-label"
              />
              {userRole === 2 || userRole === 3 ? ( 
                <>
                  <Tab
                    label={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          textTransform: "none",
                        }}
                      >
                        <Task sx={{ marginRight: 1 }} /> Task
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
                        <WorkHistory sx={{ marginRight: 1 }} /> Ticket Log
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
                        <WorkHistory sx={{ marginRight: 1 }} /> Checklist
                      </div>
                    }
                    className="custom-tab-label"
                  />
                </>
              ) : null}
            </Tabs>
            <Box role="tabpanel" hidden={value !== 0}>
              {value === 0 ? (
                <Details
                  data={data}
                  loading={loading}
                  dataCategories={dataCategories}
                  dataMode={dataMode}
                />
              ) : (
                <LoadingSkeleton />
              )}
            </Box>
            <Box role="tabpanel" hidden={value !== 1}>
              {value === 1 ? <TicketTaskList /> : <LoadingSkeleton />}
            </Box>
            <Box role="tabpanel" hidden={value !== 2}>
              {value === 2 ? (
                <AccessibleTable ticketId={ticketId} />
              ) : (
                <LoadingSkeleton />
              )}
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={2}
          style={{
            paddingBottom: "10px",
            borderLeft: "1px solid #ccc",
            paddingLeft: "11px",
          }}
        >
          <MDBRow className="border-box">
            <MDBCol md="12">
              <div className="d-flex">
                <h2 className="heading-padding">More</h2>
              </div>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4 mt-4">
            <MDBRow className="mb-4">
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
                <div className="label-col col-md-4 ">Priority</div>
                <div className="data-col col-md-8">
                  {priorityOption.find(
                    (priority) => priority.id === data.priority
                  )?.name || "Unknown Priority"}
                </div>
              </MDBCol>
              <MDBCol md="12" className="mt-2 text-box">
                <div className="label-col col-md-4 ">Technician</div>
                {/* {data.assignment.technicianId} */}
              </MDBCol>
            </MDBRow>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="12" className=" mt-2">
              <label className="narrow-input description-label">
                <FaPlus
                  style={{ color: "#3399FF", marginLeft: 10, marginBottom: 5 }}
                />
                Share Request
              </label>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="12" className=" mt-2">
              <label className="narrow-input">
                <ArrowRight /> Associate Problems
              </label>
            </MDBCol>
            <MDBCol md="12" className=" mt-2">
              <label className="narrow-input">
                <ArrowRight /> Associate Change
              </label>
            </MDBCol>
            <MDBCol md="12" className=" mt-2">
              <label className="narrow-input">
                <ArrowRight /> Associate Project
              </label>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="12" className=" mt-2 description-label">
              <label className="narrow-input">Tags</label>
              <label className="narrow-input">No tag added</label>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol
              md="12"
              className="d-flex align-items-center mt-2 description-label"
            >
              <Avatar
                alt="User Avatar"
                {...stringAvatar(userName)}
                className="img-avatar"
              />
              <div className="ms-3">
                {data.requester && data.requester.username ? (
                  <>
                    <p className="fw-bold mb-1">
                      {data.requester.username}{" "}
                      <MessageSharp style={{ color: "#3399FF" }} />{" "}
                    </p>
                    <p className="text-muted mb-0">Requests(2) | Assets</p>
                  </>
                ) : (
                  <p className="text-muted">Username not available</p>
                )}
              </div>
            </MDBCol>
            <MDBTable bordered>
              <MDBTableBody>
                <tr>
                  <th>ID</th>
                  <th>
                    {data.requester && data.requester.id
                      ? data.requester.id
                      : "-"}
                  </th>
                </tr>
                <tr>
                  <th>Name</th>
                  <th>
                    {data.requester && data.requester.lastName
                      ? data.requester.lastName
                      : "-"}{" "}
                    {data.requester && data.requester.firstName
                      ? data.requester.firstName
                      : "-"}
                  </th>
                </tr>
                <tr>
                  <th>Phone</th>
                  <th>
                    {data.requester && data.requester.phoneNumber
                      ? data.requester.phoneNumber
                      : "-"}
                  </th>
                </tr>
                <tr>
                  <th>Address</th>
                  <th>
                    {data.requester && data.requester.address
                      ? data.requester.address
                      : "-"}
                  </th>
                </tr>
                <tr>
                  <th>BirthDay</th>
                  <th>
                    {formatDate(data.requester) &&
                    formatDate(data.requester.dateOfBirth)
                      ? formatDate(data.requester.dateOfBirth)
                      : "-"}
                  </th>
                </tr>
                <tr>
                  <th>Gender</th>
                  <th>
                    {data.requester && data.requester.gender
                      ? getGenderById(data.requester.gender)
                      : "-"}
                  </th>
                </tr>
              </MDBTableBody>
            </MDBTable>
          </MDBRow>
        </Grid>
      </Grid>

      <AssignTicketModal
        open={dialogOpen}
        onClose={handleCloseAssignTicket}
        ticketId={ticketId}
      />

      {/* <button
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "50%",
          left: isSidebarVisible ? "0" : "-50px", // Move button out of the viewport when sidebar is hidden
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
      </button> */}
    </section>
  );
};

export default DetailTicket;
