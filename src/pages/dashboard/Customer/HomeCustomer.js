import {
  MDBBtn,
  MDBCard,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import React from "react";
import {
  Lightbulb,
  Notifications,
  Warning,
} from "@mui/icons-material";
import "../../../assets/css/profile.css";
import "../../../assets/css/ticketCustomer.css";
import { Card, CardContent, Grid } from "@mui/material";
import { useState } from "react";
import { GetTicketUserAvailable } from "../../../app/api/ticket";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Announcements from "../../../assets/images/announcements.jpg";
import HoldTicket from "../../../assets/images/holding ticket.png";
import AwaitTicket from "../../../assets/images/await ticket.png";
import PendingTicket from "../../../assets/images/pending ticket.png";
import CloseTicket from "../../../assets/images/close ticket.png";
import { formatTicketDate } from "../../helpers/FormatAMPM";
import MyTask from "../../../assets/images/MyTask.jpg";
import { getSummaryCustomer } from "../../../app/api/dashboard";


const HomeCustomer = () => {
  const navigate = useNavigate();
  const [dataListTicket, setDataListTicket] = useState([]);
  const [dataSummary, setDataSummary] = useState([]);


  const handleOpenRequestTicket = (e) => {
    navigate(`/home/createRequest`);
  };

  const handleOpenSolutionTicket = (e) => {
    navigate(`/home/ticketSolution`);
  };

  const handleOpenListTicket = () => {
    navigate(`/home/requestCustomerList`);
  };

  const handleOpenListTicketLog = () => {
    navigate('/home/ticketLog');
  };

  useEffect(() => {
    const fetchDataTicketByUserId = async () => {
      try {
       const response = await GetTicketUserAvailable();
       const summaryCustomer = await getSummaryCustomer();
       setDataListTicket(response);
       setDataSummary(summaryCustomer);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataTicketByUserId();
  }, []);

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <div className="section-container">
        <MDBContainer className="py-5">
          <div className="mb-4">
            <div className="text-center custom-text">
              Hi! How can we help you?
            </div>
          </div>
          <MDBRow className="justify-content-center">
            <MDBCol md="4">
              <MDBCard className="mb-4 mb-md-0">
                <div className="d-flex align-items-center custom-red-bg">
                  <MDBCol md="3" className="red-bg text-center">
                    <Warning style={{ fontSize: "100px", color: "white" }} />
                  </MDBCol>
                  <MDBCol md="9">
                    <MDBCardText className="mb-4 custom-card-text ">
                      I am facing an
                      <div style={{ fontSize: "18px" }}>Issue</div>
                    </MDBCardText>
                    <MDBBtn
                      className="custom-red-btn "
                      onClick={handleOpenRequestTicket}
                    >
                      Request Ticket Issue
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
                      <div style={{ fontSize: "18px" }}>Solutions</div>
                    </MDBCardText>
                    <MDBBtn className="custom-blue-btn"
                      onClick={handleOpenSolutionTicket}
                    >View Solution</MDBBtn>
                  </MDBCol>
                </div>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </div>

      <Grid item container xs={12} spacing={2} className="section-body">
        <Grid item xs={4}>
          <Grid item xs={12}>
            <div
              className="nav-header bordered-grid-item"
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #CCCCCC",
                padding: "8px",
                background: "#FFFFFF",
              }}
            >
              <Notifications sx={{ margin: 1, color: "#3399CC" }} />
              <h4
                style={{
                  marginLeft: "8px",
                  marginTop: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                My Requests
              </h4>
              <div style={{ marginLeft: "auto" }}>
                <button
                  variant="contained"
                  color="secondary"
                  className="custom-button"
                  onClick={() => handleOpenListTicket()}
                >
                  Show All
                </button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ height: "300px", overflowY: "auto" }}>
            <CardContent>
              {dataListTicket && dataListTicket.length > 0 ? (
                dataListTicket.map((ticket, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ display: "flex" }}>
                      <p style={{ marginRight: "8px", fontSize: "12px" }}>
                        #{ticket.id} -
                      </p>
                      <p style={{ fontSize: "12px" }}>{ticket.title}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p style={{ fontSize: "12px" }}>
                          Description: {ticket.description || "No Description"}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontWeight: "bold", fontSize: "12px" }}>
                          Create Time: {formatTicketDate(ticket.createdAt)}
                        </p>
                      </div>
                    </div>
                    <hr />
                  </div>
                ))
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "100px",
                  }}
                >
                  <img
                    src={MyTask}
                    alt="No Pending"
                    style={{ maxWidth: "350px", maxHeight: "220px" }}
                  />
                  <p
                    style={{
                      marginTop: "10px",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    There are no tasks in this view
                  </p>
                </div>
              )}
            </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Grid item xs={12}>
            <div
              className="nav-header bordered-grid-item"
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #CCCCCC",
                padding: "8px",
                background: "#FFFFFF",
              }}
            >
              <Notifications sx={{ margin: 1, color: "#3399CC" }} />
              <h4
                style={{
                  marginLeft: "8px",
                  marginTop: "4px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                Ticket Log
              </h4>
              <div style={{ marginLeft: "auto" }}>
                <button
                  variant="contained"
                  color="secondary"
                  className="custom-button"
                >
                  Show All
                </button>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Card style={{ height: "300px", overflowY: "auto" }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "30px",
                  }}
                >
                  <img
                    src={Announcements}
                    alt="No Pending"
                    style={{ maxWidth: "300px", maxHeight: "200px" }}
                  />
                  <p
                    style={{
                      marginTop: "2px",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    There are no new announcements today
                  </p>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container  item xs={4}>
          <Grid item xs={6}>
            <Card className="dashboard-card" style={{ height: "150px", marginRight: "15px" }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px"
                  }}
                >
                  <img
                    src={PendingTicket}
                    alt="No Pending"
                    style={{ maxWidth: "50px", maxHeight: "50px" }}
                  />
                  <p
                    style={{
                      marginTop: "2px",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    Pending Request - {dataSummary.totalOpenTicket}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="dashboard-card" style={{ height: "150px", marginLeft: "20px" }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <img
                    src={AwaitTicket}
                    alt="No Pending"
                    style={{ maxWidth: "50px", maxHeight: "50px" }}
                  />
                  <p
                    style={{
                      marginTop: "2px",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    Process Request - {dataSummary.totalAssignedTicket}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="dashboard-card" style={{ height: "150px", marginRight: "15px" }}>
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <img
                    src={HoldTicket}
                    alt="No Pending"
                    style={{ maxWidth: "50px", maxHeight: "50px" }}
                  />
                  <p
                    style={{
                      marginTop: "2px",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    Close Request - {dataSummary.totalClosedTicket}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card className="dashboard-card" style={{ height: "150px", marginLeft: "20px" }}>
              <CardContent style={{ marginRight: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <img
                    src={CloseTicket}
                    alt="No Pending"
                    style={{ maxWidth: "50px", maxHeight: "50px" }}
                  />
                  <p
                    style={{
                      marginTop: "2px",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    Cancel Request - {dataSummary.totalCancelledTicket}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

    </section>
  );
};

export default HomeCustomer;
