import {
  MDBBtn,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useCallback, useState } from "react";
import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import { useEffect } from "react";
import { deleteMode } from "../../../app/api/mode";
import { FaPlus, FaSearch } from "react-icons/fa";
import { FormControl, MenuItem, Pagination, Select } from "@mui/material";
import { toast } from "react-toastify";
import { formatDate } from "../../helpers/FormatDate";
import PageSizeSelector from "../Pagination/Pagination";
import { Box } from "@mui/system";
import {  getAllTeamMember } from "../../../app/api/teamMember";
import { useNavigate } from "react-router-dom";

const TeamMemberList = () => {
  const [dataTeamMembers, setDataTeamMembers] = useState([]);
  const [selectMode, setSelectTeam] = useState(null);
  const [selectedTeamMembers, setSelectedTeamMember] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("expertises");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const navigate = useNavigate();
   const fetchAllTeamMember =  useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      setLoading(true);
      const mode = await getAllTeamMember(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataTeamMembers(mode);
    } catch (error) {
      console.error(error);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  const handleSelectTeamMember = (teamId) => {
    if (selectedTeamMembers.includes(teamId)) {
      setSelectedTeamMember(selectedTeamMembers.filter((id) => id !== teamId));
      console.log("many select", selectMode);
    } else {
      setSelectedTeamMember([...selectedTeamMembers, teamId]);
    }
  };

  const handleSelectAllTeamMembers = () => {
    if (selectedTeamMembers.length === dataTeamMembers.length) {
      setSelectedTeamMember([]);
    } else {
      setSelectedTeamMember(dataTeamMembers.map((mode) => mode.id));
    }
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeleteSelectedTeamMember = async (id) => {
    try {
      if (selectedTeamMembers.length === 0) {
        return;
      }  
      const deletePromises = selectedTeamMembers.map(async (teamId) => {
        try {
          const res = await Promise.resolve(deleteMode(teamId));
          if (res.isError) {
            throw new Error(`Error deleting team member with ID ${teamId}: ${res.message}`);
          }
          return teamId;
        } catch (error) {
          throw new Error(`Error deleting team member with ID ${teamId}: ${error.message}`);
        }
      });
  
      const results = await Promise.allSettled(deletePromises);
  
      const successfulDeletes = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          successfulDeletes.push(result.value);
        } else {
          toast.error(result.reason.message);
        }
      });
      const updateModes = dataTeamMembers.filter((mode) => !successfulDeletes.includes(mode.id));
      setDataTeamMembers(updateModes);
      setSelectTeam([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete selected modes, Please try again later");
    }
  };

  const handleOpenCreateTeamMember = () => {
    navigate("/home/createTeamMember");
  };

  const handleOpenEditTeamMember = (teamMemberId) => {
    navigate(`/home/editTeamMember/${teamMemberId}`);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAllTeamMember();
    setTotalPages(4);
  }, [fetchAllTeamMember]);

  return (
    <section style={{ backgroundColor: "#FFF" }}>
      <MDBContainer
        className="py-5"
        style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
      >
        <MDBNavbar expand="lg" light bgColor="inherit">
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px" }} /> All TeamMember
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                onClick={() => handleOpenCreateTeamMember()}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                onClick={handleDeleteSelectedTeamMember}
              >
                <Delete  /> Delete
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
                >
                  <MenuItem value="name">name</MenuItem>
                  <MenuItem value="description">Title</MenuItem>
                  <MenuItem value="id">id</MenuItem>
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
                      fetchAllTeamMember();
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
        <MDBTable
          className="align-middle mb-0"
          responsive
          style={{ border: "0.05px solid #50545c" }}
        >
          <MDBTableHead className="bg-light">
            <tr style={{ fontSize: "1.2rem" }}>
              <th style={{ fontWeight: "bold" }}>
                <input
                  type="checkbox"
                  checked={selectedTeamMembers.length === dataTeamMembers.length}
                  onChange={handleSelectAllTeamMembers}
                />
              </th>
              <th style={{ fontWeight: "bold" }}>Edit</th>
              <th style={{ fontWeight: "bold" }}>ID</th>
              <th style={{ fontWeight: "bold" }}>Member ID</th>
              <th style={{ fontWeight: "bold" }}>Expertises</th>
              <th style={{ fontWeight: "bold" }}>Create Time</th>
              <th style={{ fontWeight: "bold" }}>Modify Time</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody className="bg-light">
            {dataTeamMembers.map((teamMember, index) => {
              const isSelected = selectedTeamMembers.includes(teamMember.id);
              return (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectTeamMember(teamMember.id)}
                    />
                  </td>
                  <td >
                    <Edit onClick={() => handleOpenEditTeamMember(teamMember.id)}/>
                  </td>
                  <td>{teamMember.id}</td>
                  <td>{teamMember.memberId}</td>
                  <td>{teamMember.expertises}</td>
                  <td>{formatDate(teamMember.createdAt || "-")}</td>
                  <td>{formatDate(teamMember.modifiedAt || "-")}</td>
                </tr>
              );
            })}
          </MDBTableBody>
          <MDBTableBody className="bg-light"></MDBTableBody>
        </MDBTable>
      </MDBContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>
    </section>
  );
};

export default TeamMemberList;
