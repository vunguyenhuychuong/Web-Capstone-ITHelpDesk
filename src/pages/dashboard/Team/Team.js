import {
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Dialog,
  IconButton,
  InputLabel,
  Box,
  Pagination,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
} from "@mui/material";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  DeleteDataTeam,
  getAllTeam,
} from "../../../app/api/team";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  Delete,
  Edit,
} from "@mui/icons-material";
import {
  MDBBtn,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import { FaPlus } from "react-icons/fa";
import { useCallback } from "react";
import PageSizeSelector from "../Pagination/Pagination";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import CreateTeam from "./CreateTeam";
import EditTeam from "./EditTeam";

const Team = () => {
  const [open, setOpen] = React.useState(false);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [teams, setTeams] = useState([]);
  const [selectTeam, setSelectTeam] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(false);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleEditClick = async (teamId) => {
    setSelectTeam(teamId);
    setOpen(true);
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
  

  const handleSelectTeam = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
    } else {
      setSelectedTeams([...selectedTeams, teamId]);
    }
  };

  const handleSelectAllTeams = () => {
    if (selectedTeams.length === teams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(teams.map((team) => team.id));
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

  const handleOpenAdd = (e) => {
    e.preventDefault();
    clearFormData();
    setOpenAdd(true);
  };

  const handleCloseTeam = () => {
    setOpenAdd(false);
  };

  const handleCloseEdit = (e) => {
    if(e){
      e.preventDefault();
    }
    setOpen(false);
  };

  return (
    <section style={{ backgroundColor: "#FFF" }}>
      <MDBContainer
        className="py-5"
        style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
      >
        <MDBNavbar expand="lg" light bgColor="inherit">
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px" }} /> All Team
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                onClick={handleOpenAdd}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                <Delete /> Delete
              </MDBBtn>
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
              <PageSizeSelector
                pageSize={pageSize}
                handleChangePageSize={handleChangePageSize}
              />
            </MDBNavbarNav>
          </MDBContainer>
        </MDBNavbar>
        {isLoading ? (
          <CustomizedProgressBars />
        ) : (
          <TableContainer component={Paper}>
            <Table arial-label="arial-label">
              <TableHead>
                <TableRow>
                  <TableCell style={{ paddingLeft: "16px" }} padding="checkbox">
                    <Checkbox
                      checked={selectedTeams.length === teams.length}
                      onChange={handleSelectAllTeams}
                    />
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </TableCell>
                  <TableCell onClick={() => handleSortChange("name")}>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Name
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
                        cursor: "pointer",
                      }}
                      align="left"
                    >
                      District
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
                      style={{ fontWeight: "bold" }}
                      align="left"
                    >
                      City
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
                    ></Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teams.map((team) => {
                   const isSelected = selectedTeams.includes(team.id);
                  return (
                    <TableRow key={team.id}>
                      <TableCell align="left">
                        <Checkbox 
                          inputProps={{ "aria-label": "controlled" }} 
                          checked={isSelected}
                          onChange={() => handleSelectTeam(team.id)}
                          />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <IconButton onClick={() => handleEditClick(team.id)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <IconButton onClick={() => onDeleteTeam(team.id)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {team.description}
                      </TableCell>
                      <TableCell align="left">{team.name}</TableCell>
                      <TableCell align="left">{team.location}</TableCell>
                      <TableCell align="left">
                        <div style={{ display: "flex", gap: "10px" }}></div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </MDBContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>
      <Dialog open={openAdd} onClose={handleCloseTeam} fullWidth maxWidth="lg">
        <CreateTeam onClose={handleCloseTeam} onFetchDataTeam={fetchDataTeam} />
      </Dialog>

      <Dialog open={open} fullWidth maxWidth="lg">
        <EditTeam teamId={selectTeam} onClose={handleCloseEdit} onFetchDataTeam={fetchDataTeam}/>
      </Dialog>
    </section>
  );
};
export default Team;
