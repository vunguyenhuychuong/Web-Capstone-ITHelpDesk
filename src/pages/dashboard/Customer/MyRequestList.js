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
  import PageSizeSelector from "../Pagination/Pagination";
  import {
    ContentCopy,
    Lock,
    LockOpen,
    Square,
    ViewCompact,
  } from "@mui/icons-material";
  import { formatDate } from "../../helpers/FormatDate";
  import { useNavigate } from "react-router-dom";
  import { Box, FormControl, MenuItem, Pagination, Select } from "@mui/material";
  import { FaSearch } from "react-icons/fa";
  import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import { GetTicketUserAvailable } from "../../../app/api/ticket";
  
  const MyRequestList = () => {
    const [dataListTicketsSolution, setDataListTicketsSolution] = useState([]);
    const [selectedSolutionIds, setSelectedSolutionIds] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchField, setSearchField] = useState("title");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortDirection, setSortDirection] = useState("asc");
    const [sortBy, setSortBy] = useState("id");
    const navigate = useNavigate();
  
    const fetchDataListTicketSolution = async () => {
      try {
        let filter = "";
        if(searchQuery) {
          filter = `title="${encodeURIComponent(searchQuery)}"`;
        }
        setLoading(true);
        const response = await GetTicketUserAvailable();
        setDataListTicketsSolution(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
  
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
      if (selectedSolutionIds.length === dataListTicketsSolution.length) {
        setSelectedSolutionIds([]);
      } else {
        setSelectedSolutionIds(
          dataListTicketsSolution.map((solution) => solution.id)
        );
      }
    };
  
    const handleOpenDetailTicketSolution = (solutionId) => {
      navigate(`/home/detailSolution/${solutionId}`);
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
      fetchDataListTicketSolution();
      setTotalPages(4);
    }, []);
  
    return (
      <section style={{ backgroundColor: "#eee" }}>
        <MDBContainer className="py-5 custom-container">
          <MDBNavbar expand="lg" light bgColor="inherit">
            <MDBContainer fluid>
              <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "16px" }}>
                <ContentCopy style={{ marginRight: "20px" }} /> All My Request 
              </MDBNavbarBrand>
              <MDBNavbarNav className="ms-auto manager-navbar-nav">
                {/* <FormControl
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
                      <MenuItem value="keyword">Keyword</MenuItem>
                      <MenuItem value="isApproved">Status</MenuItem>
                      <MenuItem value="isPublic">Visibility</MenuItem>
                      <MenuItem value="reviewDate">reviewDate</MenuItem>
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
                          fetchDataListTicketSolution();
                        }
                      }}
                      className="input-search"
                      placeholder="Type to search..."
                    />
                  </div>
                <PageSizeSelector
                    pageSize={pageSize}
                    handleChangePageSize={handleChangePageSize}
                  /> */}
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
                        dataListTicketsSolution.length
                      }
                      onChange={handleSelectAllSolutions}
                    />
                  </th>
                  <th style={{ fontWeight: "bold", fontSize: "14px" }}></th>
                  <th 
                    style={{ fontWeight: "bold", fontSize: "14px" }}
                    // onClick={() => handleSortChange("title")}
                    >Title</th>
                  <th 
                    style={{ fontWeight: "bold", fontSize: "14px" }}
                    // onClick={() => handleSortChange("isApproved")}
                    >Status</th>
                  <th 
                    style={{ fontWeight: "bold", fontSize: "14px" }}
                    // onClick={() => handleSortChange("isPublic")}
                    >
                    Visibility
                  </th>
                  <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                    Review Date
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
                  {dataListTicketsSolution.map((TicketSolution, index) => {
                    const isSelected = selectedSolutionIds.includes(
                      TicketSolution.id
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
                          <ViewCompact
                            onClick={() =>
                              handleOpenDetailTicketSolution(TicketSolution.id)
                            }
                          />{" "}
                        </td>
                        <td>{TicketSolution.title}</td>
                        <td>
                          {TicketSolution.isApproved ? (
                            <>
                              <Square
                                className="square-icon"
                                style={{ color: "green" }}
                              />
                              <span>Approved</span>
                            </>
                          ) : (
                            <>
                              <Square className="square-icon" />
                              <span>Not Approved</span>
                            </>
                          )}
                        </td>
                        <td>
                          {TicketSolution.isPublic ? (
                            <>
                              <LockOpen
                                className="square-icon"
                                style={{ color: "green" }}
                              />{" "}
                              <span>Public</span>
                            </>
                          ) : (
                            <>
                              <Lock className="square-icon" /> Private
                            </>
                          )}
                        </td>
                        <td>{formatDate(TicketSolution.reviewDate)}</td>
                        <td>
                          {TicketSolution.createdAt
                            ? new Date(
                                TicketSolution.createdAt
                              ).toLocaleDateString()
                            : ""}
                        </td>
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
      </section>
    );
  };
  
  export default MyRequestList;
  