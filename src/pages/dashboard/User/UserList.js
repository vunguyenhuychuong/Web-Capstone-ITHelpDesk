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
import {
  ContentCopy,
  Delete,
  Lock,
  LockOpen,
  ViewCompact,
} from "@mui/icons-material";
import { useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { FormControl, MenuItem, Pagination, Select } from "@mui/material";
import { toast } from "react-toastify";
import { formatDate } from "../../helpers/FormatDate";
import PageSizeSelector from "../Pagination/Pagination";
import { Box } from "@mui/system";
import { DeleteDataUser, getAllUser } from "../../../app/api";
import { getGenderById, getRoleNameById } from "../../helpers/tableComlumn";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [dataUsers, setDataUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("username");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const navigate = useNavigate();
  const fetchDataUser = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      setLoading(true);
      const mode = await getAllUser(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataUsers(mode);
    } catch (error) {
      console.error(error);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === dataUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(dataUsers.map((mode) => mode.id));
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

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleDeleteSelectedUsers = async (id) => {
    try {
      if (selectedUsers.length === 0) {
        return;
      }
      const deletePromises = selectedUsers.map(async (userId) => {
        try {
          const res = await Promise.resolve(DeleteDataUser(userId));
          if (res.isError) {
            throw new Error(
              `Error deleting user with ID ${userId}: ${res.message}`
            );
          }
          return userId;
        } catch (error) {
          throw new Error(
            `Error deleting user with ID ${userId}: ${error.message}`
          );
        }
      });

      const results = await Promise.allSettled(deletePromises);

      const successfulDeletes = [];
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          successfulDeletes.push(result.value);
        } else {
          toast.error(result.reason.message); // Handle error messages here
        }
      });
      const updateUsers = dataUsers.filter(
        (user) => !successfulDeletes.includes(user.id)
      );
      setDataUsers(updateUsers);
      setSelectedUsers([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete selected users, Please try again later");
    }
  };

  const handleOpenCreateCustomer = () => {
    navigate("/home/createUser");
  };

  const handleOpenDetailCustomer = (customerId) => {
    navigate(`/home/editUser/${customerId}`);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchDataUser();
    setTotalPages(4);
  }, [fetchDataUser]);

  return (
    <section style={{ backgroundColor: "#FFF" }}>
      <MDBContainer
        className="py-5"
        style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
      >
        <MDBNavbar expand="lg" light bgColor="inherit">
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px" }} /> All User
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                onClick={() => handleOpenCreateCustomer()}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                <Delete onClick={handleDeleteSelectedUsers} /> Delete
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
                  <MenuItem value="id">ID</MenuItem>
                  <MenuItem value="firstName">FirstName</MenuItem>
                  <MenuItem value="lastName">LastName</MenuItem>
                  <MenuItem value="username">UserName</MenuItem>
                  <MenuItem value="address">Address</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
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
                      fetchDataUser();
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
                  checked={selectedUsers.length === dataUsers.length}
                  onChange={handleSelectAllUsers}
                />
              </th>
              <th style={{ fontWeight: "bold" }}>Edit</th>
              <th
                style={{ fontWeight: "bold" }}
                onClick={() => handleSortChange("firstName")}
              >
                Name
              </th>
              <th
                style={{ fontWeight: "bold" }}
                onClick={() => handleSortChange("username")}
              >
                UserName
              </th>
              <th
                style={{ fontWeight: "bold" }}
                onClick={() => handleSortChange("role")}
              >
                Role
              </th>
              <th
                style={{ fontWeight: "bold" }}
                onClick={() => handleSortChange("gender")}
              >
                Gender
              </th>
              <th
                style={{ fontWeight: "bold" }}
                onClick={() => handleSortChange("isActive")}
              >
                Status
              </th>
              <th style={{ fontWeight: "bold" }}>Create Time</th>
              <th style={{ fontWeight: "bold" }}>Modify Time</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody className="bg-light">
            {dataUsers.map((user, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td>
                  <ViewCompact
                    onClick={() => handleOpenDetailCustomer(user.id)}
                  />
                </td>
                <td>
                  {user.lastName} {user.firstName}
                </td>
                <td>{user.username}</td>
                <td>{getRoleNameById(user.role)}</td>
                <td>{getGenderById(user.gender)}</td>
                <td>
                  {user.isActive ? (
                    <>
                      <LockOpen
                        className="square-icon"
                        style={{ color: "green" }}
                      />{" "}
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <Lock className="square-icon" /> DeActive
                    </>
                  )}
                </td>
                <td>{formatDate(user.createdAt || "-")}</td>
                <td>{formatDate(user.modifiedAt || "-")}</td>
              </tr>
            ))}
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

export default UserList;
