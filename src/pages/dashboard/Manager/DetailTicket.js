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
import {
  Avatar,
  Button,
  Grid,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
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
  const {
    data,
    loading,
    setData,
    fetchData: refetch,
  } = useTicketData(ticketId);
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchDataManager = async () => {
    try {
      const fetchCategories = await CategoryApi.getAllCategories();
      const fetchModes = await ModeApi.getMode();
      setDataCategories(fetchCategories?.data);
      setDataMode(fetchModes);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const handleCancelTicket = async (ticketId) => {
    try {
      await CancelTicketUser(ticketId);
    } catch (error) {
      console.log(error);
    } finally {
      refetch();
    }
  };

  const handleCloseTicket = async (ticketId) => {
    try {
      await CloseTicketUser(ticketId);
    } catch (error) {
      console.log(error);
    } finally {
      refetch();
    }
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenEditTicket = (ticketId) => {
    if (userRole === 1 && (ticketStatus === 0 || ticketStatus === 1)) {
      navigate(`/home/editTicketCustomer/${ticketId}`);
    } else if (userRole === 2 || userRole === 3) {
      navigate(`/home/editTicket/${ticketId}`);
    }
  };

  const handleTicketStatusChange = async (status) => {
    try {
      await ChangeStatusTicket(ticketId, status);
    } catch (error) {
      console.log("Error changing ticket status:", error);
    } finally {
      refetch();
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
      navigate(`/home/listTicket`);
    } else if (userRole === 3) {
      navigate(`/home/ticketAssign`);
    } else if (userRole === 1) {
      navigate(`/home/requestCustomerList`);
    }
  };

  useEffect(() => {
    if (
      (userRole === 1 && (ticketStatus === 0 || ticketStatus === 1)) ||
      userRole === 2 ||
      userRole === 3
    ) {
      setAllowEdit(true);
      setEditMessage("");
    } else {
      setAllowEdit(false);
      // setEditMessage("Not allowed to edit when the ticket status is assigned");
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
            <MDBRow
              className="border-box-detail"
              style={{ paddingTop: 4.5, paddingBottom: 4.5 }}
            >
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
                      {data.ticketStatus === 0 ||
                        (data.ticketStatus === 1 && (
                          <Button
                            sx={{
                              backgroundColor: "#FFFFFF",
                              borderRadius: "5px",
                            }}
                            onClick={() => handleOpenEditTicket(ticketId)}
                            disabled={!allowEdit}
                          >
                            Edit Ticket
                          </Button>
                        ))}
                      <Button
                        sx={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "5px",
                          display: data.ticketStatus > 1 ? "none" : "flex",
                        }}
                        onClick={() => handleCancelTicket(ticketId)}
                      >
                        Cancel
                      </Button>
                      <Button
                        sx={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: "5px",
                          display: data.ticketStatus !== 3 ? "none" : "flex",
                        }}
                        onClick={() => handleCloseTicket(ticketId)}
                      >
                        Close
                      </Button>
                    </>
                  )}
                  {userRole === 2 && (
                    <Button
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      onClick={() => handleOpenEditTicket(ticketId)}
                      disabled={!allowEdit}
                    >
                      Edit Ticket
                    </Button>
                  )}
                  {userRole === 3 && (
                    <Button
                      sx={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: "5px",
                      }}
                      onClick={() => setIsEditDialogOpen(true)}
                      disabled={!allowEdit}
                    >
                      Edit Properties
                    </Button>
                  )}
                  {/* {userRole === 2 || userRole === 3 ? (
                    <select
                      value={selectedStatus}
                      onChange={(e) =>
                        setSelectedStatus(Number(e.target.value))
                      }
                      disabled={!allowEdit}
                      className="custom-select-status"
                    >
                      {TicketStatusOptions?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  ) : null} */}
                  {userRole === 2 || userRole === 3
                    ? TicketStatusOptions.filter(
                        (status) =>
                          status.name !== "Close" && status.name !== "Cancelled"
                      )?.map((status) => (
                        <Button
                          sx={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "5px",
                            display: status.displayStatusId.includes(
                              data.ticketStatus
                            )
                              ? "flex"
                              : "none",
                          }}
                          onClick={() => handleTicketStatusChange(status.id)}
                        >
                          {status.name}
                        </Button>
                      ))
                    : null}
                  {userRole === 2 &&
                  data.ticketStatus !== 3 &&
                  data.ticketStatus !== 4 &&
                  data.ticketStatus !== 5 ? (
                    <MDBCol>
                      <div className="d-flex align-items-center">
                        <Button
                          sx={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: "5px",
                          }}
                          onClick={handleOpenAssignTicket}
                        >
                          Assign
                        </Button>
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
                  {data.title}
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
                  refetch={refetch}
                  isEditDialogOpen={isEditDialogOpen}
                  setIsEditDialogOpen={setIsEditDialogOpen}
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
          xs={3}
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
                  Other Information
                </h2>
              </div>
            </MDBCol>
          </MDBRow>
          <Stack marginY={3} spacing={2}>
            <Stack
              direction={"row"}
              width={"100%"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography fontWeight={"bold"}>Priority:</Typography>
              <span
                className={`badge ${priorityOption.colorClass} rounded-pill`}
                style={{ fontSize: priorityOption.fontSize }}
              >
                {priorityOption.name}
              </span>
            </Stack>
            <Stack
              direction={"row"}
              width={"100%"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography fontWeight={"bold"}>Stage:</Typography>
              <span style={badgeStyle}>
                {icon}
                {name}
              </span>
            </Stack>
          </Stack>
          <Stack marginY={3} spacing={2}>
            <Stack
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              sx={{ border: "solid 1px #c2c2c2", p: 1 }}
            >
              {data.assignment ? (
                <>
                  <AssignmentTurnedIn
                    style={{ color: "#3399FF", marginLeft: 10 }}
                  />
                  <Typography>Ticket have been assigned</Typography>
                </>
              ) : (
                <>
                  <AssignmentLate
                    style={{ color: "#FFCC33", marginLeft: 10 }}
                  />
                  <Typography>Ticket not assigned yet</Typography>
                </>
              )}
            </Stack>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack flexDirection={"row"} alignItems={"center"}>
                <ArrowRight />
                <Typography fontWeight={"bold"}> Name:</Typography>
              </Stack>
              <Typography>
                {data.assignment && data.assignment.technicianFullName
                  ? data.assignment.technicianFullName
                  : "N/A"}
              </Typography>
            </Stack>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack flexDirection={"row"} alignItems={"center"}>
                <ArrowRight />
                <Typography fontWeight={"bold"}> Email:</Typography>
              </Stack>
              <Typography>
                {data.assignment && data.assignment.technicianEmail
                  ? data.assignment.technicianEmail
                  : "N/A"}
              </Typography>
            </Stack>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack flexDirection={"row"} alignItems={"center"}>
                <ArrowRight />
                <Typography fontWeight={"bold"}> Phone:</Typography>
              </Stack>
              <Typography>
                {data.assignment && data.assignment.technicianPhoneNumber
                  ? data.assignment.technicianPhoneNumber
                  : "N/A"}
              </Typography>
            </Stack>
            <Stack
              flexDirection={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Stack flexDirection={"row"} alignItems={"center"}>
                <ArrowRight />
                <Typography fontWeight={"bold"}> Team:</Typography>
              </Stack>
              <Typography>
                {data.assignment && data.assignment.teamName
                  ? data.assignment.teamName
                  : "N/A"}
              </Typography>
            </Stack>
          </Stack>
          <MDBRow className="mb-4">
            <Stack sx={{ p: 1, border: "solid 1px #c2c2c2" }}>
              {data.requester && data.requester.username ? (
                <Stack flexDirection={"row"} justifyContent={"space-between"}>
                  <Stack flexDirection={"row"} alignItems={"center"}>
                    <MessageSharp style={{ color: "#3399FF" }} />
                    <Typography fontWeight={"bold"}>Requester:</Typography>
                  </Stack>
                  <Stack flexDirection={"row"} alignItems={"center"}>
                    <Typography>
                      {data.requester && data.requester.lastName
                        ? `${data.requester.lastName} `
                        : ""}
                      {data.requester && data.requester.firstName
                        ? `${data.requester.firstName} `
                        : ""}
                    </Typography>
                    <Avatar
                      alt="User Avatar"
                      {...stringAvatar(userName)}
                      className="img-avatar"
                    />
                  </Stack>
                </Stack>
              ) : (
                <p className="text-muted">User Information Not have</p>
              )}
            </Stack>
            <MDBTable bordered>
              <MDBTableBody>
                <tr>
                  <th
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: "#007bff",
                      textAlign: "center",
                    }}
                  >
                    ID
                  </th>
                  <th style={{ textAlign: "start" }}>
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
                      textAlign: "center",
                    }}
                  >
                    Name
                  </th>
                  <th style={{ textAlign: "start" }}>
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
                      textAlign: "center",
                    }}
                  >
                    UserName
                  </th>
                  <th style={{ textAlign: "start" }}>
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
                      textAlign: "center",
                    }}
                  >
                    Phone
                  </th>
                  <th style={{ textAlign: "start" }}>
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
                      textAlign: "center",
                    }}
                  >
                    Email
                  </th>
                  <th style={{ textAlign: "start" }}>
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
                      textAlign: "center",
                    }}
                  >
                    Gender
                  </th>
                  <th style={{ textAlign: "start" }}>
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
        refetch={refetch}
      />
    </section>
  );
};

export default DetailTicket;
