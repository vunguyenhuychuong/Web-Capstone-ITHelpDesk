import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { AddDataProfile } from "../../../app/api";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import {
  ArrowBack,
  Close,
} from "@mui/icons-material";
import { genderOptions, roleOptions } from "../../helpers/tableComlumn";
import moment from "moment";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { getAllCompanyList } from "../../../app/api/company";
import { getAllDepartmentSelect } from "../../../app/api/department";

const CreateUser = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    userModel: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      role: 0,
      gender: 0,
      avatarUrl: "",
      phoneNumber: "",
      dateOfBirth: "",
    },
    companyId: 0,
    departmentId: 0,
    isCompanyAdmin: true,
  });
  const [dataCompany, setDataCompany] = useState([]);
  const [dataDepartment, setDataDepartment] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [DateBirth, setDateBirth] = useState(moment());
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phoneNumber: "",
  });

  const handleIsCompanyAdminChange = (newValue) => {
    setData((prevData) => ({
      ...prevData,
      isCompanyAdmin: newValue,
    }));
  };

  const fetchDepartmentsByCompany = async (companyId) => {
    try {
      if (!companyId) {
        console.error("companyId is null or undefined");
        return;
      }
      const departmentList = await getAllDepartmentSelect(companyId);
      setDataDepartment(departmentList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchDataCreateUser = async () => {
      try {
        const companyList = await getAllCompanyList();
        setDataCompany(companyList);
        if (companyList.length > 0) {
          setData((prevData) => ({
            ...prevData,
            companyId: companyList[0].id,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataCreateUser();
  }, []);
  
  useEffect(() => {
    if (data.companyId) {
      fetchDepartmentsByCompany(data.companyId);
    }
  }, [data.companyId]);
  
  useEffect(() => {
    if (dataDepartment && dataDepartment.length > 0) {
      setData((prevData) => ({
        ...prevData,
        departmentId: dataDepartment[0].id,
      }));
    }
  }, [dataDepartment]);

  const images = imagePreviewUrl.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

  const handleDateOfBirthChange = (newValue) => {
    const formattedDateOfBirth = moment(newValue).format("YYYY-MM-DDTHH:mm:ss");

    setData((prevInputs) => ({
      ...prevInputs,
      userModel: {
        ...prevInputs.userModel,
        dateOfBirth: formattedDateOfBirth,
      },
    }));
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in data.userModel) {
      setData((prevData) => ({
        ...prevData,
        userModel: {
          ...prevData.userModel,
          [name]: name === "gender" ? parseInt(value, 10) : value,
        },
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
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
    if (name === "companyId") {
      fetchDepartmentsByCompany(parseInt(value, 10));
    }
    if (name === "phoneNumber" && value.length > 0) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: "Invalid phone number",
        }));
      }
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    const companyId = parseInt(data.companyId, 10);
    const departmentId = parseInt(data.departmentId, 10);
    const role = parseInt(data.userModel.role, 10);

    const errors = {};
    if (!data.userModel.firstName) {
      errors.firstName = "First Name is required";
    }
    if (!data.userModel.lastName) {
      errors.userModel.lastName = "Last Name is required";
    }
    if (!data.userModel.username) {
      errors.username = "User Name is required";
    }
    if (!data.userModel.email) {
      errors.email = "Email  is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsSubmitting(true);
    try {
      let avatarUrl = data.userModel.avatarUrl;
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      const formattedDateOfBirth = moment(data.userModel.dateOfBirth).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const updatedData = {
        userModel: {
          ...data.userModel,
          avatarUrl: avatarUrl,
          dateOfBirth: formattedDateOfBirth,
        },
        companyId: companyId,
        departmentId: departmentId,
        isCompanyAdmin: data.isCompanyAdmin,
      };
      setData(updatedData);
      await AddDataProfile({
        userModel: {
          firstName: data.userModel.firstName,
          lastName: data.userModel.lastName,
          username: data.userModel.username,
          password: data.userModel.password,
          email: data.userModel.email,
          role: role,
          gender: data.userModel.gender,
          avatarUrl: data.userModel.avatarUrl,
          phoneNumber: data.userModel.phoneNumber,
          dateOfBirth: data.userModel.dateOfBirth,
        },
        companyId: companyId,
        departmentId: departmentId,
        isCompanyAdmin: data.isCompanyAdmin,
      });
      navigate("/home/userList");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    const isFormFilled =
      data.userModel.firstName.trim() !== "" ||
      data.userModel.lastName.trim() !== "" ||
      data.userModel.username.trim() !== "" ||
      data.userModel.password.trim() !== "" ||
      data.userModel.email.trim() !== "";
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
                          marginBottom: "10px",
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
                  Avatar User
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="file"
                  name="file"
                  className="form-control-text input-field"
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
                        }}
                      >
                        role
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <select
                        id="role"
                        name="role"
                        className="form-select-custom"
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
                        <span style={{ color: "red" }}>*</span>Company
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <select
                        id="companyId"
                        name="companyId"
                        className="form-select-custom"
                        value={data.companyId}
                        onChange={handleInputChange}
                      >
                        {dataCompany
                          .filter((company) => company.id !== "")
                          .map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.companyName}
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
                          marginBottom: "40px",
                        }}
                      >
                        Phone Number
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        id="phoneNumber"
                        type="phoneNumber"
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
                        <span style={{ color: "red" }}>*</span>Department
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <select
                        id="departmentId"
                        name="departmentId"
                        className="form-select-custom"
                        value={data.departmentId}
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
                        Date Create
                      </h2>
                    </Grid>
                    <Grid item xs={6}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          value={DateBirth}
                          onChange={(newValue) =>
                            handleDateOfBirthChange(newValue)
                          }
                          renderInput={(props) => <TextField {...props} />}
                        />
                      </LocalizationProvider>
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
                        CompanyAdmin
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

export default CreateUser;
