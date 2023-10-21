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
import { ArrowDropDown, ArrowDropUp, ContentCopy, Delete, Edit } from "@mui/icons-material";
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

const IndexTicket = () => {
  const [dataTickets, setDataTickets] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEdit, setDialogEdit] = useState(false);
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
  const navigate = useNavigate();

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
    try{
      if(selectedTickets.length === 0) {
        return;
      }
      const deletePromises = selectedTickets.map(async (ticketId) => {
        try{
          const res = await deleteTicketByManager(ticketId);
          if(res.isError) {
            toast.error(`Error deleting ticket with ID ${ticketId}: `, res.message);
          }
          toast.success(`Delete ticket with ID successful ${ticketId}`);
          return ticketId;
        }catch(error){
          toast.error(`Error deleting ticket with ID ${ticketId}: `, error);
          return null;
        }
      });

      const deletedTicketIds = await Promise.all(deletePromises);
      const updatedTickets = dataTickets.filter((ticket) => !deletedTicketIds.includes(ticket.id));
      setDataTickets(updatedTickets);
      setSelectedTickets([]);
      
    }catch(error){
      toast.error("Failed to delete selected tickets, Please try again later");
    }
  }

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
    console.log(ticketData);
    navigate(`/home/detailTicket/${ticketId}`);
    //setDialogEdit(true);
  };

  const handleCloseRequestTicket = (e) => {
    e.preventDefault();
    setDialogOpen(false);
  };

  const handleCloseEditTicket = (e) => {
    setDialogEdit(false);
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
              <MDBBtn color="eee" style={{ fontWeight: "bold", fontSize: "20px" }}  onClick={handleDeleteSelectedTickets} >
                <Delete /> Delete 
              </MDBBtn>
              <FormControl
                variant="outlined"
                style={{ minWidth: 120, marginRight: 10 , marginTop: 10, marginLeft: 10}}
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
              <div style={{ textAlign: "center" }}>
                <label style={{ fontWeight: 'bold', marginTop: '15px' }}>Items per page: </label>
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small"> 
                <Select value={pageSize} onChange={handleChangePageSize} className="select">
                  <MenuItem  value={5}>5</MenuItem >
                  <MenuItem  value={10}>10</MenuItem >
                  <MenuItem  value={20}>20</MenuItem >
                  <MenuItem  value={50}>50</MenuItem >
                </Select>
                </FormControl>   
              </div>
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
                <th style={{ fontWeight: "bold" }}>
                  Edit
                </th>
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
                const createdAtDate = new Date(ticket.createdAt);
                const isSelected = selectedTickets.includes(ticket.id);
                const formattedDate = `${String(
                  createdAtDate.getDate()
                ).padStart(2, "0")}/${String(
                  createdAtDate.getMonth() + 1
                ).padStart(2, "0")}/${createdAtDate.getFullYear()} ${String(
                  createdAtDate.getHours()
                ).padStart(2, "0")}:${String(
                  createdAtDate.getMinutes()
                ).padStart(2, "0")}`;

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
                      {ticket.priority === 0 ? (
                        <span className="badge bg-primary rounded-pill">
                          Low
                        </span>
                      ) : ticket.priority === 1 ? (
                        <span className="badge bg-info rounded-pill">
                          Normal
                        </span>
                      ) : ticket.priority === 2 ? (
                        <span className="badge bg-secondary rounded-pill">
                          Medium
                        </span>
                      ) : ticket.priority === 3 ? (
                        <span className="badge bg-warning rounded-pill">
                          High
                        </span>
                      ) : (
                        <span className="badge bg-danger rounded-pill">
                          Critical
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          ticket.ticketStatus === 0
                            ? "bg-secondary"
                            : "bg-success"
                        } rounded-pill`}
                      >
                        {ticket.ticketStatus === 0
                          ? "Not Processed"
                          : "Processed"}
                      </span>
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

      {/* <Dialog
        maxWidth="lg"
        fullWidth
        open={dialogEdit}
        onClose={handleCloseEditTicket}
      >
        
        <EditTicket selectedTicketData={selectedTicketData}  onClose={handleCloseEditTicket} />
      </Dialog> */}
    </section>
    
  );
};

export default IndexTicket;
