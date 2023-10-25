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
import { deleteTicketByManager, getAllTicket } from "../../../app/api/ticket";
import { getAllCategories } from "../../../app/api/category";
import "../../../assets/css/manager.css";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  Delete,
  Edit,
} from "@mui/icons-material";
import CreateTicket from "./CreateTicket";
import {
  Box,
  Dialog,
  FormControl,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import { useNavigate } from "react-router-dom";
import { formatTicketDate } from "../../helpers/FormatAMPM";
import PageSizeSelector from "../Pagination/Pagination";
import {
  TicketStatusOptions,
  getPriorityOptionById,
} from "../Admin/tableComlumn";

const IndexTicket = () => {
  const [dataTickets, setDataTickets] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicketData, setSelectedTicketData] = useState(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

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
        sortDirection
      );
      setDataTickets(res);
      setIsLoading(false);
    } catch (error) {
      console.log("Error while fetching data", error);
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories();
      setDataCategories(res);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };
  const handleSelectTicket = (ticketId) => {
    if (selectedTickets.includes(ticketId)) {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
    } else {
      setSelectedTickets([...selectedTickets, ticketId]);
    }
  };

  const handleSelectAllTickets = () => {
    if (selectedTickets.length === dataTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(dataTickets.map((ticket) => ticket.id));
    }
  };

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

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleOpenRequestTicket = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleOpenEditTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    const ticketData = dataTickets.find((ticket) => ticket.id === ticketId);
    setSelectedTicketData(ticketData);
    navigate(`/home/detailTicket/${ticketId}`);
  };

  const handleCloseRequestTicket = (e) => {
    e.preventDefault();
    setDialogOpen(false);
  };

  const getCategoryNameById = (categoryId) => {
    const category = dataCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  useEffect(() => {
    fetchAllTicket();
    fetchAllCategories();
    setTotalPages(4);
  }, [fetchAllTicket]);

  return (
    <section style={{ backgroundColor: "#FFF" }}>
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <MDBContainer
          className="py-5"
          style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
        >
          <MDBNavbar expand="lg" light bgColor="inherit">
            <MDBContainer fluid>
              <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
                <ContentCopy style={{ marginRight: "20px" }} /> All Request
              </MDBNavbarBrand>
              <MDBNavbarNav className="ms-auto manager-navbar-nav">
                <MDBBtn
                  color="#eee"
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  onClick={handleOpenRequestTicket}
                >
                  <FaPlus /> New
                </MDBBtn>
                <MDBBtn
                  color="eee"
                  style={{ fontWeight: "bold", fontSize: "20px" }}
                  onClick={handleDeleteSelectedTickets}
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
            <p>Loading...</p>
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
                  <th style={{ fontWeight: "bold" }}>Edit</th>
                  <th
                    style={{ fontWeight: "bold" }}
                    onClick={() => handleSortChange("id")}
                  >
                    ID{" "}
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
                        <Edit onClick={() => handleOpenEditTicket(ticket.id)} />
                      </td>
                      <td>{ticket.requesterId}</td>
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
                      <td onClick={toggleDropdown}>
                        {isDropdownVisible ? (
                          <select
                            style={ticketStatusOption.badgeStyle}
                            value={ticket.ticketStatus}
                            // onChange={(e) =>
                            //   handleTicketStatusChange(
                            //     ticket.id,
                            //     e.target.value
                            //   )
                            // }
                            // onBlur={toggleDropdown}
                          >
                            {TicketStatusOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                <span className={option.badgeStyle}>
                                  {option.icon}
                                  {option.name}
                                </span>
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
      )}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>
      <Dialog
        maxWidth="lg"
        fullWidth
        open={dialogOpen}
        onClose={handleCloseRequestTicket}
      >
        <CreateTicket onClose={handleCloseRequestTicket} />
      </Dialog>
    </section>
  );
};

export default IndexTicket;
