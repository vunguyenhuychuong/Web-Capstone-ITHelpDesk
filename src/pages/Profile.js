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
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import "../../assets/css/profile.css";
import React, { useEffect, useState } from "react";
import { GetDataProfileUser, UpdateProfile } from "../../app/api";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import ChangePassword from "../ChangePassword";
import { genderOptions, getRoleNameById, roleOptions } from "../helpers/tableComlumn";
import { formatTicketDate } from "../helpers/FormatAMPM";
import { LocalPhone, Mail } from "@mui/icons-material";

const Profile = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    avatarUrl: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    team: "",
    address: "",
    role: "",
  });

  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openChangePassword, setChangePassword] = React.useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [date, setDate] = useState(moment());
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    const formattedDateBirth = moment(newDate).format("YYYY-MM-DD");
    setDate(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      dateOfBirth: formattedDateBirth,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(selectedFile);
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
      console.log(profile);
      setData(profile);
    } catch (error) {}
  };

  useEffect(() => {
    fetchDataProfile();
  }, []);

  const onHandleEditProfile = async () => {
    try {
      let avatarUrl = data.avatarUrl; // Use the current avatarUrl by default

      if (selectedFile) {
        // If a new file is selected, upload it and get the download URL
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);
        avatarUrl = await getDownloadURL(storageRef); // Update avatarUrl with the new URL
      }

      const formattedDateOfBirth = moment(date).format("YYYY-MM-DD");

      const updatedData = {
        ...data,
        avatarUrl: avatarUrl, // Update the avatarUrl property with the new URL
        dateOfBirth: formattedDateOfBirth,
      };

      setData(updatedData); // Update the local state with the new data (including the updated avatarUrl)
      await UpdateProfile(updatedData); // Send the updated data to the API
      toast.success("Edit Successful");
      setOpenAdd(false);
      fetchDataProfile();
    } catch (error) {
      console.error(error);
      toast.error("Error editing ticket solution");
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
                      className="rounded-circle border-hover"
                      style={{
                        width: "140px",
                        borderColor: "grey",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        transition:
                          "transform 0.3s ease, border-color 0.3s ease",
                      }}
                      fluid
                    />
                  ) : (
                    <MDBCardImage
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                      alt="avatar"
                      className="rounded-circle border-hover"
                      style={{ width: "150px" }}
                      fluid
                    />
                  )}
                  <p className="text-muted mb-1" style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {data && data.firstName ? data.firstName : "N/A"} {""}
                    {data && data.lastName ? data.lastName : "N/A"}
                  </p>
                  <p className="text-muted mb-4">
                    {getRoleNameById(data.role)}
                  </p>
                  <div className="d-flex justify-content-center mb-2">
                    <MDBBtn onClick={handleOpenEditUser}>
                      <EditIcon />
                    </MDBBtn>
                    <MDBBtn
                      outline
                      className="ms-2"
                      onClick={handleOpenChangePW}
                    >
                      <LockIcon style={{ marginRight: "8px" }} />
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
                      <MDBIcon fab style={{ color: "#333333" }} />
                      <MDBCardText>
                        {data && data.team ? data.team : "N/A"}
                      </MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon fab style={{ color: "#55acee" }} />
                      <MDBCardText>@mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon fab style={{ color: "#ac2bac" }} />
                      <MDBCardText>mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon fab style={{ color: "#3b5998" }} />
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
                      <MDBCardText
                        style={{ fontWeight: "bold", color: "#000000" }}
                      >
                        UserName :
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.username ? data.username : "Loading"}
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
                        Email :
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
                        Phone :
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
                        Role :
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.role
                          ? roleOptions.find((role) => role.id === data.role)
                              .name
                          : "N/A"}
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
                        Date Of Birth :
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {formatTicketDate(data.dateOfBirth)}
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
                        Team :
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.team ? data.team : "N/A"}
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
                        Company :
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.company ? data.company : "N/A"}
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
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
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
      <Dialog open={openAdd} maxWidth="md" fullWidth>
        <DialogTitle className="text-center">
          Information about User
        </DialogTitle>
        <DialogContent open={open}>
          <MDBCard className="mb-4" style={{ backgroundColor: "#FFFFFF" }}>
            <MDBCardBody className="text-center">
              <Grid container spacing={4}>
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
                  <div>
                    <input type="file" onChange={handleFileChange} />
                  </div>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    name="firstName"
                    fullWidth
                    label="First Name"
                    variant="outlined"
                    margin="normal"
                    value={data && data.firstName ? data.firstName : ""}
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
                  <br />
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
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          label="Date Export"
                          required
                          fullWidth
                          value={date}
                          onChange={(newValue) => handleDateChange(newValue)}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MDBCardBody>
          </MDBCard>
        </DialogContent>
        <DialogActions>
          <>
            <Button
              onClick={onHandleEditProfile}
              variant="outlined"
              color="primary"
            >
              <EditIcon />
            </Button>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              <CloseIcon />
            </Button>
          </>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth open={openChangePassword} onClose={handleCloseChangePW}>
        <ChangePassword />
      </Dialog>
    </section>
  );
};
export default Profile;
