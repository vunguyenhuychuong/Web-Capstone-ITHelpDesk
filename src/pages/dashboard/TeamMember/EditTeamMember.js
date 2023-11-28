import React, { useState } from "react";
import "../../../assets/css/ticketSolution.css";
import { Grid } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createTeamMemberAssign,
  getMemberSelect,
} from "../../../app/api/teamMember";
import { getAllTeams } from "../../../app/api/team";
import { useEffect } from "react";

const EditTeamMember = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    memberId: 1,
    teamId: 1,
    expertises: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataTeam, setDataTeam] = useState([]);
  const [dataMember, setDataMember] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    expertises: "",
  });

  const fetchDataTeamSelect = async () => {
    try {
      const res = await getAllTeams();
      setDataTeam(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataMemberSelect = async (teamId) => {
    try {
      const res = await getMemberSelect(teamId);
      setDataMember(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataTeamSelect();
  }, []);

  useEffect(() => {
    if (data.teamId) {
      fetchDataMemberSelect(data.teamId);
    }
  }, [data.teamId]);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === "memberId" || name === "teamId") {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

    if (name === "teamId") {
      try {
        await fetchDataMemberSelect(value);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.expertises) {
      errors.expertises = "Expertises is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createTeamMemberAssign({
        memberId: data.memberId,
        teamId: data.teamId,
        expertises: data.expertises,
      });
      if (
        response.data.isError &&
        response.data.responseException.exceptionMessage
      ) {
        console.log(response.data.responseException.exceptionMessage);
      } else {
        toast.success("TeamMember created successfully");
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/home/teamMember`);
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
                    onClick={() => handleGoBack()}
                    className="arrow-back-icon"
                  />
                </button>

                <div
                  style={{
                    marginLeft: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                  >
                    New TeamMember
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Create a new member for assistance.
                  </span>
                </div>
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
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        <span style={{ color: "red" }}>*</span>Member ID
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="teamId"
                        name="teamId"
                        className="form-select"
                        value={data.teamId}
                        onChange={handleInputChange}
                      >
                        {dataTeam
                          .filter((team) => team.id !== "")
                          .map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                      </select>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        <span style={{ color: "red" }}>*</span>Team
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="memberId"
                        name="memberId"
                        className="form-select"
                        value={data.memberId}
                        onChange={handleInputChange}
                        disabled={data.memberId}
                      >
                        {dataMember.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.firstName} {member.lastName}
                          </option>
                        ))}
                      </select>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <h2
                  className="align-right"
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  <span style={{ color: "red" }}>*</span>expertises
                </h2>
              </Grid>
              <Grid item xs={9}>
                <textarea
                  type="expertises"
                  id="description"
                  name="expertises"
                  className="form-control input-field-2"
                  rows="3"
                  value={data.expertises}
                  onChange={handleInputChange}
                />
                {fieldErrors.expertises && (
                  <div style={{ color: "red" }}>{fieldErrors.expertises}</div>
                )}
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
                  onClick={handleSubmitTicket}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary custom-btn-margin"
                  onClick={() => handleGoBack()}
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

export default EditTeamMember;
