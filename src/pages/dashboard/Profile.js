import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
} from "mdb-react-ui-kit";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Select,
  DialogContent,
  Button,
  Grid,
  MenuItem,
  Tooltip,
  FormControl,
  InputLabel,
  CircularProgress,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import "../../assets/css/profile.css";
import React, { useEffect, useState } from "react";
import { GetDataProfileUser, UpdateProfile } from "../../app/api";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import ChangePassword from "../ChangePassword";
import {
  genderOptions,
  getGenderById,
  getRoleNameById,
} from "../helpers/tableComlumn";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { CalendarMonth, LocalPhone, Mail, Portrait } from "@mui/icons-material";
import CustomTextField from "../CustomTextField";
import { Image } from "primereact/image";

export const VisuallyHidden = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Profile = (props) => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    avatarUrl: "",
    phoneNumber: "",
    address: "",
    gender: "",
    team: "",
    role: "",
    company: {
      id: 0,
      companyName: "",
      taxCode: "",
      website: "",
      phoneNumber: "",
      email: "",
      addresses: "",
      fieldOfBusiness: "",
      isActive: "",
      createdAt: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    address: "",
  });

  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openChangePassword, setChangePassword] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    const reader = new FileReader();

    reader.onloadend = () => {
      setData((prevInputs) => ({
        ...prevInputs,
        avatarUrl: reader.result,
      }));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setOpenAdd(false);
  };

  const handleOpenEditUser = (e) => {
    e.preventDefault();
    setOpenAdd(true);
  };

  const handleOpenChangePW = (e) => {
    e.preventDefault();
    setChangePassword(true);
  };

  const handleCloseChangePW = (e) => {
    setChangePassword(false);
  };

  const fetchDataProfile = async () => {
    try {
      const profile = await GetDataProfileUser();
      setData(profile);
    } catch (error) {}
  };

  useEffect(() => {
    fetchDataProfile();
  }, []);

  const onHandleEditProfile = async () => {
    const newErrors = {};

    if (!data.firstName) {
      newErrors.firstName = "First Name is required";
    }

    if (!data.lastName) {
      newErrors.lastName = "Last Name is required";
    }

    if (!data.email) {
      newErrors.email = "Email is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill out all required fields.");
      return;
    }

    setErrors({});
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
      await UpdateProfile(updatedData);
      toast.success("Edit Profile Successful");
      setOpenAdd(false);
      fetchDataProfile();
    } catch (error) {
      console.error(error);
      toast.error("Error editing ticket solution");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      {data && Object.keys(data).length > 0 ? (
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4" style={{ height: "650px" }}>
                <MDBCardBody className="text-center">
                  <div className="card flex justify-content-center">
                    <Image
                      src={
                        data && data.avatarUrl
                          ? data.avatarUrl
                          : "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                      }
                      alt="Avatar"
                      width="250"
                      height="300"
                      preview
                    />
                  </div>
                  <p
                    className="text-muted mb-1"
                    style={{ fontSize: "24px", fontWeight: "bold" }}
                  >
                    {data && data.firstName ? data.firstName : "N/A"} {""}
                    {data && data.lastName ? data.lastName : "N/A"}
                  </p>
                  <p className="text-muted mb-4">
                    {getRoleNameById(data.role)}
                  </p>
                  <div className="d-flex justify-content-center mb-2">
                    <Tooltip title="Edit Profile">
                      <MDBBtn onClick={handleOpenEditUser}>
                        <EditIcon />
                      </MDBBtn>
                    </Tooltip>
                    <Tooltip title="Change Your Password">
                      <MDBBtn
                        outline
                        className="ms-2"
                        onClick={handleOpenChangePW}
                      >
                        <LockIcon style={{ marginRight: "8px" }} />
                      </MDBBtn>
                    </Tooltip>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <div className="blue-summary">
                <h4>About Your Profile Information</h4>
              </div>
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText
                        style={{ fontWeight: "bold", color: "#000000" }}
                      >
                        UserName
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.username ? data.username : "Loading"}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <Portrait
                        fontSize="small"
                        color="primary"
                        onClick={handleOpenEditUser}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText
                        style={{ fontWeight: "bold", color: "#000000" }}
                      >
                        Email-personal:
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.email ? data.email : "Loading"}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <Mail
                        fontSize="small"
                        color="primary"
                        onClick={handleOpenEditUser}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText
                        style={{ fontWeight: "bold", color: "#000000" }}
                      >
                        Phone-personal:
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.phoneNumber ? data.phoneNumber : "N/A"}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <LocalPhone
                        fontSize="small"
                        color="primary"
                        onClick={handleOpenEditUser}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText
                        style={{ fontWeight: "bold", color: "#000000" }}
                      >
                        Gender :
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && getGenderById(data.gender)}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <EditIcon
                        fontSize="small"
                        color="primary"
                        onClick={handleOpenEditUser}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText
                        style={{ fontWeight: "bold", color: "#000000" }}
                      >
                        Address :
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data.address}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <CalendarMonth
                        fontSize="small"
                        color="primary"
                        onClick={handleOpenEditUser}
                      />
                    </MDBCol>
                  </MDBRow>
                  <hr />
                </MDBCardBody>
              </MDBCard>
              <MDBRow>
                <MDBCol md="7">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText
                        className="mb-4"
                        style={{ fontWeight: "bold", color: "black" }}
                      >
                        Company Information
                      </MDBCardText>
                      <MDBCardText
                        className="mb-1"
                        style={{ fontSize: "1rem" }}
                      >
                        Name:{" "}
                        {data && data.company && data.company.companyName
                          ? data.company.companyName
                          : "N/A"}
                      </MDBCardText>
                      <MDBCardText
                        className="mt-4 mb-1"
                        style={{ fontSize: "1rem" }}
                      >
                        Tax Code:{" "}
                        {data && data.company && data.company.taxCode
                          ? data.company.taxCode
                          : "N/A"}
                      </MDBCardText>
                      <MDBCardText
                        className="mt-4 mb-1"
                        style={{ fontSize: "1rem" }}
                      >
                        Business Role:{" "}
                        {data && data.company && data.company.fieldOfBusiness
                          ? data.company.fieldOfBusiness
                          : "N/A"}
                      </MDBCardText>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
                <MDBCol md="5">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText
                        className="mb-4"
                        style={{ fontWeight: "bold", color: "black" }}
                      >
                        About us
                      </MDBCardText>
                      <MDBCardText
                        className="mb-1"
                        style={{ fontSize: "1rem" }}
                      >
                        Email-Co:{" "}
                        {data && data.email && data.company.email && (
                          <a
                            href={`mailto:${data.company.email}`}
                            style={{ textDecoration: "underline" }}
                          >
                            {data.company.email ? data.company.email : "N/A"}
                          </a>
                        )}
                      </MDBCardText>
                      <MDBCardText
                        className="mt-4 mb-1"
                        style={{ fontSize: "1rem" }}
                      >
                        Phone-company:{" "}
                        {data &&
                          data.phoneNumber &&
                          data.company.phoneNumber && (
                            <a
                              href={`tel:${data.company.phoneNumber}`}
                              style={{ textDecoration: "underline" }}
                            >
                              {data.company.phoneNumber
                                ? data.company.phoneNumber
                                : "N/A"}
                            </a>
                          )}
                      </MDBCardText>
                      <MDBCardText
                        className="mt-4 mb-1"
                        style={{ fontSize: "1rem" }}
                      >
                        Website-company:{" "}
                        {data && data.company && data.company.website && (
                          <a
                            href={data.company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {data.company.website
                              ? data.company.website
                              : "N/A"}
                          </a>
                        )}
                      </MDBCardText>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading data...
        </div>
      )}
      <Dialog open={openAdd} maxWidth="lg" fullWidth>
        <DialogTitle className="text-center" style={{ background: "#66CCFF" }}>
          <h2 style={{ fontWeight: "bold", color: "white", marginTop: "20px" }}>
            Information about user
          </h2>
        </DialogTitle>
        <DialogContent open={open} style={{ backgroundColor: "#eee" }}>
          <MDBCard className="mb-4" style={{ backgroundColor: "#FFFFFF" }}>
            <MDBCardBody className="text-center">
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  {data && data.avatarUrl ? (
                    <MDBCardImage
                      src={data.avatarUrl}
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: "250px" }}
                      fluid
                    />
                  ) : (
                    <MDBCardImage
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: "250px" }}
                      fluid
                    />
                  )}
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHidden
                      type="file"
                      onChange={handleFileChange}
                      {...props}
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} md={8}>
                  <CustomTextField
                    label="FirstName"
                    name="firstName"
                    value={data.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    helperText={
                      <span style={{ color: "red" }}>{errors.firstName}</span>
                    }
                  />
                  <CustomTextField
                    label="Last Name"
                    name="lastName"
                    value={data.lastName}
                    onChange={handleChange}
                    helperText={
                      <span style={{ color: "red" }}>{errors.lastName}</span>
                    }
                  />
                  <CustomTextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={data.phoneNumber}
                    onChange={handleChange}
                  />
                  <FormControl
                    fullWidth
                    variant="outlined"
                    size="small"
                    style={{ marginTop: "16px" }}
                  >
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      value={data.gender}
                      onChange={handleChange}
                      label="Gender"
                      style={{ textAlign: "center" }} // Center align the selected value
                    >
                      {genderOptions.map((gender) => (
                        <MenuItem key={gender.id} value={gender.id}>
                          <ListItemText
                            primary={gender.name}
                            style={{ textAlign: "left" }}
                          />{" "}
                          {/* Left align the menu item text */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </MDBCardBody>
          </MDBCard>
          <DialogActions>
            <>
              <Button
                onClick={onHandleEditProfile}
                variant="outlined"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : <EditIcon />}
              </Button>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="secondary"
              >
                <CloseIcon />
              </Button>
            </>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog fullWidth open={openChangePassword} onClose={handleCloseChangePW}>
        <ChangePassword onCancel={handleCloseChangePW} />
      </Dialog>
    </section>
  );
};
export default Profile;
