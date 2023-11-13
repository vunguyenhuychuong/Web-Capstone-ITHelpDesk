import {
  AddCircle,
  AlarmOn,
  Assignment,
  BugReport,
  DoDisturb,
  EventNote,
  HowToReg,
  More,
  Notifications,
  PermDeviceInformation,
  PestControl,
  SyncProblem,
} from "@mui/icons-material";
import { Button, Card, CardContent, Grid } from "@mui/material";
import "../../../assets/css/MyView.css";
import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCol,
  MDBRow,
  MDBTable,
} from "mdb-react-ui-kit";
import NoPending from "../../../assets/images/NoPending.jpg";
import MyTask from "../../../assets/images/MyTask.jpg";
import AlarmTechnician from "../../../assets/images/alarm.jpg";
import Announcements from "../../../assets/images/announcements.jpg";
import { getAssignAvailable } from "../../../app/api/assign";
import { formatTicketDate } from "../../helpers/FormatAMPM";
import { useNavigate } from "react-router-dom";

const MyView = () => {
  const [dataListTicketsTask, setDataListTicketsTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchDataListTicketTask = async () => {
    try {
      setLoading(true);
      const response = await getAssignAvailable();
      setDataListTicketsTask(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateTicketTask = () => {
    navigate("/home/createTask");
  };

  useEffect(() => {
    fetchDataListTicketTask();
  }, []);

  return (
    <Grid
      item
      container
      xs={12}
      spacing={2}
      style={{ marginTop: "10px", background: "#eee", marginLeft: "-9px" }}
    >
      <Grid item xs={3}>
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
          <EventNote sx={{ margin: 1, color: "#CC99FF" }} />
          <h4
            style={{ marginLeft: "8px", marginTop: "4px", fontWeight: "bold" }}
          >
            My Summary
          </h4>
        </div>
        <MDBCard className="mb-3">
          <MDBCardBody>
            <MDBRow>
              <MDBCol sm="11">
                <MDBCardText style={{ fontSize: "18px", color: "#666" }}>
                  <PermDeviceInformation />
                  Requests OverDue
                </MDBCardText>
              </MDBCol>
              <MDBCol sm="1">
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>0</span>
              </MDBCol>
            </MDBRow>
            <hr />
            <MDBRow>
              <MDBCol sm="11">
                <MDBCardText style={{ fontSize: "18px", color: "#666" }}>
                  <More />
                  Pending Request
                </MDBCardText>
              </MDBCol>
              <MDBCol sm="1">
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>0</span>
              </MDBCol>
            </MDBRow>
            <hr />
            <MDBRow>
              <MDBCol sm="11">
                <MDBCardText style={{ fontSize: "18px", color: "#666" }}>
                  <SyncProblem />
                  Approved Changes
                </MDBCardText>
              </MDBCol>
              <MDBCol sm="1">
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>0</span>
              </MDBCol>
            </MDBRow>
            <hr />
            <MDBRow>
              <MDBCol sm="11">
                <MDBCardText style={{ fontSize: "18px", color: "#666" }}>
                  <DoDisturb />
                  Unapproved Changes
                </MDBCardText>
              </MDBCol>
              <MDBCol sm="1">
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>0</span>
              </MDBCol>
            </MDBRow>
            <hr />
            <MDBRow>
              <MDBCol sm="11">
                <MDBCardText style={{ fontSize: "18px", color: "#666" }}>
                  <BugReport />
                  Open Problems
                </MDBCardText>
              </MDBCol>
              <MDBCol sm="1">
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>0</span>
              </MDBCol>
            </MDBRow>
            <hr />
            <MDBRow>
              <MDBCol sm="11">
                <MDBCardText style={{ fontSize: "18px", color: "#666" }}>
                  <PestControl />
                  Unassigned Problems
                </MDBCardText>
              </MDBCol>
              <MDBCol sm="1">
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>0</span>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>
      </Grid>
      <Grid item xs={6}>
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
            <Assignment sx={{ margin: 1, color: "#33CC66" }} />
            <h4
              style={{
                marginLeft: "8px",
                marginTop: "4px",
                fontWeight: "bold",
              }}
            >
              My Task
            </h4>
            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="contained"
                color="primary"
                className="custom-button"
                onClick={() => handleOpenCreateTicketTask()}
              >
                <AddCircle style={{ marginRight: "6px" }} /> Add New
              </Button>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  marginLeft: "8px",
                  textTransform: "none",
                  backgroundColor: "#3399FF",
                }}
              >
                Show All
              </Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Card style={{ height: "390px", overflowY: "auto" }}>
            <CardContent>
              {dataListTicketsTask && dataListTicketsTask.length > 0 ? (
                dataListTicketsTask.map((ticket, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div style={{ display: "flex", marginBottom: "2px" }}>
                      <p style={{ marginRight: "8px" }}>#{ticket.id} -</p>
                      <p>{ticket.title}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p>
                          Description: {ticket.description || "No Description"}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontWeight: "bold" }}>
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
      <Grid item xs={3}>
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
            <HowToReg sx={{ margin: 1, color: "#9966FF" }} />
            <h4
              style={{
                marginLeft: "8px",
                marginTop: "4px",
                fontWeight: "bold",
              }}
            >
              My Approvals
            </h4>
            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  marginLeft: "8px",
                  textTransform: "none",
                  backgroundColor: "#3399FF",
                }}
              >
                Show All
              </Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          {/* Card content goes here */}
          <Card style={{ height: "390px" }}>
            <CardContent>
              <div>
                <MDBTable className="align-middle mb-0" responsive>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "100px",
                    }}
                  >
                    <img
                      src={NoPending}
                      alt="No Pending"
                      style={{ maxWidth: "150px", maxHeight: "120px" }}
                    />
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "16px",
                        color: "#666",
                      }}
                    >
                      No Pending Tasks
                    </p>
                  </div>
                </MDBTable>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={9}>
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
              }}
            >
              Announcements
            </h4>
            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  marginLeft: "8px",
                  textTransform: "none",
                  backgroundColor: "#3399FF",
                }}
              >
                Show All
              </Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Card style={{ height: "330px", overflowY: "auto" }}>
            <CardContent>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "80px",
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

      <Grid item xs={3}>
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
            <AlarmOn sx={{ margin: 1, color: "#FF6699" }} />
            <h4
              style={{
                marginLeft: "8px",
                marginTop: "4px",
                fontWeight: "bold",
              }}
            >
              My Reminders
            </h4>
            <div style={{ marginLeft: "auto" }}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  marginLeft: "8px",
                  textTransform: "none",
                  backgroundColor: "#3399FF",
                }}
              >
                Show All
              </Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          {/* Card content goes here */}
          <Card style={{ height: "330px" }}>
            <CardContent>
              <div>
                <MDBTable className="align-middle mb-0" responsive>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "100px",
                    }}
                  >
                    <img
                      src={AlarmTechnician}
                      alt="No Pending"
                      style={{ maxWidth: "150px", maxHeight: "120px" }}
                    />
                    <p
                      style={{
                        marginTop: "10px",
                        fontSize: "16px",
                        color: "#666",
                      }}
                    >
                      No reminder available
                    </p>
                  </div>
                </MDBTable>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MyView;
