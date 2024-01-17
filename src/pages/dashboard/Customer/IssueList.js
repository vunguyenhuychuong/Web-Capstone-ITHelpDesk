import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketCustomer.css";
import { getTicketByUserId } from "../../../app/api/ticket";
import {
  TicketStatusOptions,
  getPriorityBadge,
} from "../../helpers/tableComlumn";
import CategoryApi from "../../../app/api/category";
import { ContentCopy, Edit } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { formatDate } from "../../helpers/FormatDate";
import { useNavigate } from "react-router-dom";
import PageSizeSelector from "../Pagination/Pagination";
import { useCallback } from "react";
import { Box, FormControl, MenuItem, Pagination, Select } from "@mui/material";
import { FaSearch } from "react-icons/fa";

const IssueList = () => {
  const [dataListTickets, setDataListTickets] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const userId = user.user.id;
  console.log(userId);

  const fetchDataListTicket = useCallback(
    async (userId) => {
      try {
        const response = await getTicketByUserId(
          searchField,
          searchQuery,
          userId,
          currentPage,
          pageSize
        );
        setDataListTickets(response?.data);
        setTotalPages(response?.totalPage);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
    [searchField, searchQuery, currentPage, pageSize]
  );

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const fetchCategoriesList = async () => {
    try {
      const fetchCategories = await CategoryApi.getAllCategories();
      setDataCategories(fetchCategories);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const handleOpenDialog = (ticketId) => {
    navigate(`/home/ticketService/${ticketId}`);
  };

  const getCategoryName = (categoryId) => {
    const category = dataCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  const getStatusName = (statusId) => {
    const statusOption = TicketStatusOptions.find(
      (option) => option.id === statusId
    );
    return statusOption ? statusOption.name : "Unknown Status";
  };

  useEffect(() => {
    fetchDataListTicket(userId);
    fetchCategoriesList();
  }, [userId, fetchDataListTicket]);

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" light bgColor="inherit">
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px" }} /> All Ticket Request
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
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
                  <MenuItem value="categoryId">Category</MenuItem>
                  <MenuItem value="impact">impact</MenuItem>
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
                      fetchDataListTicket();
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
            <tr>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>Edit</th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>Title</th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                Description
              </th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>Category</th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>Priority</th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                Create Time
              </th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>Status</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody className="bg-light">
            {dataListTickets.map((ticket, index) => (
              <tr key={index}>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => handleOpenDialog(ticket.id)}
                >
                  <Edit />
                </td>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{getCategoryName(ticket.categoryId)}</td>
                <td>{getPriorityBadge(ticket.priority)}</td>
                <td>{formatDate(ticket.createdAt)}</td>
                <td>{getStatusName(ticket.ticketStatus)}</td>
              </tr>
            ))}
          </MDBTableBody>
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

export default IssueList;
