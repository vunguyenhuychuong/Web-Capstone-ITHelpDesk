import {
  MDBBtn,MDBContainer, MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useCallback, useState } from "react";
import {
  ArrowDropDown,ArrowDropUp,ContentCopy,Delete,Female,Lock,LockOpen,Male,Phone,ViewCompact,
} from "@mui/icons-material";
import { useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Avatar,CircularProgress,FormControl,MenuItem,Pagination,Select,Tooltip } from "@mui/material";
import { toast } from "react-toastify";
import { formatDate } from "../../helpers/FormatDate";
import PageSizeSelector from "../Pagination/Pagination";
import { Box } from "@mui/system";
import { DeleteDataUser, getAllUser } from "../../../app/api";
import { getRoleNameById, roleColors } from "../../helpers/tableComlumn";
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

      const mode = await getAllUser(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataUsers(mode);
      setLoading(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
          toast.error(result.reason.message);
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
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All User</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                title="Create New Customer"
                data-mdb-toggle="tooltip"
                onClick={() => handleOpenCreateCustomer()}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                data-mdb-toggle="tooltip"
                title="Delete Selected Users"
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
                  style={{ color: "white" }}
                >
                  <MenuItem value="id">ID</MenuItem>
                  <MenuItem value="firstName">FirstName</MenuItem>
                  <MenuItem value="lastName">LastName</MenuItem>
                  <MenuItem value="username">UserName</MenuItem>
                  <MenuItem value="address">Address</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="gender">Gender</MenuItem>
                  <MenuItem value="phoneNumber">Phone</MenuItem>
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
        <MDBTable className="align-middle mb-0" responsive>
          <MDBTableHead className="bg-light">
            <tr style={{ fontSize: "1.2rem" }}>
              <th style={{ fontWeight: "bold" }}>
                <input
                  type="checkbox"
                  checked={selectedUsers.length === dataUsers.length}
                  onChange={handleSelectAllUsers}
                />
              </th>
              <th></th>
              <th
                style={{ fontWeight: "bold" }}
                className="sortable-header"
                onClick={() => handleSortChange("username")}
              >
                <Tooltip title="Click here to sort by UserName" arrow>
                  UserName
                  {sortBy === "username" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Tooltip>
              </th>
              <th
                style={{ fontWeight: "bold" }}
                className="sortable-header"
                onClick={() => handleSortChange("firstName")}
              >
                <Tooltip title="Click here to sort by Name" arrow>
                  Name
                  {sortBy === "firstName" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Tooltip>
              </th>
              <th
                style={{ fontWeight: "bold" }}
                className="sortable-header"
                onClick={() => handleSortChange("address")}
              >
                <Tooltip title="Click here to sort by Address" arrow>
                  Address
                  {sortBy === "address" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Tooltip>
              </th>
              <th
                style={{ fontWeight: "bold" }}
                className="sortable-header"
                onClick={() => handleSortChange("phoneNumber")}
              >
                <Tooltip title="Click here to sort by Phone" arrow>
                  Phone
                  {sortBy === "phoneNumber" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Tooltip>
              </th>
              <th
                style={{ fontWeight: "bold" }}
                className="sortable-header"
                onClick={() => handleSortChange("isActive")}
              >
                <Tooltip title="Sort by Status" arrow>
                  Status
                  {sortBy === "isActive" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Tooltip>
              </th>
              <th
                style={{ fontWeight: "bold" }}
                className="sortable-header"
                onClick={() => handleSortChange("createdAt")}
              >
                <Tooltip title="Click here to sort by Create Time" arrow>
                  Create Time
                  {sortBy === "createdAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Tooltip>
              </th>
              <th
                style={{ fontWeight: "bold" }}
                className="sortable-header"
                onClick={() => handleSortChange("modifiedAt")}
              >
                <Tooltip title="Click here to sort by Modify Time" arrow>
                  Modify Time
                  {sortBy === "modifiedAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </Tooltip>
              </th>
            </tr>
          </MDBTableHead>
          <MDBTableBody className="bg-light">
            {loading ? (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  <CircularProgress />
                </td>
              </tr>
            ) : (
              dataUsers.map((user, index) => (
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
                    <div className="d-flex">
                      <div style={{ flex: "3" }}>
                        <Avatar alt={user.username} src={user.avatarUrl} />
                      </div>
                      <div
                        style={{
                          flex: "9",
                          marginLeft: "8px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <span style={{ color: "#000000" }}>
                          {user.username}
                        </span>
                        <div
                          className="badge rounded-pill mt-1 px-2"
                          style={{
                            backgroundColor: roleColors[user.role] || "black",
                            width: "fit-content",
                          }}
                        >
                          {getRoleNameById(user.role)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span>
                        {user.lastName} {user.firstName}
                        {user.gender === 0 && (
                          <Male style={{ color: "#3399FF" }} />
                        )}
                        {user.gender === 1 && (
                          <Female style={{ color: "#FF6699" }} />
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="tooltip-cell">
                    {user.address ? (
                      <Tooltip title={user.address} arrow>
                        {user.address.length > 20
                          ? `${user.address.slice(0, 20)}...`
                          : user.address}
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {user.phoneNumber || "-"}
                    </div>
                  </td>
                  <td>
                    {user.isActive ? (
                      <Tooltip title="Active" arrow>
                        <LockOpen
                          className="square-icon"
                          style={{ color: "#009900" }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="DeActive" arrow>
                        <Lock
                          className="square-icon"
                          style={{ color: "#FF9900" }}
                        />
                      </Tooltip>
                    )}
                  </td>
                  <td>{formatDate(user.createdAt || "-")}</td>
                  <td>{formatDate(user.modifiedAt || "-")}</td>
                </tr>
              ))
            )}
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
