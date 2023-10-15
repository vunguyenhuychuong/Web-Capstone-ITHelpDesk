import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  InputLabel,
  Box,
  Pagination,
  TextField,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import React, { useEffect, useState } from "react";
import {
  AddTeam,
  DeleteDataTeam,
  UpdateTeam,
  getAllTeam,
  getTeamById,
} from "../../app/api/team";
import {
  ArrowDropDown,
  ArrowDropUp,
  Close,
  Delete,
  Description,
  Edit,
  Face,
  LocationCity,
} from "@mui/icons-material";
import { MDBBtn, MDBCol, MDBInput, MDBRow } from "mdb-react-ui-kit";
import { FaPlus } from "react-icons/fa";
import { useCallback } from "react";

const Customers = () => {
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [teams, setTeams] = useState([]);
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
    <Wrapper style={{ backgroundColor: "#eee" }}>
      <div style={{ marginBottom: 20 }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            marginBottom: 20,
            height: "50px",
            width: "80px",
            marginRight: "10px",
          }}
          onClick={handleOpenAdd}
        >
          <FaPlus />
        </Button>
        <FormControl
          variant="outlined"
          style={{ minWidth: 120, marginRight: 10 }}
        >
          <InputLabel htmlFor="search-field">Search Field</InputLabel>
          <Select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            label="Search Field"
            inputProps={{
              name: "searchField",
              id: "search-field",
            }}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="location">Location</MenuItem>
            <MenuItem value="description">Description</MenuItem>
          </Select>
        </FormControl>

        {/* ... (Add input field for search query) */}
        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              fetchDataTeam();
            }
          }}
        />
      </div>
      <TableContainer component={Paper}>
        <Table arial-label="arial-label">
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSortChange("name")}>
                <Typography
                  variant="subtitle1"
                  style={{
                    fontWeight: "bold",
                    color: "#007bff",
                    cursor: "pointer",
                  }}
                >
                  <Face style={{ marginLeft: 3 }} /> Name{" "}
                  {sortBy === "name" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Typography>
              </TableCell>
              <TableCell onClick={() => handleSortChange("location")}>
                <Typography
                  variant="subtitle1"
                  style={{
                    fontWeight: "bold",
                    color: "#007bff",
                    cursor: "pointer",
                  }}
                  align="left"
                >
                  <LocationCity style={{ marginRight: 3 }} /> Location{" "}
                  {sortBy === "location" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: "#007bff" }}
                  align="left"
                >
                  <Description style={{ marginRight: 3 }} /> Description{" "}
                  {sortBy === "description" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: "#007bff" }}
                  align="left"
                >
                  ManagerID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: "#007bff" }}
                  align="left"
                ></Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell component="th" scope="row">
                  {team.name}
                </TableCell>
                <TableCell align="left">{team.location}</TableCell>
                <TableCell align="left">{team.description}</TableCell>
                <TableCell align="left">{team.managerId}</TableCell>
                <TableCell align="left">
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDetailTeam(team.id)}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onDeleteTeam(team.id)}
                    >
                      <Delete />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Pagination controls */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <label>Items per page: </label>
        <select value={pageSize} onChange={handleChangePageSize}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>
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
              width: "36px", // Set the width and height to create a square button
              height: "36px",
              backgroundColor: "#2196f3", // Set the background color to blue
              borderRadius: "4px", // Optional: Add border-radius for rounded corners
            }}
          >
            <Close style={{ color: "white" }} />
          </IconButton>
          Create Team
        </DialogTitle>
        <form style={{ margin: "0px 40px" }} className="custom-dialog ">
          <MDBRow>
            <MDBCol>
              <InputLabel>Name</InputLabel>
              <MDBInput
                id="name"
                value={data.name}
                onChange={handleChange}
                name="name"
              />
            </MDBCol>
            <MDBCol>
              <InputLabel>Manger ID</InputLabel>
              <MDBInput
                id="managerId"
                value={data.managerId}
                onChange={handleChange}
                name="managerId"
              />
            </MDBCol>
            <MDBCol>
              <InputLabel>Location</InputLabel>
              <MDBInput
                id="location"
                value={data.location}
                onChange={handleChange}
                name="location"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <InputLabel>Description</InputLabel>
              <MDBInput
                id="description"
                value={data.description}
                onChange={handleChange}
                name="description"
                style={{ height: "80px" }}
              />
            </MDBCol>
          </MDBRow>
          <div className="text-center customer-center-btn">
            <MDBBtn className="mb-4 mt-4" type="submit" onClick={onCreateTeam}>
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
              width: "36px", // Set the width and height to create a square button
              height: "36px",
              backgroundColor: "#2196f3", // Set the background color to blue
              borderRadius: "4px", // Optional: Add border-radius for rounded corners
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
            <MDBRow>
              <MDBCol>
                <InputLabel>Name</InputLabel>
                <MDBInput
                  id="name"
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                />
              </MDBCol>
              <MDBCol>
                <InputLabel>Location</InputLabel>
                <MDBInput
                  id="location"
                  name="location"
                  value={data.location}
                  onChange={handleChange}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow>
              <MDBCol>
                <InputLabel>Description</InputLabel>
                <MDBInput
                  id="description"
                  name="description"
                  value={data.description}
                  onChange={handleChange}
                />
              </MDBCol>
            </MDBRow>
            <div className="text-center customer-center-btn">
              <MDBBtn
                className="mb-4 mt-4"
                type="button"
                onClick={onHandleEditTeam}
              >
                <Edit />
              </MDBBtn>
            </div>
          </form>
        )}
      </Dialog>
    </Wrapper>
  );
};
export default Customers;
