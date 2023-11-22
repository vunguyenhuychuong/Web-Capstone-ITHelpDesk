import React, { useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { AddDataProfile } from "../../../app/api";
import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { roleOptions } from "../../helpers/tableComlumn";
import zxcvbn from "zxcvbn";

const CreateUser = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    role: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const getPasswordStrength = () => {
    const passwordStrength = zxcvbn(data.password);
    const score = passwordStrength.score;

    switch (score) {
      case 0:
        return { label: "Weak", color: "red" };
      case 1:
        return { label: "Fair", color: "orange" };
      case 2:
        return { label: "Good", color: "yellow" };
      case 3:
        return { label: "Strong", color: "green" };
      case 4:
        return { label: "Very Strong", color: "blue" };
      default:
        return { label: "", color: "" };
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "role" ? parseInt(value, 10) : value;

    setData((prevData) => ({ ...prevData, [name]: newValue }));
    setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          email: "Invalid email format",
        }));
      }
    }

    if (name === "username" && value.length < 6) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username must be at least 6 characters",
      }));
    }
    if (name === "firstName" && value.length < 2) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        firstName: "First Name must be at least 2 characters",
      }));
    }

    if (name === "lastName" && value.length < 2) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        lastName: "Last Name must be at least 2 characters",
      }));
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.firstName) {
      errors.firstName = "First Name is required";
    }
    if (!data.lastName) {
      errors.lastName = "Last Name is required";
    }
    if (!data.username) {
      errors.username = "User Name is required";
    }
    if (!data.password) {
      errors.password = "Password  is required";
    }
    if (!data.email) {
      errors.email = "Email  is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await AddDataProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        email: data.email,
        role: data.role,
      });
      if (result.success) {
        toast.success("User created successfully", {
          autoClose: 2000,
          hideProgressBar: false,
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        toast.error(result.message, {
          autoClose: 2000,
          hideProgressBar: false,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    const isFormFilled =
      data.firstName.trim() !== "" ||
      data.lastName.trim() !== "" ||
      data.username.trim() !== "" ||
      data.password.trim() !== "" ||
      data.email.trim() !== "";
      if (isFormFilled) {
        const confirmLeave = window.confirm(
          "Are you sure you want to leave? Your changes may not be saved."
        );
        if (!confirmLeave) {
          return; 
        }
      }
    navigate(`/home/userList`);
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

                <div
                  style={{
                    marginLeft: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Tooltip title="Create a new user for system" arrow>
                    <h2
                      style={{
                        fontSize: "30px",
                        fontWeight: "bold",
                        marginRight: "10px",
                      }}
                    >
                      New User
                    </h2>
                  </Tooltip>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Create a new user for assistance.
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
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
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
                        <span style={{ color: "red" }}>*</span>First Name
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        className="form-control input-field"
                        value={data.firstName}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.firstName && (
                        <div style={{ color: "red" }}>
                          {fieldErrors.firstName}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "right",
                          marginBottom: "40px",
                        }}
                      >
                        <span style={{ color: "red" }}>*</span>Last Name
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        className="form-control input-field"
                        value={data.lastName}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.lastName && (
                        <div style={{ color: "red" }}>
                          {fieldErrors.lastName}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
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
                        <span style={{ color: "red" }}>*</span>User Name
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        className="form-control input-field"
                        value={data.username}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.username && (
                        <div style={{ color: "red" }}>
                          {fieldErrors.username}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "right",
                          marginBottom: "40px",
                        }}
                      >
                        <span style={{ color: "red" }}>*</span>Password
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control input-field"
                        value={data.password}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.password && (
                        <div style={{ color: "red" }}>
                          {fieldErrors.password}
                        </div>
                      )}
                      {data.password && (
                        <div
                          style={{
                            marginTop: "10px",
                            color: getPasswordStrength().color,
                          }}
                        >
                          Password Seem: {getPasswordStrength().label}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
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
                        <span style={{ color: "red" }}>*</span>email
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        className="form-control input-field"
                        value={data.email}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.email && (
                        <div style={{ color: "red" }}>{fieldErrors.email}</div>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

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
                        role
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <select
                        id="role"
                        name="role"
                        className="form-select"
                        value={data.role}
                        onChange={handleInputChange}
                      >
                        {roleOptions
                          .filter((role) => role.id !== "")
                          .map((role) => (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                      </select>
                    </Grid>
                  </Grid>
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
                  onClick={handleSubmitUser}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary custom-btn-margin"
                  onClick={handleGoBack}
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

export default CreateUser;
