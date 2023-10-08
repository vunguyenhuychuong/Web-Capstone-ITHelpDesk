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
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import axios from "axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import "../../assets/css/profile.css";
import React, { useEffect, useState } from "react";
import {
  GetDataProfileUser,
} from "../../app/api";
import { toast } from "react-toastify";
import { getAuthHeader } from "../../app/api/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { genderOptions } from "./Admin/tableComlumn";

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
    address: ""
  });

  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
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
    const formattedDate = moment(newDate).format("YYYY-MM-DD");
    setDate(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      dateOfBirth: formattedDate,
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

  useEffect(() => {
    const fetchDataProfile = async () => {
      const profile = await GetDataProfileUser();
      setData(profile);
    };
    fetchDataProfile();
  }, []);

  const onHandleEditProfile = async () => {
    try{
      const header = getAuthHeader();
      let avatarUrl = data.avatarUrl;
      if(selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, 'images/' + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);
        avatarUrl = await getDownloadURL(storageRef);
      }
      const updatedData = {
        ...data,
        avatarUrl: avatarUrl,
      };
      setData(updatedData);
      
      const editProfile = await axios.patch('https://localhost:7043/v1/itsds/user/update-profile',{
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        avatarUrl: avatarUrl
      },
      {
        headers: {
          Authorization: header,
        },
      });
      toast.success("Edit Successful");
      setOpenAdd(false);
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
                      className="rounded-circle border-hover" 
                      style={{
                        width: "150px",
                        borderColor: "grey", // Set border color directly using inline style
                        borderWidth: "2px",
                        borderStyle: "solid",
                        transition: "transform 0.3s ease, border-color 0.3s ease",
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
                  <p className="text-muted mb-1">
                    {data && data.firstName ? data.firstName : "N/A"}{" "}
                    {data && data.lastName ? data.lastName : "N/A"}
                  </p>
                  <p className="text-muted mb-4">
                    {data.result && data.result.role
                      ? data.result.role
                      : "N/A"}
                  </p>
                  <div className="d-flex justify-content-center mb-2">
                    <MDBBtn onClick={handleOpenEditUser}><EditIcon /></MDBBtn>
                    <MDBBtn outline className="ms-2">
                    <LockIcon style={{ marginRight: '8px' }} />
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
                        style={{ color: "#333333" }}
                      />
                      <MDBCardText>
                        {data && data.team ? data.team : "N/A"}
                      </MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        style={{ color: "#55acee" }}
                      />
                      <MDBCardText>@mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
                        style={{ color: "#ac2bac" }}
                      />
                      <MDBCardText>mdbootstrap</MDBCardText>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                      <MDBIcon
                        fab
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
                      <MDBCardText style={{ fontWeight: "bold", color: "#000000" }}>UserName :</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.username ? data.username : "Loading"}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <EditIcon fontSize="small" color="primary" onClick={handleOpenEditUser}/>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText style={{ fontWeight: "bold", color: "#000000" }}>Email :</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.email ? data.email : "Loading"}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <EditIcon fontSize="small" color="primary" onClick={handleOpenEditUser}/>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText style={{ fontWeight: "bold", color: "#000000" }}>Phone :</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.phoneNumber ? data.phoneNumber : "N/A"}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <EditIcon fontSize="small" color="primary" onClick={handleOpenEditUser}/>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText style={{ fontWeight: "bold", color: "#000000" }}>Role :</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                      {data && data.role ? data.role : "N/A"}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <EditIcon fontSize="small" color="primary" onClick={handleOpenEditUser}/>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText style={{ fontWeight: "bold", color: "#000000" }}>Date Of Birth :</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.dateOfBirth ? data.dateOfBirth : "N/A"}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <EditIcon fontSize="small" color="primary" onClick={handleOpenEditUser}/>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText style={{ fontWeight: "bold", color: "#000000" }}>Team :</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.team ? data.team : "N/A"}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <EditIcon fontSize="small" color="primary" onClick={handleOpenEditUser}/>
                    </MDBCol>
                  </MDBRow>
                  <hr />
                  <MDBRow>
                    <MDBCol sm="3">
                      <MDBCardText style={{ fontWeight: "bold", color: "#000000" }}>Company :</MDBCardText>
                    </MDBCol>
                    <MDBCol sm="8">
                      <MDBCardText className="text-muted">
                        {data && data.company ? data.company : "N/A"}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol sm="1">
                      <EditIcon fontSize="small" color="primary" onClick={handleOpenEditUser}/>
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
                  <div>
                    <input type="file" onChange={handleFileChange} />                
                  </div>
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
                  <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                      label="Date Export"
                      required
                      fullWidth
                      value={date}
                      maxDate={moment()}
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
        );
        <DialogActions>
          <>
            <Button onClick={onHandleEditProfile} variant="outlined" color="primary"><EditIcon /></Button>
            <Button onClick={handleClose} variant="outlined" color="secondary"><CloseIcon /></Button>
          </>
        </DialogActions>
      </Dialog>
    </section>
  );
};
export default Profile;
