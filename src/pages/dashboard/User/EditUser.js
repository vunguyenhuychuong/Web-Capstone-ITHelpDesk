import React, { useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch,
  Tooltip,
} from "@mui/material";
import { UpdateUser, getUserById } from "../../../app/api";
import { ArrowBack, Close } from "@mui/icons-material";
import { genderOptions } from "../../helpers/tableComlumn";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useEffect } from "react";

const EditUser = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: 0,
    phoneNumber: "",
    isActive: true,
    dateOfBirth: "",
    address: "",
    avatarUrl: "",
  });
  const [date, setDate] = useState(moment());
  const { userId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    dateOfBirth: "",
  });

  const closeImagePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const handleDateChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DD");

    const maxAllowedDate = moment("2005-12-31");
    if (moment(newDate).isAfter(maxAllowedDate)) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        dateOfBirth:
          "Selected date exceeds the maximum allowed date (2005-12-31)",
      }));
      return;
    }
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      dateOfBirth: "",
    }));
    setDate(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      dateOfBirth: formattedDate,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
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

    if (name === "phoneNumber") {
      if (!/^\d{10}$/.test(value)) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: "Phone Number must be at least 10 digits",
        }));
      }
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
    if (!data.email) {
      errors.email = "Email  is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      let avatarUrl = data.avatarUrl;
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      const updatedData = {
        ...data,
        avatarUrl: avatarUrl,
      };
      setData(updatedData);
      const result = await UpdateUser(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          isActive: data.isActive,
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          avatarUrl: avatarUrl,
        },
        userId
      );
      if (result.success) {
        toast.success("User updated successfully", {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDetail = await getUserById(userId);
        setData((prevData) => ({
          ...prevData,
          firstName: userDetail.firstName,
          lastName: userDetail.lastName,
          email: userDetail.email,
          phoneNumber: userDetail.phoneNumber,
          gender: userDetail.gender,
          isActive: userDetail.isActive,
          dateOfBirth: userDetail.dateOfBirth,
          address: userDetail.address,
          avatarUrl: userDetail.avatarUrl,
        }));
        setImagePreviewUrl(userDetail.avatarUrl);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [userId]);

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
                      Edit User
                    </h2>
                  </Tooltip>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Edit change user for assistance.
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
                        className="form-control-text input-field"
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
                        className="form-control-text input-field"
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
                        <span style={{ color: "red" }}>*</span>email
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        className="form-control-text input-field"
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
                          marginBottom: "40px",
                        }}
                      >
                        <span style={{ color: "red" }}>*</span>Phone Number
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        id="phoneNumber"
                        type="text"
                        name="phoneNumber"
                        className="form-control-text input-field"
                        value={data.phoneNumber}
                        onChange={handleInputChange}
                      />
                       {fieldErrors.phoneNumber && (
                        <div style={{ color: "red" }}>
                          {fieldErrors.phoneNumber}
                        </div>
                      )}
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
                  Image Avatar
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="file"
                  name="file"
                  className="form-control input-field"
                  id="avatarUrl"
                  onChange={handleFileChange}
                  defaultValue={data.avatarUrl}
                />
                {imagePreviewUrl && (
                  <div
                    className="image-preview"
                    onClick={() => setIsImagePreviewOpen(true)}
                  >
                    <p className="preview-text">
                      Click here to view attachment
                    </p>
                  </div>
                )}
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
                        <span style={{ color: "red" }}>*</span>Gender
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <select
                        id="gender"
                        name="gender"
                        className="form-select-custom"
                        value={data.gender}
                        onChange={handleInputChange}
                      >
                        {genderOptions
                          .filter((gender) => gender.id !== "")
                          .map((gender) => (
                            <option key={gender.id} value={gender.id}>
                              {gender.name}
                            </option>
                          ))}
                      </select>
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
                        Status
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={data.isActive}
                              onChange={() =>
                                setData((prevData) => ({
                                  ...prevData,
                                  isActive: !prevData.isActive,
                                }))
                              }
                            />
                          }
                          label={data.isActive ? "Active" : "Inactive"}
                        />
                      </FormGroup>
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
      <Dialog
        open={isImagePreviewOpen}
        onClose={closeImagePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Image Preview
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeImagePreview}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img
            src={imagePreviewUrl}
            alt="Attachment Preview"
            style={{ width: "100%" }}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default EditUser;
