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
  Tooltip,
} from "@mui/material";
import { AddDataProfile } from "../../../app/api";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { ArrowBack, Close } from "@mui/icons-material";
import { genderOptions, roleOptions } from "../../helpers/tableComlumn";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAllCompanyList } from "../../../app/api/company";
import { getAllDepartmentSelect } from "../../../app/api/department";

const CreateUser = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    role: 0,
    gender: 0,
    avatarUrl: "",
    phoneNumber: "",
    companyDetail: {
      companyId: 0,
      companyAddressId: 0,
      isCompanyAdmin: true,
    },
  });
  const [dataCompany, setDataCompany] = useState([]);
  const [dataDepartment, setDataDepartment] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      } catch (error) {
        console.log(error);
      }
    };
    fetchDataCreateUser();
  }, [data.companyId]);
<<<<<<< Updated upstream
=======
  
  useEffect(() => {
    if (dataDepartment && dataDepartment.length > 0) {
      setData((prevData) => ({
        ...prevData,
        companyAddressId: dataDepartment[0].id,
      }));
    }
  }, [dataDepartment]);
>>>>>>> Stashed changes

  useEffect(() => {
    if (data.companyId) {
      fetchDepartmentsByCompany(data.companyId);
    }
  }, [data.companyId]);

  useEffect(() => {
    if (dataDepartment && dataDepartment.length > 0) {
      setData((prevData) => ({
        ...prevData,
        companyDetail: {
          ...prevData.companyDetail,
          companyAddressId: dataDepartment[0].id,
        },
      }));
    }
  }, [dataDepartment]);
  
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setData((prevData) => ({
      ...prevData,
      [name]: name === "gender" ? parseInt(value, 10) : value,
      companyDetail: {
        ...prevData.companyDetail,
        [name]: name === "isCompanyAdmin" ? value === "true" : parseInt(value, 10),
      },
    }));
  
    if (name === "role") {
      handleRoleChangeLogic(value);
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
  
    if (name === "phoneNumber") {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: "Invalid phone number",
        }));
      } else {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: "",
        }));
      }
    }
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();

    const companyId = parseInt(data.companyDetail.companyId, 10);
    const companyAddressId = parseInt(data.companyDetail.companyAddressId, 10);
    const role = parseInt(data.role, 10);

    const errors = {};
    if (!data.firstName) {
      errors.firstName = "First Name is required";
    }
    if (!data.lastName) {
      errors.userModel.lastName = "Last Name is required";
    }
    if (!data.username) {
      errors.username = "User Name is required";
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
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        role: role,
        gender: data.gender,
        avatarUrl: avatarUrl,
        phoneNumber: data.phoneNumber,
        companyDetail: {
          companyId: companyId,
          companyAddressId: companyAddressId,
          isCompanyAdmin: data.companyDetail.isCompanyAdmin,
        },
      };
      setData(updatedData);
      await AddDataProfile(updatedData);
      navigate("/home/userList");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChangeLogic = (selectedRoleId) => {
    const roleId = parseInt(selectedRoleId, 10);
  
    console.log("Selected Role ID:", roleId);
  
    if (roleId === 1) {
      setData((prevData) => ({
        ...prevData,
        role: 1,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        isCompanyAdmin: false,
      }));
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
                {data.role === 1 && (
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
                        <span style={{ color: "red" }}>*</span>CompanyAdmin
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
                 )}
              </Grid>
              {data.role === 1 && (
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
                        Brand Address
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
              </Grid>
              )}
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
