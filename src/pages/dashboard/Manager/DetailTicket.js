import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow, MDBTable, MDBTableBody } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "../../../assets/css/EditTicket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import CategoryApi from "../../../app/api/category";
import ModeApi from "../../../app/api/mode";
import { FaTicketAlt } from "react-icons/fa";
import {
  ArrowBack,
  ArrowRight,
  AssignmentLate,
  AssignmentTurnedIn,
  ChatOutlined,
  Feedback,
  MessageSharp,
  Task,
  WorkHistory,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import useTicketData from "./useTicketData";
import AssignTicketModal from "./AssignTicketModal";
import { Avatar, Button, Grid, Stack, Tab, Tabs } from "@mui/material";
import {
  TicketStatusOptions,
  getGenderById,
  getPriorityOptionById,
  roleOptions,
} from "../../helpers/tableComlumn";
import { formatDate } from "../../helpers/FormatDate";
import { Box } from "@mui/system";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import Details from "./Details";
import { stringAvatar } from "../../../components/dashboard/Navbar";
import { useSelector } from "react-redux";
import {
  CancelTicketUser,
  ChangeStatusTicket,
  CloseTicketUser,
} from "../../../app/api/ticket";
import TicketLogList from "../Customer/TicketLogList";
import TicketTaskList from "../Technician/TicketTaskList";

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
    ? `${data.requester.lastName || ""} ${data.requester.firstName || ""}`
    : "";
  const ticketStatus = data.ticketStatus;
  const statusOption = TicketStatusOptions.find(
    (option) => option.id === ticketStatus
  );
  const badgeStyle = statusOption?.badgeStyle || {};
  const icon = statusOption?.icon || null;
  const name = statusOption?.name || "";
  const ticketPriority = data.priority;
  const priorityOption = getPriorityOptionById(ticketPriority);
  const [allowEdit, setAllowEdit] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [editMessage, setEditMessage] = useState("");

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

  const handleCancelTicket = async (ticketId) => {
    try {
      await CancelTicketUser(ticketId);
      navigate("/home/requestCustomerList");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      await CloseTicketUser(ticketId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenEditTicket = (ticketId) => {
    if (userRole === 1 && ticketStatus === 0) {
      navigate(`/home/editTicketCustomer/${ticketId}`);
    } else if (userRole === 2 || userRole === 3) {
      navigate(`/home/editTicket/${ticketId}`);
    }
  };

  const handleTicketStatusChange = async () => {
    try {
      await ChangeStatusTicket(ticketId, selectedStatus);
    } catch (error) {
      console.log("Error changing ticket status:", error);
    }
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
    if (
      userRole === 2 ||
      userRole === 3 ||
      (userRole === 1 && ticketStatus === 0)
    ) {
      setAllowEdit(true);
      setEditMessage("");
    } else {
      setAllowEdit(false);
      setEditMessage("Not allowed to edit when the ticket status is assigned");
    }
    fetchDataManager();
    setValue(0);
  }, [userRole, ticketStatus]);

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
                <Stack direction={"row"} alignItems={"center"}>
                  <Button>
                    <ArrowBack
                      onClick={handleGoBack}
                      style={{ color: "#0099FF" }}
                    />
                  </Button>
                </Stack>
              </MDBCol>
              <MDBCol md="11">
                <Stack
                  direction={"row"}
                  spacing={2}
                  py={1}
                  alignItems={"center"}
                >
                  {userRole === 1 && (
                    <>
                      <Button
                        sx={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "5px",
                        }}
                        onClick={() => handleCancelTicket(ticketId)}
                      >
                        Cancel
                      </Button>
                      <Button
                        sx={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "5px",
                        }}
                        onClick={() => handleCloseTicket(ticketId)}
                      >
                        Close
                      </Button>
                    </>
                  )}
                  <Button
                    sx={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "5px",
                    }}
                    onClick={() => handleOpenEditTicket(ticketId)}
                    disabled={!allowEdit}
                  >
                    Edit
                  </Button>
                  {userRole === 2 || userRole === 3 ? (
                    <select
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(Number(e.target.value))
                      }
                      disabled={!allowEdit}
                      className="custom-select-status"
                    >
                      {TicketStatusOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  ) : null}
                  {userRole === 2 || userRole === 3 ? (
                    <button
                      type="button"
                      className="btn btn-link narrow-input icon-label mt-2"
                      onClick={handleTicketStatusChange}
                    >
                      Submit Status
                    </button>
                  ) : null}
                  {userRole === 2 ? (
                    <MDBCol md="2" className="mt-2">
                      <div className="d-flex align-items-center">
                        <button
                          type="button"
                          className="btn btn-link narrow-input icon-label"
                          onClick={handleOpenAssignTicket}
                        >
                          Assign
                        </button>
                      </div>
                    </MDBCol>
                  ) : null}
                  {editMessage && (
                    <div style={{ marginLeft: "20px", color: "red" }}>
                      {editMessage}
                    </div>
                  )}
                </Stack>
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
                  Created by{" "}
                  <span className="bold-text">
                    {roleName && roleName.name ? roleName.name : "-"}
                  </span>{" "}
                  <ChatOutlined color="#007bff" /> on:
                  {formatDate(data.createdAt)}
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
              {userRole !== 1 && (
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
              )}
            </Tabs>
            <Box role="tabpanel" hidden={value !== 0}>
              {value === 0 ? (
                <Details
                  data={data}
                  loading={loading || false}
                  dataCategories={dataCategories}
                  dataMode={dataMode}
                />
              ) : (
                <LoadingSkeleton />
              )}
            </Box>
            <Box role="tabpanel" hidden={value !== 1}>
              {value === 1 ? <TicketLogList /> : <LoadingSkeleton />}
            </Box>
            <Box role="tabpanel" hidden={value !== 2}>
              {value === 2 ? <TicketTaskList /> : <LoadingSkeleton />}
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
                <div className="label-col col-md-4 ">Priority</div>
                <div className="data-col col-md-8">
                  <span
                    className={`badge ${priorityOption.colorClass} rounded-pill`}
                    style={{ fontSize: priorityOption.fontSize }}
                  >
                    {priorityOption.name}
                  </span>
                </div>
              </MDBCol>
              <MDBCol md="12" className="mt-2 text-box">
                <div className="label-col col-md-4 ">Stage</div>
                <div className="data-col col-md-6">
                  <span style={badgeStyle}>
                    {icon}
                    {name}
                  </span>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBRow>
          <MDBRow className="mb-2">
            <MDBCol md="12" className=" mt-2">
              {data.assignment ? (
                <label className="narrow-input description-label">
                  <AssignmentTurnedIn
                    style={{ color: "#3399FF", marginLeft: 10, marginLeft: 5 }}
                  />
                  Ticket have been Assigned
                </label>
              ) : (
                <label className="narrow-input description-label">
                  <AssignmentLate
                    style={{ color: "#FFCC33", marginLeft: 10, marginLeft: 5 }}
                  />
                  Ticket not Assigned yet
                </label>
              )}
            </MDBCol>
            <MDBCol md="12">
              <ArrowRight />
              Name:{" "}
              {data.assignment && data.assignment.technicianFullName
                ? data.assignment.technicianFullName
                : "N/A"}
            </MDBCol>
            <MDBCol md="12" className=" mt-2">
              <ArrowRight />
              Email:{" "}
              {data.assignment && data.assignment.technicianEmail
                ? data.assignment.technicianEmail
                : "N/A"}
            </MDBCol>
            <MDBCol md="12" className=" mt-2">
              <ArrowRight />
              Phone:{" "}
              {data.assignment && data.assignment.technicianPhoneNumber
                ? data.assignment.technicianPhoneNumber
                : "N/A"}
            </MDBCol>
            <MDBCol md="12" className=" mt-2">
              <ArrowRight />
              Team:{" "}
              {data.assignment && data.assignment.teamName
                ? data.assignment.teamName
                : "N/A"}
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
                      {data.requester && data.requester.lastName
                        ? `${data.requester.lastName} `
                        : ""}
                      {data.requester && data.requester.firstName
                        ? `${data.requester.firstName} `
                        : ""}
                      <MessageSharp style={{ color: "#3399FF" }} />{" "}
                    </p>
                  </>
                ) : (
                  <p className="text-muted">User Information Not have</p>
                )}
              </div>
            </MDBCol>
            <MDBTable bordered>
              <MDBTableBody>
                <tr>
                  <th
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#007bff",
                    }}
                  >
                    ID
                  </th>
                  <th>
                    {data.requester && data.requester.id
                      ? data.requester.id
                      : "-"}
                  </th>
                </tr>
                <tr>
                  <th
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#007bff",
                    }}
                  >
                    Name
                  </th>
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
                  <th
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#007bff",
                    }}
                  >
                    UserName
                  </th>
                  <th>
                    {data.requester && data.requester.username
                      ? `${data.requester.username} `
                      : ""}{" "}
                  </th>
                </tr>
                <tr>
                  <th
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#007bff",
                    }}
                  >
                    Phone
                  </th>
                  <th>
                    {data.requester && data.requester.phoneNumber
                      ? data.requester.phoneNumber
                      : "-"}
                  </th>
                </tr>
                <tr>
                  <th
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#007bff",
                    }}
                  >
                    Email
                  </th>
                  <th>
                    {data.requester && data.requester.email
                      ? data.requester.email
                      : "-"}
                  </th>
                </tr>

                <tr>
                  <th
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#007bff",
                    }}
                  >
                    Gender
                  </th>
                  <th>
                    {data.requester && getGenderById(data.requester.gender)
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
    </section>
  );
};

export default DetailTicket;
