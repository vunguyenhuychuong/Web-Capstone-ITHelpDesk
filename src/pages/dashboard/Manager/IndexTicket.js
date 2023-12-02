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
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { formatTicketDate } from "../../helpers/FormatAMPM";
import PageSizeSelector from "../Pagination/Pagination";
import {
  TicketStatusOptions,
  getPriorityOptionById,
} from "../../helpers/tableComlumn";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import { useSelector } from "react-redux";

const IndexTicket = () => {
  const [dataTickets, setDataTickets] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  // const [searchField, setSearchField] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const isUserRole2 = user.role === 2;

  const fetchAllTicket = useCallback(async () => {
    try {
      // let filter = "";
      // if (searchQuery) {
      //   filter = `title="${encodeURIComponent(searchQuery)}"`;
      // }
      const res = await getAllTicket(
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataTickets(res);
      setIsLoading(false);
    } catch (error) {
      console.log("Error while fetching data", error);
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, sortBy, sortDirection]);

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories();
      setDataCategories(res);
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
    setTotalPages(4);
  }, [fetchAllTicket]);

  return (
    <>
      <MDBContainer
        className="py-5 custom-container"
      >
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />  <span style={{ color: "#FFFFFF" }}>All My Request</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px", color: "#FFFFFF" }}
                onClick={handleOpenRequestTicket}
              >
                <FaPlus /> New
              </MDBBtn>
              {isUserRole2 && (
              <MDBBtn
                color="eee"
                style={{ fontWeight: "bold", fontSize: "20px", color: "#FFFFFF" }}
                onClick={handleDeleteSelectedTickets}
              >             
                <Delete /> Delete
              </MDBBtn>
                )}
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
                {/* <Select
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
                </Select> */}
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
          <CustomizedProgressBars />
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
                <th style={{ fontWeight: "bold" }}></th>
                <th
                  style={{ fontWeight: "bold" }}
                  onClick={() => handleSortChange("id")}
                >
                  ID
                  {sortBy === "id" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  onClick={() => handleSortChange("title")}
                >
                  Title{" "}
                  {sortBy === "title" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  onClick={() => handleSortChange("description")}
                >
                  Description{" "}
                  {sortBy === "description" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
                  onClick={() => handleSortChange("categoryId")}
                >
                  Category{" "}
                  {sortBy === "categoryId" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold" }}
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
                  onClick={() => handleSortChange("createdAt")}
                >
                  Date{" "}
                  {sortBy === "createdAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
              </tr>
            </MDBTableHead>
            <MDBTableBody className="bg-light">
              {dataTickets.map((ticket, index) => {
                const formattedDate = formatTicketDate(ticket.createdAt);
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
                    <td>
                      <ViewCompact onClick={() => handleOpenEditTicket(ticket.id)} />
                    </td>
                    <td>{ticket.id}</td>
                    <td>{ticket.title}</td>
                    <td>{ticket.description}</td>
                    <td>{getCategoryNameById(ticket.categoryId)}</td>
                    <td>
                      <span
                        className={`badge ${priorityOption.colorClass} rounded-pill`}
                        style={{ fontSize: priorityOption.fontSize }}
                      >
                        {priorityOption.name}
                      </span>
                    </td>
                    <td
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={handleDropdownClick}
                    >
                      {isDropdownVisible ? (
                        <select
                          style={ticketStatusOption.badgeStyle}
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
                        <span style={ticketStatusOption.badgeStyle}>
                          {ticketStatusOption.icon}
                          {ticketStatusOption.name}
                        </span>
                      )}
                    </td>
                    <td>{formattedDate}</td>
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
