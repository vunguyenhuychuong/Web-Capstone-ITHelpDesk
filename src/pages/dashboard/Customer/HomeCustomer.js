import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBListGroup,
  MDBListGroupItem,
  MDBRow,
} from "mdb-react-ui-kit";
import React from "react";
import {
  AddBox,
  Campaign,
  Lightbulb,
  Search,
  Summarize,
  Warning,
} from "@mui/icons-material";
import "../../../assets/css/profile.css";
import "../../../assets/css/ticketCustomer.css";
import { Dialog } from "@mui/material";
import { useState } from "react";
import { getTicketByUserId } from "../../../app/api/ticket";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequestIssues from "./RequestIssues";

const HomeCustomer = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const user = useSelector((state) => state.auth);
  const id = user.user.id;
  const [searchField, setSearchField] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleOpenRequestTicket = (e) => {
    navigate(`/home/createRequest`);
  };

  const handleCloseRequestTicket = () => {
    setDialogOpen(false);
  };

  const handleOpenListTicket = () => {
    navigate(`/home/customerTicket`);
  };

  // const handleOpenListTicketSolution = () => {
  //   navigate('/home/ticketSolution');
  // };

  useEffect(() => {
    const fetchDataTicketByUserId = async () => {
      try {
        const response = await getTicketByUserId(
          searchField, 
          searchQuery,
          id,
          currentPage,
          pageSize,
          );
        setTickets(response);
      } catch (error) {
        console.log("Error fetching tickets", error);
      }
    };
    fetchDataTicketByUserId();
  }, [user.user.id]);

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <div className="section-container">
        <MDBContainer className="py-5">
          <div className="mb-4">
            <div className="text-center custom-text">
              Hi! How can we help you?
            </div>
          </div>
          <div className="mb-4 input-group">
            <input
              type="search"
              className="form-control rounded"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="search-addon"
            />
            <button
              type="button"
              className="btn btn-outline-primary custom-button-color"
            >
              <Search />
            </button>
          </div>
          <MDBRow>
            <MDBCol md="4">
              <MDBCard className="mb-4 mb-md-0">
                <div className="d-flex align-items-center custom-red-bg">
                  <MDBCol md="3" className="red-bg text-center">
                    <Warning style={{ fontSize: "100px", color: "white" }} />
                  </MDBCol>
                  <MDBCol md="9">
                    <MDBCardText className="mb-4 custom-card-text ">
                      I am facing an
                      <div style={{ fontSize: "24px" }}>Issue</div>
                    </MDBCardText>
                    <MDBBtn
                      className="custom-red-btn "
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
                <div className="d-flex align-items-center custom-green-bg">
                  <MDBCol md="3" className="red-bg text-center">
                    <AddBox style={{ fontSize: "100px", color: "white" }} />
                  </MDBCol>
                  <MDBCol md="9">
                    <MDBCardText className="mb-4 custom-card-text ">
                      I need a something
                      <div style={{ fontSize: "24px" }}>New</div>
                    </MDBCardText>
                    <MDBBtn className="custom-green-btn">
                      Request a service
                    </MDBBtn>
                  </MDBCol>
                </div>
              </MDBCard>
            </MDBCol>
            <MDBCol md="4">
              <MDBCard className="mb-4 mb-md-0">
                <div className="d-flex align-items-center custom-blue-bg">
                  <MDBCol md="3" className="red-bg custom-grey-bg text-center">
                    <Lightbulb style={{ fontSize: "100px", color: "white" }} />
                  </MDBCol>
                  <MDBCol md="9">
                    <MDBCardText className="mb-4 custom-card-text">
                      I am looking for
                      <div style={{ fontSize: "24px" }} >Solutions</div>
                    </MDBCardText>
                    <MDBBtn className="custom-blue-btn">View Solution</MDBBtn>
                  </MDBCol>
                </div>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>

      <div className="section-body">
        <MDBRow className="justify-content-end">
          <MDBCol md="4">
            <MDBCard className="mt-8 mb-md-0">
              <div className="d-flex align-items-center">
                <MDBCol
                  md="12"
                  className="my-request-summary pl-3"
                  style={{ backgroundColor: "#C0C0C0" }}
                >
                  <MDBCol md="12" style={{ backgroundColor: "#C0C0C0" }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <MDBCardText
                        className="mb-4 card-text"
                        style={{
                          fontWeight: "bold",
                          fontSize: "20px",
                          color: "#333",
                        }}
                      >
                        <Summarize className="campaign-icon" /> My Request
                        Summary
                      </MDBCardText>
                      <button
                        type="button"
                        className="btn btn-primary icon-info"
                        onClick={handleOpenListTicket}
                      >
                        Show All
                      </button>
                    </div>
                  </MDBCol>
                  <div className="scrollable-list">
                    {tickets.length === 0 ? (
                      <div className="text-center p-3">
                        <strong>No Ticket available</strong>
                      </div>
                    ) : (
                      <MDBListGroup className="rounded-3">
                        {tickets.map((ticket, index) => {
                          return (
                            <MDBListGroupItem
                              key={ticket.id}
                              className="d-flex justify-content-between align-items-center p-3"
                            >
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
                          );
                        })}
                      </MDBListGroup>
                    )}
                  </div>
                </MDBCol>
              </div>
            </MDBCard>
          </MDBCol>
          <MDBCol md="4">
            <MDBCard className="mt-8 mb-md-0">
              <div className="d-flex align-items-center">
                <MDBCol
                  md="12"
                  className="my-request-summary pl-3"
                  style={{ backgroundColor: "#C0C0C0" }}
                >
                  <MDBCardText
                    className="mb-4 clickable-text"
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#333",
                    }}
                  >
                    <Campaign className="campaign-icon" />
                    Announcements
                  </MDBCardText>
                  <MDBListGroup className="rounded-3">
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <div>
                        <MDBCardText>
                          Steps to prevent system Updates
                        </MDBCardText>
                        <MDBCardText small className="text-muted">
                          Option 1, Disable the Windows Updates ServiceWindows
                          Update essential
                        </MDBCardText>
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <div>
                        <MDBCardText>
                          Steps to prevent system Updates
                        </MDBCardText>
                        <MDBCardText small className="text-muted">
                          Option 1, Disable the Windows Updates ServiceWindows
                          Update essential
                        </MDBCardText>
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <div>
                        <MDBCardText>
                          Steps to prevent system Updates
                        </MDBCardText>
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
          <MDBCol md="4">
            <MDBRow className="mb-4">
              <MDBCol md="6">
                <MDBCard className="mt-8 mb-md-0" style={{ height: "240px" }}>
                  <MDBCardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MDBCardTitle className="text-center mb-3">
                      0
                    </MDBCardTitle>
                    <MDBCardText className="text-center mb-4">
                      Pending Requests
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="6">
                <MDBCard className="mt-8 mb-md-0" style={{ height: "240px" }}>
                <MDBCardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MDBCardTitle className="text-center mb-3">
                      0
                    </MDBCardTitle>
                    <MDBCardText className="text-center mb-4">
                      Awaited Requests
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="6">
                <MDBCard className="mt-8 mb-md-0" style={{ height: "240px" }}>
                <MDBCardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MDBCardTitle className="text-center mb-3">
                      0
                    </MDBCardTitle>
                    <MDBCardText className="text-center mb-4">
                      On Hold Requests
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
              <MDBCol md="6">
                <MDBCard className="mt-8 mb-md-0" style={{ height: "240px" }}>
                <MDBCardBody
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MDBCardTitle className="text-center mb-3">
                      0
                    </MDBCardTitle>
                    <MDBCardText className="text-center mb-4">
                      Closed Requests
                    </MDBCardText>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </div>

      <Dialog
        maxWidth="lg"
        fullWidth
        open={dialogOpen}
        onClose={handleCloseRequestTicket}
      >
        <RequestIssues onClose={handleCloseRequestTicket} />
      </Dialog>
    </section>
  );
};

export default HomeCustomer;
