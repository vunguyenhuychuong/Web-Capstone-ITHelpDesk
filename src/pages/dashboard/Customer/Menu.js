import {
    MDBCard,
    MDBCardText,
    MDBCol,
    MDBContainer,
    MDBRow,
  } from "mdb-react-ui-kit";
  import React from "react";
  import {
    Construction,
    SupportAgent,
  } from "@mui/icons-material";
  import "../../../assets/css/profile.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
  
  const Menu = () => {

    const user = useSelector((state) => state.auth);
    console.log(user);
    return (
      <section style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5">
          <div className="mb-4">
            <div className="text-center" style={{ fontSize: "44px", color: "#333" }}>Welcome to ManageEngine ServiceDesk Plus's Service Desk</div>
          </div>
          <MDBRow>
            <MDBCol md="6">
              <MDBCard className="mb-4 mb-md-0">
                <div className="d-flex align-items-center m-4">
                  <MDBCol md="4" className="red-bg custom-green-bg text-center">
                    <Link to="/home/mains">
                      <SupportAgent style={{ fontSize: "50px", color: "white" }} />
                    </Link>
                  </MDBCol>
                  <MDBCol md="8" className="text-center">
                    <MDBCardText
                      className="mb-4 "
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        color: "#333",
                      }}
                    >
                      IT HelpDesk
                    </MDBCardText>
                    <MDBCardText small className="text-muted">
                       Helpdesk to manage all IT support ...
                      </MDBCardText>
                  </MDBCol>
                </div>
              </MDBCard>
            </MDBCol>
            <MDBCol md="6">
              <MDBCard className="mb-4 mb-md-0">
                <div className="d-flex align-items-center m-4">
                  <MDBCol md="4" className="red-bg custom-orange-bg text-center">
                    <Construction style={{ fontSize: "50px", color: "white" }} />
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
                    <MDBCardText small className="text-muted">
                       Fixtures and furniture , HVAC, button...
                      </MDBCardText>
                  </MDBCol>
                </div>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    );
  };
  
  export default Menu;
  