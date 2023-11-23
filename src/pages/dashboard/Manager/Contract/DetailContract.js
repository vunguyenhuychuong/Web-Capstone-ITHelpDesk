import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow, MDBTable, MDBTableBody } from "mdb-react-ui-kit";
import "../../../../assets/css/ticket.css";
import "../../../../assets/css/EditTicket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
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
import useTicketData from "../useTicketData";
import AssignTicketModal from "../AssignTicketModal";
import { Avatar, Grid, Tab, Tabs } from "@mui/material";
import { formatDate } from "../../../helpers/FormatDate";
import { Box } from "@mui/system";
import LoadingSkeleton from "../../../../components/iconify/LoadingSkeleton";
import TicketTaskList from "../../Technician/TicketTaskList";
import { stringAvatar } from "../../../../components/dashboard/Navbar";
import { useSelector } from "react-redux";
import useContractData from "../useContractData";
import Details from "../Details";

const DetailContract = () => {
  const { contractId } = useParams();
  const { data, loading, setData } = useContractData(contractId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const ticketStatus = data.status;
  const [allowEdit, setAllowEdit] = useState(false);
  const [editMessage, setEditMessage] = useState("");

  const fetchDataManager = async () => {
    try {
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const handleTabChange = (event, newValue) => {
    console.log("New Tab Value:", newValue);
    setValue(newValue);
  };

  const handleOpenEditTicket = (contractId) => {
    if (userRole === 1) {
      navigate(`/home/editTicketCustomer/${contractId}`);
    } else if (userRole === 3) {
      navigate(`/home/editTicket/${contractId}`);
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
    if (ticketStatus === 0 && (userRole === 2 || userRole === 3)) {
      setAllowEdit(true);
      setEditMessage("");
    } else {
      setAllowEdit(false);
      setEditMessage(" Not allowed edited when it turn status assign");
    }
    fetchDataManager();
    setValue(0);
  }, [ticketStatus]);

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
              <MDBCol md="5">
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-link narrow-input icon-label mt-2"
                    onClick={() => handleOpenEditTicket(contractId)}                  
                  >
                    Edit
                  </button>
                  {userRole === 2 || userRole === 3 ? (
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
                  #{data.id} {data.name || "null Name"}
                </span>
                <span style={{ fontSize: "0.8em" }}>
                  Status: <span style={{ color: "red" }}>{data.status}</span>
                  <span className="bold-text">
                  </span>{" "}
                  <ChatOutlined color="#007bff" />              
                  <span className="bold-text"> Valid till:</span>{" "}
                  {formatDate(data.endDate)}
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
                    <Feedback sx={{ marginRight: 1 }} /> Contract Details
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
                    <Task sx={{ marginRight: 1 }} /> Payment
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
                    <WorkHistory sx={{ marginRight: 1 }} /> Child Contract
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
                    <WorkHistory sx={{ marginRight: 1 }} /> Renewal Details
                  </div>
                }
                className="custom-tab-label"
              />
            </Tabs>
            <Box role="tabpanel" hidden={value !== 0}>
            {value === 0 ? (
                <Details
                  data={data}
                  loading={loading || false}
                />
              ) : (
                <LoadingSkeleton />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <AssignTicketModal
        open={dialogOpen}
        onClose={handleCloseAssignTicket}
        ticketId={contractId}
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

export default DetailContract;
