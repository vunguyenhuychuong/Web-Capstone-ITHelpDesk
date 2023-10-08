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
import "../../assets/css/profile.css";
import RequestIssues from "./Customer/Issue";
import { Dialog } from "@mui/material";
import { useState } from "react";

const Main = () => {

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpenRequestTicket = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleCloseRequestTicket = () => {
    setDialogOpen(false); // Close the Dialog when needed (for example, when cancel button is clicked)
  };

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

      <MDBRow>
        <MDBCol md="3">
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
                  Popular Solutions
                </MDBCardText>
                <div className="input-group mb-3 ml-2">
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search Solutions"
                    aria-label="Search Solutions"
                    aria-describedby="button-search"
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    id="button-search"
                  >
                    Search
                  </button>
                </div>
                <MDBListGroup className="rounded-3">
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      <MDBCardText>Server Crash</MDBCardText>
                      <MDBCardText small className="text-muted">
                        When a server fails, the first two questions you need to
                        ask yourself
                      </MDBCardText>
                    </div>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                    <div>
                      <MDBCardText>Printer Configuration</MDBCardText>
                      <MDBCardText small className="text-muted">
                        In most cases, setting up and configuring a printer in
                        Windows 7 or 8
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
        <MDBCol md="6">
          <MDBCard className="mt-8 mb-md-0">
            <div className="d-flex align-items-center">
              <MDBCol md="12" style={{ backgroundColor: "#C0C0C0" }}>
                <MDBCardText
                  className="mb-4"
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
        <MDBCol md="3">
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

      <Dialog maxWidth="lg" fullWidth open={dialogOpen} onClose={handleCloseRequestTicket}>
      <section style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5">
        <RequestIssues onClose={handleCloseRequestTicket} />
        </MDBContainer>
      </section>
      </Dialog>
    </section>
  );
};

export default Main;
