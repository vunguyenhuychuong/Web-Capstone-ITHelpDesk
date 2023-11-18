import {
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
import { ContentCopy, ViewCompact } from "@mui/icons-material";
import { formatDate } from "../../helpers/FormatDate";
import { Box, FormControl, MenuItem, Pagination, Select } from "@mui/material";
import { FaSearch } from "react-icons/fa";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import { getTicketByUserIdPagination } from "../../../app/api/ticket";
import { useSelector } from "react-redux";
import {
  TicketStatusOptions,
  getPriorityOption,
} from "../../helpers/tableComlumn";
import { getAllCategories } from "../../../app/api/category";

const MyRequestList = () => {
  const [dataListTicketsCustomer, setDataListTicketsCustomer] = useState([]);
  const user = useSelector((state) => state.auth);
  const userId = user.user.id;
  const [dataCategories, setDataCategories] = useState([]);
  const [selectedSolutionIds, setSelectedSolutionIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");

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

  const handleSelectSolution = (solutionId) => {
    if (selectedSolutionIds.includes(solutionId)) {
      setSelectedSolutionIds(
        selectedSolutionIds.filter((id) => id !== solutionId)
      );
    } else {
      setSelectedSolutionIds([...selectedSolutionIds, solutionId]);
    }
  };

  const handleSelectAllSolutions = () => {
    if (selectedSolutionIds.length === dataListTicketsCustomer.length) {
      setSelectedSolutionIds([]);
    } else {
      setSelectedSolutionIds(
        dataListTicketsCustomer.map((solution) => solution.id)
      );
    }
  };

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
              <span style={{ color: "#FFFFFF" }}>All My Request</span>
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
                <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedSolutionIds.length ===
                      dataListTicketsCustomer.length
                    }
                    onChange={handleSelectAllSolutions}
                  />
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}></th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("title")}
                >
                  Title
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("categoryId")}
                >
                  Category
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("priority")}
                >
                  Priority
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("ticketStatus")}
                >
                  Ticket Status
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Created
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Last Update
                </th>
              </tr>
            </MDBTableHead>
            {loading ? (
              <CustomizedProgressBars />
            ) : (
              <MDBTableBody className="bg-light">
                {dataListTicketsCustomer.map((TicketSolution, index) => {
                  const isSelected = selectedSolutionIds.includes(
                    TicketSolution.id
                  );
                  const ticketStatusOption = TicketStatusOptions.find(
                    (option) => option.id === TicketSolution.ticketStatus
                  );
                  return (
                    <tr key={index}>
                      <td>{TicketSolution.id}</td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            handleSelectSolution(TicketSolution.id)
                          }
                        />
                      </td>
                      <td>
                        <ViewCompact />{" "}
                      </td>
                      <td>{TicketSolution.title}</td>
                      <td>{getCategoryNameById(TicketSolution.categoryId)}</td>
                      <td>{getPriorityOption(TicketSolution.priority)}</td>
                      <td>
                        <span style={ticketStatusOption.badgeStyle}>
                          {ticketStatusOption.icon}
                          {ticketStatusOption.name}
                        </span>
                      </td>
                      <td>{formatDate(TicketSolution.createdAt)}</td>
                      <td>{formatDate(TicketSolution.modifiedAt)}</td>
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
