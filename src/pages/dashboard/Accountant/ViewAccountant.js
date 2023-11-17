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
  Replay,
  SyncProblem,
} from "@mui/icons-material";
import { Card, CardContent, Grid } from "@mui/material";
import "../../../assets/css/MyView.css";
import React, { useEffect, useState } from "react";
import {
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
import { formatTicketDate } from "../../helpers/FormatAMPM";
import { useNavigate } from "react-router-dom";
import { getChartAccountantContract, getChartAccountantContractStatus, getSummaryTechnician } from "../../../app/api/dashboard";
import LoadingImg from "../../../assets/images/loading.gif";

const ViewAccountant = () => {
  const [dataListContract, setDataContract] = useState([]);
  const [dataSummary, setDataSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchDataListContract = async () => {
    try {
      setLoading(true);
      const response = await getChartAccountantContractStatus();
      setDataContract(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountSummary = async () => {
    try {
      const summaryAccountant = await getChartAccountantContract();
      setDataSummary(summaryAccountant);
    } catch (error) {
      console.log(error);
    }
  };


  const handleReloadClick = () => {
    // fetchTechnicianSummary();
  };

  const handleOpenCreateTicketTask = () => {
    navigate("/home/createTask");
  };

  const handleOpenListContract = () => {
    navigate("/home/contractList");
  };

  const handleOpenListPayment = () => {
    navigate("/home/paymentList");
  };

  useEffect(() => {
    // fetchDataListContract();
    fetchAccountSummary();
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
            style={{
              marginLeft: "6px",
              marginTop: "2px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            My Summary
          </h4>
          <div style={{ marginLeft: "auto" }}>
            <button
              variant="contained"
              color="secondary"
              className="custom-button"
              onClick={handleReloadClick}
            >
              <Replay />
            </button>
          </div>
        </div>
        <MDBCardBody
          style={{
            background: "#FFFFFF", // Set white background
          }}
        >
          <MDBRow>
            <MDBCol
              sm="10"
              style={{
                marginLeft: "5px",
                marginTop: "15px",
                transition: "color 0.3s",
                cursor: "pointer",
              }}
            >
              <MDBCardText
                style={{ fontSize: "14px", color: "#666" }}
                className={dataSummary.totalContractCount ? "text-hover" : ""}
              >
                <PermDeviceInformation
                  style={{
                    color: dataSummary.totalContractCount ? "#3399FF" : "#AAAAAA",
                  }}
                />
                Total Contract
              </MDBCardText>
            </MDBCol>
            <MDBCol sm="1" style={{ marginLeft: "5px", marginTop: "10px" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                {dataSummary.totalContractCount}
              </span>
            </MDBCol>
          </MDBRow>
          <hr />
          <MDBRow>
            <MDBCol sm="10" style={{ marginLeft: "5px" }}>
              <MDBCardText
                style={{
                  fontSize: "14px",
                  color: "#666",
                  transition: "color 0.3s",
                  cursor: "pointer",
                }}
                className={dataSummary.contractPaymentDoneCount ? "text-hover" : ""}
              >
                <More
                  style={{
                    color: dataSummary.contractPaymentDoneCount ? "#3399FF" : "#000",
                  }}
                />
                Contract Payment Done 
              </MDBCardText>
            </MDBCol>
            <MDBCol sm="1" style={{ marginLeft: "5px" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                {dataSummary.contractPaymentDoneCount}
              </span>
            </MDBCol>
          </MDBRow>
          <hr />
          <MDBRow>
            <MDBCol sm="10" style={{ marginLeft: "5px" }}>
              <MDBCardText
                style={{
                  fontSize: "14px",
                  color: "#666",
                  transition: "color 0.3s",
                  cursor: "pointer",
                }}
                className={
                  dataSummary.contractPaymentNotDoneCount ? "text-hover" : ""
                }
              >
                <SyncProblem
                  style={{
                    color: dataSummary.contractPaymentNotDoneCount
                      ? "#3399FF"
                      : "#000",
                  }}
                />
                Contract Payment Not Done 
              </MDBCardText>
            </MDBCol>
            <MDBCol sm="1" style={{ marginLeft: "5px" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                {dataSummary.contractPaymentNotDoneCount}
              </span>
            </MDBCol>
          </MDBRow>
          <hr />
          <MDBRow>
            <MDBCol sm="10" style={{ marginLeft: "5px" }}>
              <MDBCardText
                style={{
                  fontSize: "14px",
                  color: "#666",
                  transition: "color 0.3s",
                  cursor: "pointer",
                }}
                className={dataSummary.contractTermDoneCount ? "text-hover" : ""}
              >
                <DoDisturb
                  style={{
                    color: dataSummary.contractTermDoneCount ? "blue" : "#AAAAAA",
                  }}
                />
                Contract Term Done 
              </MDBCardText>
            </MDBCol>
            <MDBCol sm="1" style={{ marginLeft: "5px" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                {dataSummary.contractTermDoneCount}
              </span>
            </MDBCol>
          </MDBRow>
          <hr />
          <MDBRow>
            <MDBCol sm="10" style={{ marginLeft: "5px", marginBottom: "px" }}>
              <MDBCardText
                style={{
                  fontSize: "14px",
                  color: "#666",
                  transition: "color 0.3s",
                  cursor: "pointer",
                }}
                className={dataSummary.contractTermNotDoneCount ? "text-hover" : ""}
              >
                <BugReport
                  style={{
                    color: dataSummary.contractTermNotDoneCount
                      ? "#3399FF"
                      : "#000",
                  }}
                />
               Contract Term Not Done 
              </MDBCardText>
            </MDBCol>
            <MDBCol sm="1" style={{ marginLeft: "5px" }}>
              <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                {dataSummary.contractTermNotDoneCount}
              </span>
            </MDBCol>
          </MDBRow>
          <hr />
        </MDBCardBody>
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
                fontSize: "14px",
              }}
            >
              My Task
            </h4>
            <div style={{ marginLeft: "auto" }}>
              <button
                variant="contained"
                color="primary"
                className="custom-button"
                onClick={() => handleOpenCreateTicketTask()}
              >
                <AddCircle style={{ marginRight: "6px" }} /> Add New
              </button>
              <button
                variant="contained"
                color="secondary"
                className="custom-button"
                onClick={() => handleOpenListContract()}
              >
                Show All
              </button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Card style={{ height: "290px", overflowY: "auto" }}>
            <CardContent>
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={LoadingImg} alt="Loading" />
                </div>
              ) : dataListContract && dataListContract.length > 0 ? (
                dataListContract.map((ticket, index) => (
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
                fontSize: "14px",
              }}
            >
              My Approvals
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
          {/* Card content goes here */}
          <Card style={{ height: "290px" }}>
            <CardContent>
              <div>
                <MDBTable className="align-middle mb-0" responsive>
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
                fontSize: "14px",
              }}
            >
              Payment 
            </h4>
            <div style={{ marginLeft: "auto" }}>
              <button
                variant="contained"
                color="secondary"
                className="custom-button"
                onClick={() => handleOpenListPayment()}
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
                fontSize: "14px",
              }}
            >
              My Reminders
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
          {/* Card content goes here */}
          <Card style={{ height: "300px" }}>
            <CardContent>
              <div>
                <MDBTable className="align-middle mb-0" responsive>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "50px",
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

export default ViewAccountant;
