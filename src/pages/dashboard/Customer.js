import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  Paper,
  Button,
  TableRow,
  TableSortLabel,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  Grid,
} from "@mui/material";
import {
  MDBBtn,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {
  AddDataProfile,
  DeleteDataUser,
  UpdateUser,
  getAllUser,
  getUserById,
} from "../../app/api";
import "../../assets/css/profile.css";
import { toast } from "react-toastify";
import { genderOptions, headCells, roleOptions } from "./Admin/tableComlumn";
import { Close, Delete, PersonAdd } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

function EnhancedTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" style={{ paddingLeft: "12px" }}>
          {" "}
          No
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align="left">
            <TableSortLabel>
              {headCell.icon &&
                React.cloneElement(headCell.icon, {
                  className: "headCellIcon",
                })}
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function Customer() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(moment());
  const [selectedFile, setSelectedFile] = useState(null);
  const [data, setData] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    address: "",
    phoneNumber: "",
    isActive: true,
    role: "",
    dateOfBirth: "",
    gender: 0,
    createdAt: "",
    modifiedAt: "",
    avatarUrl: "",
  });

  const fetchDataUser = async () => {
    try {
      const UserList = await getAllUser();
      setUsers(UserList);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  function findGenderOption(genderValue) {
    return genderOptions.find(option => option.id === genderValue) || null;
  }

  useEffect(() => {
    fetchDataUser();

    const defaultGenderOption = findGenderOption(data.gender);
    if(defaultGenderOption) {
      setData(prevData => ({
        ...prevData,
        gender: defaultGenderOption.id
      }));
    }else{
      setData(prevData => ({
        ...prevData,
        gender: null
      }));
    }
  }, [data.gender]);

  const onCreateUser = async (e) => {
    e.preventDefault();
    try {
      const result = await AddDataProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        password: data.password,
        email: data.email,
        role: data.role,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      });
      if (result.isError === false) {
        setData({
          firstName: "",
          lastName: "",
          username: "",
          password: "",
          email: "",
          role: 0,
          dateOfBirth: "",
          gender: 0,
        });
        console.log(result);
        toast.success("User created successfully");
        setOpenAdd(false);
        fetchDataUser();
      } else {
        toast.error("Fail to create user");
        console.log("error", result.message);
      }
    } catch (error) {
      toast.error("Error");
      console.log("Please check data input", error);
    }
  };

  const handleDetailUser = async (id) => {
    setLoading(true);
    try {
      const user = await getUserById(id);
      setData({
        id: user.result.id,
        firstName: user.result.firstName || "",
        lastName: user.result.lastName || "",
        username: user.result.username || "",
        password: user.result.password || "",
        email: user.result.email || "",
        address: user.result.address || "",
        phoneNumber: user.result.phoneNumber || "",
        isActive: user.result.isActive || true,
        role: user.result.role || 0,
        dateOfBirth: user.result.dateOfBirth || "",
        gender: user.result.gender || 0,
        avatarUrl: user.result.avatarUrl || "",
      });
    } catch (error) {
      toast.error("Can not get user id");
      console.log(error);
    }
    setOpen(true);
    setLoading(false);
  };

  const onDeleteUser = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete?");
    if (shouldDelete) {
      try {
        const result = await DeleteDataUser(id);
        fetchDataUser();
        if (result.isError === false) {
          toast.success("Delete successful");
        } else {
          toast.error("Delete fail");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleDateChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DD");
    console.log(formattedDate);
    setDate(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      dateOfBirth: formattedDate,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setOpenAdd(false);
  };

  const handleOpenAdd = (e) => {
    e.preventDefault();
    setOpenAdd(true);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(selectedFile);
  };

  const onHandleEditUser = async () => {
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
      console.log(data);
      const response = await UpdateUser(data.id, updatedData);
      toast.success("User updated successfully");
      fetchDataUser();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update user");
      if(error.response) {
        console.log('Server response error status', error.response.status);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#eee",
        p: 2,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={handleOpenAdd}
      >
        <PersonAdd />
      </Button>
      {loading ? (
        <div style={{ textAlign: "center" }}>Loading...</div>
      ) : (
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table sx={{ minWidth: 750 }}>
              <EnhancedTableHead />
              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={`user-${index}`}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell align="left">{user.id}</TableCell>
                    <TableCell align="left">
                      {user.avatarUrl && (
                        <img
                          src={user.avatarUrl}
                          alt="Avatar"
                          style={{ width: "50px", height: "50px" }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="left">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell align="left">{user.email}</TableCell>
                    <TableCell align="left">{user.phoneNumber}</TableCell>
                    <TableCell align="left">
                    {user.role}
                    </TableCell>
                    <TableCell align="left">
                      <EditIcon
                        fontSize="small"
                        color="primary"
                        onClick={() => handleDetailUser(user.id)}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Delete
                        fontSize="small"
                        color="error"
                        onClick={() => onDeleteUser(user.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      <Dialog open={openAdd} fullWidth maxWidth="lg">
        <DialogTitle className="text-center">
          <IconButton
            edge="end"
            onClick={handleClose}
            aria-label="close"
            color="#3b71ca"
            style={{
              position: "absolute",
              right: "32px",
              top: "8px",
              width: "36px",
              height: "36px",
              backgroundColor: "#2196f3",
              borderRadius: "4px",
            }}
          >
            <Close style={{ color: "white" }} />
          </IconButton>
          Create Customer
        </DialogTitle>
        <form style={{ margin: "0px 40px" }} className="custom-dialog ">
          <MDBRow>
            <MDBCol>
              <InputLabel>First Name</InputLabel>
              <MDBInput
                id="firstName"
                name="firstName"
                value={data.firstName}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol>
              <InputLabel>Last Name</InputLabel>
              <MDBInput
                id="lastName"
                name="lastName"
                value={data.lastName}
                onChange={handleChange}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <InputLabel>User Name</InputLabel>
              <MDBInput
                id="username"
                name="username"
                value={data.username}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol>
              <InputLabel>Password</InputLabel>
              <MDBInput
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <InputLabel>Email</InputLabel>
              <MDBInput
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
              />
            </MDBCol>
            <MDBCol>
              <InputLabel>Role</InputLabel>
              <Select
                id="role"
                onChange={handleChange}
                fullWidth
                margin="dense"
                variant="outlined"
                style={{ height: "36px" }}
                displayEmpty
                renderValue={(value) =>
                  value === "" ? <span>&nbsp;</span> : value
                }
              >
                {roleOptions.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </MDBCol>
          </MDBRow>
          <div className="text-center customer-center-btn">
            <MDBBtn className="mb-4 mt-4" type="submit" onClick={onCreateUser}>
              Add
            </MDBBtn>
          </div>
        </form>
      </Dialog>
      <Dialog open={open} fullWidth maxWidth="lg">
        <DialogTitle className="text-center">
          <IconButton
            edge="end"
            onClick={handleClose}
            aria-label="close"
            color="#3b71ca"
            style={{
              position: "absolute",
              right: "32px",
              top: "8px",
              width: "36px",
              height: "36px",
              backgroundColor: "#2196f3",
              borderRadius: "4px",
            }}
          >
            <Close style={{ color: "white" }} />
          </IconButton>
          Create Team
        </DialogTitle>
        {loading ? (
          <div>loading...</div>
        ) : (
          <form style={{ margin: "0px 40px" }} className="custom-dialog ">
            <MDBCardBody>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  {data && data.avatarUrl ? (
                    <MDBCardImage
                      src={data.avatarUrl}
                      alt="Avatar 1"
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ marginTop: "10px" }} 
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <MDBRow>
                    <MDBCol>
                      <InputLabel>First Name</InputLabel>
                      <MDBInput
                        id="firstName"
                        name="firstName"
                        value={data.firstName}
                        onChange={handleChange}
                      />
                    </MDBCol>
                    <MDBCol>
                      <InputLabel>Last Name</InputLabel>
                      <MDBInput
                        id="lastName"
                        name="lastName"
                        value={data.lastName}
                        onChange={handleChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol>
                      <InputLabel>Email</InputLabel>
                      <MDBInput
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                      />
                    </MDBCol>
                    <MDBCol>
                      <InputLabel>Phone Number</InputLabel>
                      <MDBInput
                        id="phoneNumber"
                        name="phoneNumber"
                        value={data.phoneNumber}
                        onChange={handleChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        fullWidth
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
                    </MDBCol>
                    <MDBCol>
                      <InputLabel>IsActive</InputLabel>
                      <MDBInput
                        id="isActive"
                        name="isActive"
                        value={data.isActive}
                        onChange={handleChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow>
                    <MDBCol>
                      <InputLabel>Date Of Birth</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          required
                          fullWidth
                          value={date}
                          maxDate={moment()}
                          onChange={(newValue) => handleDateChange(newValue)}
                        />
                      </LocalizationProvider>
                    </MDBCol>
                    <MDBCol>
                      <InputLabel>Address</InputLabel>
                      <MDBInput
                        id="address"
                        name="address"
                        value={data.address}
                        onChange={handleChange}
                      />
                    </MDBCol>
                  </MDBRow>
                  <div className="text-center customer-center-btn">
                    <MDBBtn
                      className="mb-4 mt-4"
                      type="button"
                      onClick={onHandleEditUser}
                    >
                      Edit
                    </MDBBtn>
                  </div>
                </Grid>
              </Grid>
            </MDBCardBody>
          </form>
        )}
      </Dialog>
    </Box>
  );
}
