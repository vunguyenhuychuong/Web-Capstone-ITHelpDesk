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
import React, { useCallback, useEffect, useState } from "react";
import "../../../assets/css/ticketCustomer.css";
import PageSizeSelector from "../Pagination/Pagination";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  ViewCompact,
} from "@mui/icons-material";
import { formatDate } from "../../helpers/FormatDate";
import {
  Box,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  Tooltip,
} from "@mui/material";
import { FaPlus, FaSearch } from "react-icons/fa";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import { getTicketByUserIdPagination } from "../../../app/api/ticket";
import { useSelector } from "react-redux";
import {
  TicketStatusOptions,
  getPriorityOptionById,
} from "../../helpers/tableComlumn";
import { getAllCategories } from "../../../app/api/category";
import { useNavigate } from "react-router-dom";

const MyRequestList = () => {
  const [dataListTicketsCustomer, setDataListTicketsCustomer] = useState([]);
  const user = useSelector((state) => state.auth);
  const userId = user.user.id;
  const [dataCategories, setDataCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const navigate = useNavigate();

  const fetchDataListTicketCustomer = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      setLoading(true);
      const response = await getTicketByUserIdPagination(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection,
        userId
      );
      setDataListTicketsCustomer(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    searchField,
    searchQuery,
    sortBy,
    sortDirection,
    userId,
  ]);

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories();
      setDataCategories(res);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const getCategoryNameById = (categoryId) => {
    const category = dataCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleOpenDetailTicket = (ticketId) => {
    navigate(`/home/detailTicket/${ticketId}`);
  };

  const handleOpenRequestTicket = () => {
    navigate(`/home/createRequest`);
  };

  useEffect(() => {
    fetchDataListTicketCustomer();
    fetchAllCategories();
    setTotalPages(4);
  }, [fetchDataListTicketCustomer]);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "16px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All My Requests</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                onClick={handleOpenRequestTicket}
              >
                <FaPlus /> New
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
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  <MenuItem value="createdAt">Created At</MenuItem>
                  <MenuItem value="dueTime">Due Time</MenuItem>
                  <MenuItem value="urgency">Urgency</MenuItem>
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
                      fetchDataListTicketCustomer();
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
        <div>
          <MDBTable className="align-middle mb-0" responsive>
            <MDBTableHead className="bg-light">
              <tr>
                <th style={{ fontWeight: "bold", fontSize: "18px" }}>ID</th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>Detail</th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("title")}
                  className="sortable-header"
                >
                  <Tooltip title="Click here to sort by Title" arrow>
                    Title
                    {sortBy === "title" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </Tooltip>
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("categoryId")}
                >
                  <Tooltip title="Click here to sort by Category" arrow>
                    Category
                    {sortBy === "categoryId" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </Tooltip>
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("priority")}
                  className="sortable-header"
                >
                  <Tooltip title="Click here to sort by Priority" arrow>
                    Priority
                    {sortBy === "priority" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </Tooltip>
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("ticketStatus")}
                  className="sortable-header"
                >
                  <Tooltip title="Click here to sort by Ticket Status" arrow>
                    Ticket Status
                    {sortBy === "ticketStatus" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </Tooltip>
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("createdAt")}
                  className="sortable-header"
                >
                  <Tooltip title="Click here to sort by Create Time" arrow>
                    Created
                    {sortBy === "modifiedAt" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </Tooltip>
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("modifiedAt")}
                  className="sortable-header"
                >
                  <Tooltip title="Click here to sort by Update Time" arrow>
                    Last Update
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
            {loading ? (
              <CustomizedProgressBars />
            ) : (
              <MDBTableBody className="bg-light">
                {dataListTicketsCustomer.map((Ticket, index) => {
                  const ticketStatusOption = TicketStatusOptions.find(
                    (option) => option.id === Ticket.ticketStatus
                  );
                  const priorityOption = getPriorityOptionById(Ticket.priority);
                  return (
                    <tr key={index}>
                      <td>{Ticket.id}</td>
                      <td>
                        <ViewCompact
                          onClick={() => handleOpenDetailTicket(Ticket.id)}
                        />{" "}
                      </td>
                      <td>{Ticket.title}</td>
                      <td>{getCategoryNameById(Ticket.categoryId)}</td>
                      <td>
                        {" "}
                        <span
                          className={`badge ${priorityOption.colorClass} rounded-pill`}
                          style={{ fontSize: priorityOption.fontSize }}
                        >
                          {priorityOption.name}
                        </span>
                      </td>
                      <td>
                        <span style={ticketStatusOption.badgeStyle}>
                          {ticketStatusOption.icon}
                          {ticketStatusOption.name}
                        </span>
                        {/* <td>{getStatusNameById(Ticket.ticketStatus)}</td> */}
                      </td>
                      <td>{formatDate(Ticket.createdAt)}</td>
                      <td>{formatDate(Ticket.modifiedAt)}</td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            )}
          </MDBTable>
        </div>
      </MDBContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>
    </>
  );
};

export default MyRequestList;
