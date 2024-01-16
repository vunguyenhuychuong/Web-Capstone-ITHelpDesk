import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import { ArrowBack, Close } from "@mui/icons-material";
import { genderOptions } from "../../helpers/tableComlumn";
import { createCompanyMember } from "../../../app/api/companyMember";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useSelector } from "react-redux";
import { getAllDepartmentSelect } from "../../../app/api/department";

const CreateCompanyMember = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const userCompanyId = user.user.companyId;
  const [data, setData] = useState({
    user: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      gender: 0,
      avatarUrl: "",
      phoneNumber: "",
    },
    isCompanyAdmin: false,
    memberPosition: "",
    companyAddressId: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataDepartment, setDataDepartment] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    memberPosition: "",
  });

  const images = imagePreviewUrl.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile([file]);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreviewUrl([reader.result]);
    };

    reader.readAsDataURL(file);
    setIsImagePreviewOpen(true);
  };

  const fetchDepartmentsByCompany = async (userCompanyId) => {
    try {
      if (!userCompanyId) {
        console.error("companyId is null or undefined");
        return;
      }
      const departmentList = await getAllDepartmentSelect(userCompanyId);
      setDataDepartment(departmentList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIsCompanyAdminChange = (newValue) => {
    setData((prevData) => ({
      ...prevData,
      isCompanyAdmin: newValue,
    }));
  };

  const handleMemberPositionChange = (newValue) => {
    setData((prevData) => ({
      ...prevData,
      memberPosition: newValue,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name in data.user) {
      setData((prevData) => ({
        ...prevData,
        user: {
          ...prevData.user,
          [name]: name === "gender" ? +value : value,
        },
      }));
    } else {
      const numericValue =
        name === "companyAddressId" ? parseInt(value, 10) : value;
      setData((prevData) => ({
        ...prevData,
        [name]: numericValue,
      }));
    }
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
    if (!data.user.firstName) {
      errors.firstName = "First Name is required";
    }
    if (!data.user.lastName) {
      errors.lastName = "Last Name is required";
    }
    if (!data.user.username) {
      errors.username = "User Name is required";
    }
    if (!data.user.email) {
      errors.email = "Email is required";
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
        user: {
          avatarUrl: avatarUrl,
        },
        isCompanyAdmin: data.isCompanyAdmin,
        memberPosition: data.memberPosition,
        companyAddressId: data.companyAddressId,
      };
      setData(updatedData);
      await createCompanyMember({
        user: {
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          username: data.user.username,
          email: data.user.email,
          gender: data.user.gender,
          avatarUrl: avatarUrl,
          phoneNumber: data.user.phoneNumber,
        },
        isCompanyAdmin: data.isCompanyAdmin,
        memberPosition: data.memberPosition,
        companyAddressId: data.companyAddressId,
      });
      navigate("/home/companyMember");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDepartmentsByCompany(userCompanyId);
  }, [userCompanyId]);

  const handleGoBack = () => {
    const isFormFilled =
      data.user.firstName.trim() !== "" ||
      data.user.lastName.trim() !== "" ||
      data.user.username.trim() !== "" ||
      data.user.email.trim() !== "" ||
      data.user.phoneNumber.trim() !== "" ||
      data.memberPosition.trim() !== "";
    if (isFormFilled) {
      const confirmLeave = window.confirm(
        "Are you sure you want to leave? Your changes may not be saved."
      );
      if (!confirmLeave) {
        return;
      }
    }
    navigate(`/home/companyMember`);
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
                <Stack direction={"row"} alignItems={"center"}>
                  <Button>
                    <ArrowBack
                      onClick={handleGoBack}
                      style={{ color: "#0099FF" }}
                    />
                  </Button>
                </Stack>

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
                    Create Customer
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Create a customer for assistance.
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
                        <span style={{ color: "red" }}>*</span>User Name
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        id="username"
                        type="text"
                        name="username"
                        className="form-control-text input-field"
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
                        }}
                      >
                        Gender
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
                  Attachment
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="file"
                  name="file"
                  className="form-control input-field"
                  id="attachmentUrls"
                  onChange={handleFileChange}
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
                        <span style={{ color: "red" }}>*</span>phone number
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
                        <span style={{ color: "red" }}>*</span>Member Position
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        id="memberPosition"
                        type="text"
                        name="memberPosition"
                        className="form-control-text input-field"
                        value={data.memberPosition}
                        onChange={(e) =>
                          handleMemberPositionChange(e.target.value)
                        }
                      />
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
                          marginBottom: "20px",
                        }}
                      >
                        Company Admin
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <select
                        id="isCompanyAdmin"
                        name="isCompanyAdmin"
                        className="form-select-custom"
                        value={data.isCompanyAdmin}
                        onChange={(e) =>
                          handleIsCompanyAdminChange(e.target.value === "true")
                        }
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
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
                        <span style={{ color: "red" }}>*</span>Company Address
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <select
                        id="companyAddressId"
                        name="companyAddressId"
                        className="form-select-custom"
                        value={data.companyAddressId}
                        onChange={handleInputChange}
                      >
                        {dataDepartment &&
                          dataDepartment
                            .filter((department) => department.id !== "")
                            .map((department) => (
                              <option key={department.id} value={department.id}>
                                {department.address}
                              </option>
                            ))}
                      </select>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}></Grid>
                    <Grid item xs={6}></Grid>
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
        onClose={() => setIsImagePreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Image Preview
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setIsImagePreviewOpen(false)}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Gallery items={images} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default CreateCompanyMember;
