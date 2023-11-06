import {
  BookOnline,
  BugReport,
  DoDisturb,
  EventNote,
  HourglassTop,
  More,
  PermDeviceInformation,
  PestControl,
  SyncProblem,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import "../../../assets/css/MyView.css";
import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCol,
  MDBRow,
} from "mdb-react-ui-kit";

const MyView = () => {
  return (
    <Grid
      item
      container
      xs={12}
      spacing={{ xs: 2 }}
      style={{ marginTop: "20px", marginRight: "20px" }}
    >
      <Grid item xs={3}>
        <div className="nav-header bordered-grid-item">
          <EventNote sx={{ margin: 1, color: "#0099FF" }} />
          <h4>My Summary</h4>
        </div>
        <MDBCard className="mb-3">
          <MDBCardBody>
            <MDBRow>
              <MDBCol sm="11">
                <MDBCardText style={{ fontSize: "18px", color: "#666" }}>
                  <HourglassTop />
                  Need Clarification
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
                  <BookOnline />
                  Requests Due Today
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
        <div className="nav-header bordered-grid-item" justifyContent="space-between">
          <EventNote sx={{ margin: 1, color: "#0099FF" }} />
          <h4>My Tasks(0)</h4>
          <button>Show All</button>
        </div>
        
      </Grid>
      <Grid item xs={3}>
        <div className="nav-header bordered-grid-item" >
          <EventNote sx={{ margin: 1, color: "#0099FF" }} />
          <h4>My Approved(0)</h4>
          
        </div>
      </Grid>
    </Grid>
  );
};

export default MyView;
