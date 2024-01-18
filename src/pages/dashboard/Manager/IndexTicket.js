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
import {
  ChangeStatusTicket,
  deleteTicketByManager,
  getAllTicket,
} from "../../../app/api/ticket";
import { getAllCategories } from "../../../app/api/category";
import "../../../assets/css/manager.css";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  Delete,
  ViewCompact,
} from "@mui/icons-material";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PageSizeSelector from "../Pagination/Pagination";
import Chip from "@mui/material/Chip";
import {
  TicketStatusOptions,
  getPriorityOptionById,
} from "../../helpers/tableComlumn";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import { useSelector } from "react-redux";
import { formatDate } from "../../helpers/FormatDate";
import CircularLoading from "../../../components/iconify/CircularLoading";

const IndexTicket = () => {
  const [dataTickets, setDataTickets] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [ticketStatus, setTicketStatus] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const isUserRole2 = user.role === 2;

  const fetchAllTicket = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      const res = await getAllTicket(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection,
        ticketStatus
      );
      setDataTickets(res?.data);
      setTotalPages(res?.totalPage);
      setIsLoading(false);
    } catch (error) {
      console.log("Error while fetching data", error);
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, sortBy, sortDirection, ticketStatus]);

  const handleStatusChange = (e) => {
    setTicketStatus(e.target.value);
  };

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories();
      setDataCategories(res?.data);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };
  const handleSelectTicket = useCallback(
    (ticketId) => {
      if (selectedTickets.includes(ticketId)) {
        setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
      } else {
        setSelectedTickets([...selectedTickets, ticketId]);
      }
    },
    [selectedTickets]
  );

  const handleSelectAllTickets = useCallback(() => {
    if (selectedTickets.length === dataTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(dataTickets.map((ticket) => ticket.id));
    }
  }, [selectedTickets]);

  const handleDeleteSelectedTickets = async (id) => {
    try {
      if (selectedTickets.length === 0) {
        return;
      }
      const deletePromises = selectedTickets.map(async (ticketId) => {
        try {
          const res = await deleteTicketByManager(ticketId);
          if (res.isError) {
            toast.error(
              `Error deleting ticket with ID ${ticketId}: `,
              res.message
            );
          }
          toast.success(`Delete ticket with ID successful ${ticketId}`);
          return ticketId;
        } catch (error) {
          toast.error(`Error deleting ticket with ID ${ticketId}: `, error);
          return null;
        }
      });

      const deletedTicketIds = await Promise.all(deletePromises);
      const updatedTickets = dataTickets.filter(
        (ticket) => !deletedTicketIds.includes(ticket.id)
      );
      setDataTickets(updatedTickets);
      setSelectedTickets([]);
    } catch (error) {
      toast.error("Failed to delete selected tickets, Please try again later");
    }
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleSortChange = useCallback(
    (field) => {
      if (sortBy === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field);
        setSortDirection("asc");
      }
    },
    [sortBy, sortDirection]
  );

  const handleOpenRequestTicket = () => {
    navigate(`/home/createTicket`);
  };

  const handleOpenEditTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    const ticketData = dataTickets.find((ticket) => ticket.id === ticketId);
    setSelectedTicketData(ticketData);
    navigate(`/home/detailTicket/${ticketId}`);
  };

  const getCategoryNameById = (categoryId) => {
    const category = dataCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const handleTicketStatusChange = useCallback(async (ticketId, newStatus) => {
    try {
      await ChangeStatusTicket(ticketId, newStatus);
    } catch (error) {
      console.log("Error changing ticket status:", error);
    }
  }, []);

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
    fetchAllTicket();
    fetchAllCategories();
  }, [fetchAllTicket]);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All Tickets</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
                onClick={handleOpenRequestTicket}
              >
                <FaPlus /> New
              </MDBBtn>

              <MDBBtn
                color="eee"
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "#FFFFFF",
                }}
                onClick={handleDeleteSelectedTickets}
              >
                <Delete /> Delete
              </MDBBtn>

              <div style={{ textAlign: "center" }}>
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ color: "white", margin: 1, width: "10vw" }}
                >
                  <InputLabel sx={{ color: "white" }}>Select Status</InputLabel>
                  <Select
                    label={"Select Status"}
                    value={ticketStatus}
                    onChange={handleStatusChange}
                    inputProps={{
                      name: "sortField",
                      id: "search-field",
                    }}
                    sx={{
                      color: "white",
                    }}
                  >
                    <MenuItem value={null}>All</MenuItem>
                    <MenuItem value={0}>Open</MenuItem>
                    <MenuItem value={1}>Assign</MenuItem>
                    <MenuItem value={2}>Progress</MenuItem>
                    <MenuItem value={3}>Resolved</MenuItem>
                    <MenuItem value={4}>Closed</MenuItem>
                    <MenuItem value={5}>Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </div>
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
                  <MenuItem value="requesterId">RequesterId</MenuItem>
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                  <MenuItem value="impact">Impact</MenuItem>
                  <MenuItem value="ticketStatus">ticketStatus</MenuItem>
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
                      fetchAllTicket();
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
          <MDBTableBody className="bg-light">
            <tr>
              <td>
                <CircularLoading />
              </td>
            </tr>
          </MDBTableBody>
        ) : (
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
                    checked={selectedTickets.length === dataTickets.length}
                    onChange={handleSelectAllTickets}
                  />
                </th>

                {/* <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("id")}
                  title="Click to Sort by ID"
                >
                  Id{" "}
                  {sortBy === "id" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th> */}
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("title")}
                  title="Subject"
                >
                  Subject{" "}
                  {sortBy === "title" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("lastName")}
                  title="Requester"
                >
                  Requester
                  {sortBy === "title" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>

                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("type")}
                >
                  Type
                  {sortBy === "type" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("priority")}
                >
                  Priority{" "}
                  {sortBy === "priority" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("ticketStatus")}
                >
                  Status{" "}
                  {sortBy === "ticketStatus" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("createdAt")}
                >
                  Created Date
                  {sortBy === "createdAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("dueTime")}
                >
                  Due Date{" "}
                  {sortBy === "dueTime" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th style={{ fontWeight: "bold" }}></th>
              </tr>
            </MDBTableHead>
            <MDBTableBody className="bg-light">
              {dataTickets.map((ticket, index) => {
                const isSelected = selectedTickets.includes(ticket.id);
                const ticketStatusOption = TicketStatusOptions.find(
                  (option) => option.id === ticket.ticketStatus
                );
                const priorityOption = getPriorityOptionById(ticket.priority);
                return (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectTicket(ticket.id)}
                      />
                    </td>

                    {/* <td> {ticket.id}</td> */}
                    <td
                      className="tooltip-cell"
                      title={`Id:${ticket.id} \nDescription:${
                        ticket.description
                      }\nCategory:${getCategoryNameById(ticket.categoryId)}`}
                    >
                      {ticket.title.length > 20
                        ? `${ticket.title.slice(0, 20)}...`
                        : ticket.title}
                    </td>
                    <td>
                      {ticket.requester.lastName} {ticket.requester.firstName}
                    </td>

                    <td>
                      {ticket.type === "offline" ? (
                        <Chip
                          label="Offline"
                          size="small"
                          sx={{ backgroundColor: "#c2c2c2" }}
                        />
                      ) : (
                        <Chip
                          label="Online"
                          size="small"
                          variant="outlined"
                          sx={{ backgroundColor: "greenyellow" }}
                        />
                      )}
                    </td>
                    <td>
                      {
                        <span
                          className={`badge ${priorityOption.colorClass} rounded-pill`}
                          style={{ fontSize: priorityOption.fontSize }}
                        >
                          {priorityOption.name}
                        </span>
                      }
                    </td>
                    <td>
                      {
                        <span
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={handleDropdownClick}
                          style={ticketStatusOption.badgeStyle}
                        >
                          {isDropdownVisible ? (
                            <select
                              value={ticket.ticketStatus}
                              onChange={(e) =>
                                handleTicketStatusChange(
                                  ticket.id,
                                  parseInt(e.target.value)
                                )
                              }
                              onBlur={() => setDropdownVisible(false)}
                            >
                              {TicketStatusOptions.map((option) => (
                                <option
                                  key={option.id}
                                  value={option.id}
                                  className={option.iconClass}
                                >
                                  {option.icon} {option.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <>
                              {ticketStatusOption.icon}
                              {ticketStatusOption.name}
                            </>
                          )}
                        </span>
                      }
                    </td>
                    <td>{formatDate(ticket.createdAt)}</td>
                    <td>{formatDate(ticket.dueTime)}</td>
                    <td>
                      <ViewCompact
                        onClick={() => handleOpenEditTicket(ticket.id)}
                      />
                    </td>
                  </tr>
                );
              })}
            </MDBTableBody>
          </MDBTable>
        )}
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

export default IndexTicket;
