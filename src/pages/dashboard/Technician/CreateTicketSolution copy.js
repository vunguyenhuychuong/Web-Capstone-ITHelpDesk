import React from "react";
import "../../../assets/css/ticketSolution.css";
import { Grid } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const CreateTicketSolution = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(`/home/ticketSolution`);
  };

  return (
    <Grid
      container
      style={{
        border: "1px solid #ccc",
        paddingRight: "10px",
        paddingLeft: "10px",
      }}
    >
      <Grid item xs={12}>
        <MDBCol md="12">
          <MDBRow className="border-box">
            <MDBCol md="5" className="mt-2">
              <div className="d-flex align-items-center">
                <button type="button" className="btn btn-link icon-label">
                  <ArrowBack
                    onClick={handleGoBack}
                    className="arrow-back-icon"
                  />
                </button>

                <h2 style={{ marginLeft: "10px" }}>New Solution</h2>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBRow className="mb-4">
          <MDBCol
            md="12"
            className="mt-4"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Grid container justifyContent="flex-end">
              {" "}
              {/* Set justifyContent to 'flex-end' */}
              <Grid item xs={3}>
                <h2 className="align-right">
                  <span style={{ color: "red" }}>*</span>Title
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  id="title"
                  type="text"
                  name="title"
                  className="form-control input-field"
                />
              </Grid>
              <Grid item xs={3}>
                <h2 className="align-right">
                  <span style={{ color: "red" }}>*</span>Content
                </h2>
              </Grid>
              <Grid item xs={9}>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  className="form-control input-field-2"
                  rows="6"
                />
              </Grid>
              <Grid item xs={3}>
                <h2 className="align-right">Attachment</h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="file"
                  name="file"
                  className="form-control input-field"
                  id="attachmentUrl"
                />
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2 className="align-right">
                        <span style={{ color: "red" }}>*</span>Topic
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="title1"
                        type="text"
                        name="title1"
                        className="form-control input-field"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <h2 className="align-right">Solution Owner</h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="title2"
                        type="text"
                        name="title2"
                        rows="3"
                        className="form-control input-field"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2 className="align-right">Review Date</h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="title1"
                        type="text"
                        name="title1"
                        className="form-control input-field-2"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2 className="align-right">Expiry Date</h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="title2"
                        type="text"
                        name="title2"
                        className="form-control input-field-2"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={3}>
                  <h2 className="align-right">Keywords</h2>
                </Grid>
                <Grid item xs={9}>
                  <input
                    id="keywords"
                    type="text"
                    name="keywords"
                    className="form-control input-field"
                  />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={9}>
                  <p className="input-field-description">
                    * Keywords should be comma separated <br /> Choosing a
                    relevant keyword for a solution will improve its search
                    capability, for example, Printer, toner, paper
                  </p>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={3}>
                  <h2 className="align-right">Internal Comments</h2>
                </Grid>
                <Grid item xs={9}>
                  <input
                    id="keywords"
                    type="text"
                    name="keywords"
                    className="form-control input-field"
                  />
                </Grid>
              </Grid>
            </Grid>
          </MDBCol>
        </MDBRow>

        <MDBCol md="12">
          <MDBRow className="border-box">
            <MDBCol md="12" className="mt-2 mb-2">
              <div className="d-flex justify-content-center align-items-center">
                <button
                  type="button"
                  className="btn btn-primary custom-btn-margin"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary custom-btn-margin"
                >
                  Save and Approve
                </button>
                <button
                  type="button"
                  className="btn btn-secondary custom-btn-margin"
                >
                  Cancel
                </button>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </Grid>
    </Grid>
  );
};

export default CreateTicketSolution;
