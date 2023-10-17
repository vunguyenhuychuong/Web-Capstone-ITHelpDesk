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

const Team = () => {
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("name");
  const [data, setData] = useState({
    id: 0,
    name: "",
    location: "",
    description: "",
    managerId: 0,
    isActive: true,
    createdAt: "",
    modifiedAt: "",
    deletedAt: "",
  });

  const clearFormData = () => {
    setData({
      id: 0,
      name: "",
      location: "",
      description: "",
      managerId: 0,
      isActive: true,
      createdAt: "",
      modifiedAt: "",
      deletedAt: "",
    });
  };

  const fetchDataTeam = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      const TeamList = await getAllTeam(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setTeams(TeamList);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  const onCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const result = await AddTeam({
        name: data.name,
        location: data.location,
        description: data.description,
        managerId: data.managerId,
      });

      if (result.isError === false) {
        setData({
          name: "",
          location: "",
          managerId: 0,
          description: "",
        });
      }
      console.log(result);
      toast.success("Team created successfully");
      setOpenAdd(false);
      fetchDataTeam();
    } catch (error) {
      toast.error("Fail to create team");
    }
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleDetailTeam = async (id) => {
    setLoading(true);
    try {
      const user = await getTeamById(id);
      setData({
        id: user.result.id,
        name: user.result.name || "",
        location: user.result.location || "",
        description: user.result.description || "",
        isActive: user.result.isActive || true,
        managerId: user.result.managerId || 0,
        createdAt: user.result.createdAt || "",
        modifiedAt: user.result.modifiedAt || "",
      });
    } catch (error) {
      toast.error("Can not get team id");
      console.log(error);
    }
    setLoading(false);
    setOpen(true);
  };

  const onHandleEditTeam = async () => {
    try {
      const response = UpdateTeam(data.id, data);
      console.log(response);
      toast.success("Update Team successful");
      setOpen(false);
      fetchDataTeam();
    } catch (error) {
      toast.error("Failed to update team");
      console.log(error);
    }
  };

  const onDeleteTeam = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure want to delete this team"
    );
    if (shouldDelete) {
      try {
        const result = await DeleteDataTeam(id);
        fetchDataTeam();
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

  useEffect(() => {
    fetchDataTeam();
    setTotalPages(4);
  }, [fetchDataTeam]);

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChange = React.useCallback((e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const handleOpenAdd = (e) => {
    e.preventDefault();
    clearFormData();
    setOpenAdd(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpenAdd(false);
    fetchDataTeam();
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
            <MenuItem value="location">location</MenuItem>
            <MenuItem value="description">description</MenuItem>
          </Select>
        </FormControl>
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
                  <LocationCity style={{ marginRight: 3 }} /> District{" "}
                  {sortBy === "location" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Typography>
              </TableCell>
              <TableCell onClick={() => handleSortChange("description")}>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: "#007bff" }}
                  align="left"
                >
                  <Description style={{ marginRight: 3 }} /> City{" "}
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
                  {team.description}
                </TableCell>
                <TableCell align="left">{team.name}</TableCell>
                <TableCell align="left">{team.location}</TableCell>
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
export default Team;
