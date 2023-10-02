import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  Select,
  DialogContent,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateField } from "@mui/x-date-pickers/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "../../assets/css/profile.css";
import React, { useEffect, useState } from "react";
import {
  GetDataProfileUser,
  UpdateProfileUser,
  getDataProfile,
} from "../../app/api";
import { toast } from "react-toastify";
import { da } from "@faker-js/faker";

const Profile = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    avatarUrl: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: 0,
    team: "",
  });

  const genderOptions = [
    { id: 0, name: "Male" },
    { id: 1, name: "Female" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevInputs) => ({
        ...prevInputs,
        [name]: value,
    }));
  };

  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
    setOpenAdd(false);
  };

  const handleOpenEditUser = (e) => {
    e.preventDefault();
    setOpenAdd(true);
  };

  useEffect(() => {
    const fetchDataProfile = async () => {
      const profile = await GetDataProfileUser();
      setData(profile);
    };
    fetchDataProfile();
  }, []);

  const onHandleEditProfile = async () => {
    const user = JSON.parse(localStorage.getItem("profileAdmin"));
    const accessToken = user.result.accessToken;
    const header = `Bearer ${accessToken}`;
    try{
      const editProfile = await axios.patch('https://localhost:7043/v1/itsds/user/update-profile',{
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        address: data.address
      },
      {
        headers: {
          Authorization: header,
        },
      });
      toast.success("Edit Successful");
      console.log(editProfile);
    }catch(err){
      console.log(err);
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      {data && Object.keys(data).length > 0 ? (
        <MDBContainer className="py-5">
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                  {data && data.avatarUrl ? (
                    <MDBCardImage
                      src={data.avatarUrl}
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: "150px" }}
                      fluid
                    />
                  ) : (
                    <MDBCardImage
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: "150px" }}
                      fluid
                    />
                  )}
                  <p className="text-muted mb-1">
                    {data && data.firstName ? data.firstName : "N/A"}{" "}
                    {data && data.lastName ? data.lastName : "N/A"}
                  </p>
                  <p className="text-muted mb-4">
                    {data.result && data.result.address
                      ? data.result.address
                      : "N/A"}
                  </p>
                  <div className="d-flex justify-content-center mb-2">
                    <MDBBtn onClick={handleOpenEditUser}>Edit</MDBBtn>
                    <MDBBtn outline className="ms-1">
                      Change password
                    </MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>

              <MDBCard className="mb-4 mb-lg-0">
                <MDBCardBody className="p-0">
                  <MDBListGroup className="rounded-3">
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon fas icon="globe fa-lg text-warning" />
                      <MDBCardText>
                        {data && data.company ? data.company : "N/A"}
                      </MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        icon="github fa-lg"
                        style={{ color: "#333333" }}
                      />
                      <MDBCardText>
                        {data && data.team ? data.team : "N/A"}
                      </MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        icon="twitter fa-lg"
                        style={{ color: "#55acee" }}
                      />
                      <MDBCardText>@mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        icon="instagram fa-lg"
                        style={{ color: "#ac2bac" }}
                      />
                      <MDBCardText>mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        icon="facebook fa-lg"
                        style={{ color: "#3b5998" }}
                      />
                      <MDBCardText>mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
              <MDBCard className="mb-4">
                <MDBCardBody>
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>UserName</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {data && data.username ? data.username : "Loading"}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Email</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {data && data.email ? data.email : "Loading"}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Phone</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {data && data.phoneNumber ? data.phoneNumber : "N/A"}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Role</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        (098) 765-4321
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Date Of Birth</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {data && data.dateOfBirth ? data.dateOfBirth : "N/A"}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Team</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {data && data.team ? data.team : "N/A"}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText>Company</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">
                        {data && data.company ? data.company : "N/A"}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
              <MDBRow>
                <MDBCol md="6">
                  <MDBCard className="mb-4 mb-md-0">
                    <MDBCardBody>
                      <MDBCardText className="mb-4">
                        <span className="text-primary font-italic me-1">
                          assigment
                        </span>{" "}
                        Project Status
                      </MDBCardText>
                      <MDBCardText
                        className="mb-1"
                        style={{ fontSize: ".77rem" }}
                      >
                        Web Design
                      </MDBCardText>
                      <MDBCardText
                        className="mt-4 mb-1"
                        style={{ fontSize: ".77rem" }}
                      >
                        Website Markup
                      </MDBCardText>
                      <MDBCardText
                        className="mt-4 mb-1"
                        style={{ fontSize: ".77rem" }}
                      >
                        One Page
                      </MDBCardText>
                      <MDBCardText
                        className="mt-4 mb-1"
                        style={{ fontSize: ".77rem" }}
                      >
                        Mobile Template
                      </MDBCardText>
                      <MDBCardText
                        className="mt-4 mb-1"
                        style={{ fontSize: ".77rem" }}
                      >
                        Backend API
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
      <Dialog open={openAdd} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle className="text-center">
          Information about User
        </DialogTitle>
        <DialogContent open={open}>
          <MDBCard className="mb-4" style={{ backgroundColor: "#FFFFFF" }}>
            <MDBCardBody className="text-center">
              <Grid container spacing={4}>
                {/* Left side with avatar and basic information */}
                <Grid item xs={12} md={4}>
                  {data && data.avatarUrl ? (
                    <MDBCardImage
                      src={data.avatarUrl}
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: "150px" }}
                      fluid
                    />
                  ) : (
                    <MDBCardImage
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                      alt="avatar"
                      className="rounded-circle"
                      style={{ width: "150px" }}
                      fluid
                    />
                  )}
                </Grid>
                {/* Right side with input fields */}
                <Grid item xs={12} md={8}>
                  <TextField
                    name="firstName"
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    margin="normal"
                    value={data.firstName}
                    onChange={handleChange}
                  />
                  <TextField
                    name="lastName"
                    fullWidth
                    label="Last Name"
                    variant="outlined"
                    margin="normal"
                    value={data.lastName}
                    onChange={handleChange}
                  />
                  <TextField
                    name="email"
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={data.email}
                    onChange={handleChange}
                  />
                  <TextField
                    name="phoneNumber"
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    margin="normal"
                    value={data.phoneNumber}
                    onChange={handleChange}
                  />
                  <Select
                    name="gender"
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Gender"
                    value={data.gender}
                    onChange={handleChange}
                  >
                    {genderOptions.map((gender) => (
                      <MenuItem key={gender.id} value={gender.id}>
                        {gender.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    name="address"
                    fullWidth
                    label="Address"
                    variant="outlined"
                    margin="normal"
                    value={data.address}
                    onChange={handleChange}

                  />
                  <TextField
                    name="dateOfBirth"
                    fullWidth
                    label="dateOfBirth"
                    variant="outlined"
                    margin="normal"
                    value={data.dateOfBirth}
                    onChange={handleChange}
                  />
                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        name="dateOfBirth"
                        label="Date Picker"
                        format="YYYY/MM/DD"
                        value={formInputs.dateOfBirth}
                        onChange={handleChange}
                      />
                    </DemoContainer>
                  </LocalizationProvider> */}
                  {/* Add more input fields as needed */}
                </Grid>
              </Grid>
            </MDBCardBody>
          </MDBCard>
        </DialogContent>
        );
        <DialogActions>
          <>
            <Button onClick={onHandleEditProfile}>Submit</Button>
            <Button onClose={handleClose}>Close</Button>
          </>
        </DialogActions>
      </Dialog>
    </section>
  );
};
export default Profile;
