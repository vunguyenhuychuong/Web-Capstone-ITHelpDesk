import {
  MDBBtn,
  MDBCard,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
} from "mdb-react-ui-kit";
import React from "react";
import {
  AddBox,
  AnnouncementSharp,
  ContactSupport,
  Warning,
} from "@mui/icons-material";
import "../../../assets/css/profile.css";
import "../../../assets/css/ticketCustomer.css";
import { Dialog } from "@mui/material";
import { useState } from "react";
import { getTicketByUserId } from "../../../app/api/ticket";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import {  useNavigate } from "react-router-dom";
import RequestIssues from "./RequestIssues";


const Main = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const user = useSelector((state) => state.auth);
  const handleOpenRequestTicket = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleCloseRequestTicket = () => {
    setDialogOpen(false);
  };

  const handleOpenListTicket = () => {
    navigate(`/home/customerTicket`);
  };

  useEffect(() => {
    const fetchDataTicketByUserId = async () => {
      try {
        const response = await getTicketByUserId(user.user.id);
        setTickets(response);
      } catch (error) {
        console.log("Error fetching tickets", error);
      }
    };
    fetchDataTicketByUserId();
  }, [user.user.id]);

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <div className="mb-4">
          <div
            className="text-center"
            style={{ fontSize: "44px", color: "#333" }}
          >
            How can we help you?
          </div>
        </div>
        <div className="mb-4">
          <input type="text" placeholder="Search..." className="form-control" />
        </div>
        <MDBRow>
          <MDBCol md="4">
            <MDBCard className="mb-4 mb-md-0">
              <div className="d-flex align-items-center">
                <MDBCol md="4" className="red-bg text-center">
                  <Warning style={{ fontSize: "50px", color: "white" }} />
                </MDBCol>
                <MDBCol md="8" className="text-center">
                  <MDBCardText
                    className="mb-4"
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#333",
                    }}
                  >
                    I am facing an Issue
                  </MDBCardText>
                  <MDBBtn
                    style={{ backgroundColor: "#a84632", color: "white" }}
                    onClick={handleOpenRequestTicket}
                  >
                    Report an issue
                  </MDBBtn>
                </MDBCol>
              </div>
            </MDBCard>
          </MDBCol>
          <MDBCol md="4">
            <MDBCard className="mb-4 mb-md-0">
              <div className="d-flex align-items-center">
                <MDBCol md="4" className="red-bg custom-green-bg text-center">
                  <AddBox style={{ fontSize: "50px", color: "white" }} />
                </MDBCol>
                <MDBCol md="8" className="text-center">
                  <MDBCardText
                    className="mb-4"
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#333",
                    }}
                  >
                    I need a new Service
                  </MDBCardText>
                  <MDBBtn
                    style={{ backgroundColor: "#4caf50", color: "white" }}
                  >
                    Request a service
                  </MDBBtn>
                </MDBCol>
              </div>
            </MDBCard>
          </MDBCol>
          <MDBCol md="4">
            <MDBCard className="mb-4 mb-md-0">
              <div className="d-flex align-items-center">
                <MDBCol md="4" className="red-bg custom-grey-bg text-center">
                  <ContactSupport
                    style={{ fontSize: "50px", color: "white" }}
                  />
                </MDBCol>
                <MDBCol md="8" className="text-center">
                  <MDBCardText
                    className="mb-4"
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#333",
                    }}
                  >
                    I am looking for a Solution
                  </MDBCardText>
                  <MDBBtn
                    style={{ backgroundColor: "#73686c", color: "white" }}
                  >
                    View Solution
                  </MDBBtn>
                </MDBCol>
              </div>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <MDBRow className="justify-content-end">
        <MDBCol md="5">
          <MDBCard className="mt-8 mb-md-0">
            <div className="d-flex align-items-center">
              <MDBCol
                md="12"
                className="my-request-summary pl-3"
                style={{ backgroundColor: "#C0C0C0" }}
              >
                <MDBCol
                  md="12"
                  className="my-request-summary"
                  style={{ backgroundColor: "#C0C0C0" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <MDBCardText
                      className="mb-4 card-text"
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        color: "#333",
                      }}
                    >
                      My Request Summary
                    </MDBCardText>
                    <button className="btn btn-primary"onClick={handleOpenListTicket}>Show All</button>
                  </div>
                </MDBCol>
                <div className="scrollable-list">
                  <MDBListGroup className="rounded-3">
                    {tickets.map((ticket, index) => (
                      <MDBListGroupItem key={ticket.id} className="d-flex justify-content-between align-items-center p-3">
                        <div key={ticket.id}>
                          <MDBCardText className="ticket-title">
                            Title: {ticket.title}
                          </MDBCardText>
                          <MDBCardText
                            small
                            className="text-muted ticket-description"
                          >
                            {ticket.description}
                          </MDBCardText>
                        </div>
                      </MDBListGroupItem>
                    ))}
                  </MDBListGroup>
                </div>
              </MDBCol>
            </div>
          </MDBCard>
        </MDBCol>
        <MDBCol md="5">
          <MDBCard className="mt-8 mb-md-0">
            <div className="d-flex align-items-center">
              <MDBCol md="12" style={{ backgroundColor: "#C0C0C0" }}>
                <MDBCardText
                  className="mb-4 clickable-text"
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "#333",
                  }}
                >
                  <AnnouncementSharp
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#000080",
                    }}
                  />{" "}
                  Announcements
                </MDBCardText>
                <MDBListGroup className="rounded-3">
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      <MDBCardText>Steps to prevent system Updates</MDBCardText>
                      <MDBCardText small className="text-muted">
                        Option 1, Disable the Windows Updates ServiceWindows
                        Update essential
                      </MDBCardText>
                    </div>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      <MDBCardText>Steps to prevent system Updates</MDBCardText>
                      <MDBCardText small className="text-muted">
                        Option 1, Disable the Windows Updates ServiceWindows
                        Update essential
                      </MDBCardText>
                    </div>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      <MDBCardText>Steps to prevent system Updates</MDBCardText>
                      <MDBCardText small className="text-muted">
                        Option 1, Disable the Windows Updates ServiceWindows
                        Update essential
                      </MDBCardText>
                    </div>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCol>
            </div>
          </MDBCard>
        </MDBCol>
        <MDBCol md="2">
          <MDBCard className="mt-8 mb-md-0">
            <div className="d-flex align-items-center">
              <MDBCol md="12" style={{ backgroundColor: "#C0C0C0" }}>
                <MDBCardText
                  className="mb-4 ml-2"
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "#333",
                  }}
                >
                  {" "}
                  My Request Summary
                </MDBCardText>
                <MDBListGroup className="rounded-3">
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      <MDBCardText>Pending</MDBCardText>
                      <MDBCardText small className="text-muted">
                        62
                      </MDBCardText>
                    </div>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      <MDBCardText>Awaiting Approval</MDBCardText>
                      <MDBCardText small className="text-muted">
                        28
                      </MDBCardText>
                    </div>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      <MDBCardText>Awaiting Updates</MDBCardText>
                      <MDBCardText small className="text-muted">
                        1
                      </MDBCardText>
                    </div>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCol>
            </div>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      <Dialog
        maxWidth="lg"
        fullWidth
        open={dialogOpen}
        onClose={handleCloseRequestTicket}
      >
          <MDBRow className="mb-4 custom-padding">
            <MDBCol className="text-left-corner d-flex align-items-center">
              <button className="btn btn-light">
                <FaArrowLeft style={{ fontSize: 20 }}/>
              </button>
              <h2 className="ms-3" style={{ fontFamily: 'Arial, sans-serif' }}>Add Request</h2>
            </MDBCol>
          </MDBRow>
            <RequestIssues onClose={handleCloseRequestTicket} />
      </Dialog>
    </section>
  );
};

export default Main;
