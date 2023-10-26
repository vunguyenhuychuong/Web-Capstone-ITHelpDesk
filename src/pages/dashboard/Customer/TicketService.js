import React from "react";
import "../../../assets/css/ticket.css";
import "../../../assets/css/ServiceTicket.css";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Dialog, Grid, Tab, Tabs } from "@mui/material";
import { MDBCol, MDBRow, MDBTable, MDBTableBody } from "mdb-react-ui-kit";
import { ArrowBack, ChatOutlined } from "@mui/icons-material";
import { FaTicketAlt } from "react-icons/fa";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import TicketDetails from "./TicketMenuDetail.js/TicketDetails";
import TicketHistory from "./TicketMenuDetail.js/TicketHistory";
import TicketResolution from "./TicketMenuDetail.js/TicketSolution";
import useTicketData from "../Manager/useTicketData";
import { formatDate } from "../../helpers/FormatDate";
import { useState } from "react";
import ChangeIssues from "./ChangeIssues";

const TicketService = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const { ticketId } = useParams();
  const { data, loading, setData } = useTicketData(ticketId);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);


  const handleOpenDialog = (ticketId) => {
    setSelectedTicketId(ticketId);
    setDialogOpen(true);
  };
  const handleCloseChangeTicket = () => {
    setDialogOpen(false);
  }

  const handleGoBack = () => {
    navigate(`/home/customerTicket`);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container style={{ border: '1px solid #ccc', paddingRight: '20px',paddingLeft: '10px' }}>
      <Grid item xs={9} >
        <MDBCol md="12">
          <MDBRow className="border-box">
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
                  onClick={() => handleOpenDialog(ticketId)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-link narrow-input icon-label"
                >
                  Assign
                </button>
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
              <FaTicketAlt size="2em" color="#007bff" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ marginBottom: "5px", fontSize: "1.5em" }}>
                #{data.requesterId} {data.title}
              </span>
              <span style={{ fontSize: "0.8em" }}>
                by <span className="bold-text">Guest</span>{" "}
                <ChatOutlined color="#007bff" /> on: {formatDate(data.createdAt)}
                <span className="bold-text">DueBy:N/A</span>{" "}
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
            <Tab label="Detail" />
            <Tab label="Resolution" />
            <Tab label="History" />
          </Tabs>
          <Box role="tabpanel" hidden={value !== 0}>
            {value === 0 ? <TicketDetails ticketId={ticketId} /> : <LoadingSkeleton />}
          </Box>
          <Box role="tabpanel" hidden={value !== 1}>
            {value === 1 ? <TicketResolution /> : <LoadingSkeleton />}
          </Box>
          <Box role="tabpanel" hidden={value !== 2}>
            {value === 2 ? <TicketHistory /> : <LoadingSkeleton />}
          </Box>
        </Box>
      </Grid>
      <Grid item xs={3}>
        <MDBRow className="border-box">
          <MDBCol md="12">
            <div className="d-flex">
              <h2 className="heading-padding">More</h2>
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4">
          <MDBRow className="mb-4">
            <MDBCol md="12" className="mt-2 text-box">
              {/* <div className="status-container">
                <label>Status</label>
                <div
                  className={`status-badge ${
                    TicketStatusOptions[data.ticketStatus]?.colorClass ||
                    "bg-secondary"
                  }`}
                ></div>
                {TicketStatusOptions[data.ticketStatus]?.name ||
                  "Unknown Status"}
              </div> */}
              <div>Status</div>
            </MDBCol>
          </MDBRow>
        </MDBRow>
        <MDBRow className="mb-4">
          <MDBCol
            md="12"
            className="d-flex align-items-center mt-2 description-label"
          >
            <img
              src="https://mdbootstrap.com/img/new/avatars/8.jpg"
              alt=""
              className="img-avatar"
            />
            <div className="ms-3">
              <p className="fw-bold mb-1">Guest</p>
            </div>
          </MDBCol>
          <MDBTable bordered>
            <MDBTableBody>
              <tr>
                <th>Employee ID</th>
                <th> "-"</th>
              </tr>
              <tr>
                <th>Department Name</th>
                <th> "-"</th>
              </tr>
              <tr>
                <th>Phone</th>
                <th>"-"</th>
              </tr>
              <tr>
                <th>Job Title</th>
                <th> "-"</th>
              </tr>
              <tr>
                <th>Business Impact</th>
                <th>"-"</th>
              </tr>
              <tr>
                <th>Reporting To</th>
                <th>"-"</th>
              </tr>
            </MDBTableBody>
          </MDBTable>
        </MDBRow>
      </Grid>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={dialogOpen}
        onClose={handleCloseChangeTicket}
      >
        <ChangeIssues
          onClose={() => setDialogOpen(false)}
          ticketId={selectedTicketId}
        />
      </Dialog>
    </Grid>

    
  );
};

export default TicketService;
