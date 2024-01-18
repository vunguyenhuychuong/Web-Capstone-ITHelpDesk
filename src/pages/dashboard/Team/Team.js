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
  Box,
  Pagination,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { DeleteDataTeam, getAllTeam } from "../../../app/api/team";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  Delete,
  Edit,
  ViewCompact,
} from "@mui/icons-material";
import {
  MDBBtn,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useCallback } from "react";
import PageSizeSelector from "../Pagination/Pagination";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import CreateTeam from "./CreateTeam";
import EditTeam from "./EditTeam";
import CircularLoading from "../../../components/iconify/CircularLoading";
import { useNavigate } from "react-router-dom";

const Team = () => {
  const navigate = useNavigate();
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
      const response = await getAllTeam(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setTeams(response?.data);
      setTotalPages(response?.totalPage);
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

  const handleOpenTeamDetail = async (teamId) => {
    navigate(`/home/teamDetail/${teamId}`);
  };

  const onDeleteTeam = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure want to delete this team?"
    );
    if (shouldDelete) {
      try {
        const result = await DeleteDataTeam(id);
        fetchDataTeam();
        if (result.isError === false) {
          toast.success("Delete team successfully");
        } else {
          toast.error("Delete team failed");
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
    if (selectedTeams?.length === teams?.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(teams?.map((team) => team.id));
    }
  };
  const handleDeleteSelectedTeams = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure want to delete selected teams"
    );
    if (shouldDelete) {
      try {
        if (selectedTeams?.length === 0) {
          return;
        }
        let currentIndex = 0;

        const deleteNextSolution = () => {
          if (currentIndex < selectedTeams?.length) {
            const teamId = selectedTeams[currentIndex];

            DeleteDataTeam(teamId)
              .then(() => {
                console.log(`Team with ID ${teamId} deleted successfully`);
                currentIndex++;
                deleteNextSolution();
              })
              .catch((error) => {
                console.error(`Error deleting team with ID ${teamId}: `, error);
                toast.error(`Error deleting team with ID ${teamId}: `, error);
              });
          } else {
            setSelectTeam([]);
            toast.success("Selected teams deleted successfully");
            fetchDataTeam();
          }
        };

        deleteNextSolution();
      } catch (error) {
        console.error("Failed to delete selected teams: ", error);
        toast.error("Failed to delete selected teams, Please try again later");
      }
    }
  };
  useEffect(() => {
    fetchDataTeam();
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
    if (e) {
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
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All Teams</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                onClick={handleOpenAdd}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                onClick={handleDeleteSelectedTeams}
                color="eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
              >
                <Delete /> Delete
              </MDBBtn>
              <FormControl
                variant="outlined"
                style={{
                  minWidth: 120,
                  marginRight: 10,
                  marginTop: 10,
                  marginLeft: 10,
                }}
                size="small"
              >
                <Select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  inputProps={{
                    name: "searchField",
                    id: "search-field",
                  }}
                  style={{ color: "white" }}
                >
                  <MenuItem value="id">ID</MenuItem>
                  <MenuItem value="name">Name Team</MenuItem>
                  <MenuItem value="location">Location</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  <MenuItem value="isActive">Status</MenuItem>
                  <MenuItem value="managerId">Manager</MenuItem>
                </Select>
              </FormControl>
              <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      fetchDataTeam();
                    }
                  }}
                  className="input-search"
                  placeholder="Type to search..."
                />
              </div>
              <PageSizeSelector
                pageSize={pageSize}
                handleChangePageSize={handleChangePageSize}
              />
            </MDBNavbarNav>
          </MDBContainer>
        </MDBNavbar>
        {isLoading ? (
          <CircularLoading />
        ) : (
          <TableContainer component={Paper}>
            <Table arial-label="arial-label">
              <TableHead>
                <TableRow>
                  <TableCell style={{ paddingLeft: "16px" }} padding="checkbox">
                    <Checkbox
                      checked={selectedTeams?.length === teams?.length}
                      onChange={handleSelectAllTeams}
                    />
                  </TableCell>
                  <TableCell onClick={() => handleSortChange("name")}>
                    <Typography
                      variant="subtitle1"
                      style={{
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Name Team
                      {sortBy === "name" &&
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
                      style={{
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      align="left"
                    >
                      Description
                      {sortBy === "description" &&
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
                      Location
                      {sortBy === "description" &&
                        (sortDirection === "asc" ? (
                          <ArrowDropDown />
                        ) : (
                          <ArrowDropUp />
                        ))}
                    </Typography>
                  </TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  ></TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  ></TableCell>
                  <TableCell
                    style={{
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  ></TableCell>
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
                {teams?.map((team) => {
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
                        {team.name}
                      </TableCell>
                      <TableCell align="left"> {team.description}</TableCell>
                      <TableCell align="left">{team.location}</TableCell>
                      <TableCell component="th" scope="row">
                        <IconButton
                          onClick={() => handleOpenTeamDetail(team.id)}
                        >
                          <ViewCompact />
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <IconButton onClick={() => handleEditClick(team.id)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <IconButton onClick={() => onDeleteTeam(team.id)}>
                          <Delete color="error" />
                        </IconButton>
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
        <EditTeam
          teamId={selectTeam}
          onClose={handleCloseEdit}
          onFetchDataTeam={fetchDataTeam}
        />
      </Dialog>
    </section>
  );
};
export default Team;
