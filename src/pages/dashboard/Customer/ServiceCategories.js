import React from 'react'
import {
    MDBBtn,
    MDBCard,
    MDBCardText,
    MDBCol,
    MDBContainer,
    MDBRow,
} from "mdb-react-ui-kit";

const ServiceCategories = () => {
  return (
    <MDBContainer className="py-5">
        <div className="mb-4">
          <div style={{ fontSize: "20px", color: "#333" }}>Service Categories</div>
        </div>
        <div className="mb-4">
          <input type="text" placeholder="Search..." className="form-control" />
        </div>
        <MDBRow>
          <MDBCol md="4">
            <MDBCard className="mb-4 mb-md-0">
              <div className="d-flex align-items-center">
                <MDBCol md="4" className="red-bg text-center">
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
  )
}

export default ServiceCategories