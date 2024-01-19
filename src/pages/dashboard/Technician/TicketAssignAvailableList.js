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
import { ContentCopy, ViewCompact } from "@mui/icons-material";
import { formatDate } from "../../helpers/FormatDate";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { FaPlus, FaSearch } from "react-icons/fa";
import PageSizeSelector from "../Pagination/Pagination";
import CloseTicket from "../../../assets/images/NoTicketSolution.jpg";
import {
  ChangeStatusTicket,
  getAssignTicket,
  getTicketAssignAvailable,
} from "../../../app/api/ticket";
import {
  TicketStatusOptions,
  getImpactById,
  getPriorityOption,
} from "../../helpers/tableComlumn";
import CircularLoading from "../../../components/iconify/CircularLoading";

const TicketAssignAvailableList = () => {
  const [dataListTicketsAssign, setDataListTicketsAssign] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchField, setSearchField] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [selectedTicketStatus, setSelectedTicketStatus] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const fetchAssignTicket = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      const res = await getAssignTicket(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection,
        selectedTicketStatus
      );
      setDataListTicketsAssign(res?.data);
      setTotalPages(res?.totalPage);
      setLoading(false);
    } catch (error) {
      console.log("Error while fetching data", error);
      setLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    searchQuery,
    sortBy,
    sortDirection,
    selectedTicketStatus,
  ]);

  const fetchDataListTicketSolution = async () => {
    try {
      setLoading(true);
      const response = await getTicketAssignAvailable();
      console.log(response);
      setDataListTicketsAssign(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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

  const handleOpenCreateTicketSolution = () => {
    navigate("/home/createTask");
  };

  const handleOpenDetailTicketAssign = (ticketId) => {
    navigate(`/home/detailTicket/${ticketId}`);
  };

  useEffect(() => {
    fetchAssignTicket();
  }, [fetchAssignTicket]);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid style={{ color: "#FFFFFF" }}>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All Ticket Assign</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
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
                <InputLabel htmlFor="ticketStatus" sx={{ color: "white" }}>
                  Select Status
                </InputLabel>
                <Select
                  label="Select Status"
                  value={selectedTicketStatus}
                  onChange={(e) => setSelectedTicketStatus(e.target.value)}
                  style={{ color: "white", width: "10vw" }}
                >
                  <MenuItem value={null}>All</MenuItem>
                  {TicketStatusOptions?.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="impactId">Impact</MenuItem>
                  <MenuItem value="createdAt">Created At</MenuItem>
                </Select>
              </FormControl>
              <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBeforeInput={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      fetchAssignTicket();
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
                {/* <th style={{ fontWeight: "bold", fontSize: "18px" }}>ID</th> */}
                {/* <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                  <input type="checkbox" />
                </th> */}
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Title{""}
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Priority
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>Impact</th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Ticket Status
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Created At
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}>
                  Last Updated At
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}></th>
              </tr>
            </MDBTableHead>
            {loading ? (
              <MDBTableBody className="bg-light">
                <tr>
                  <td>
                    <CircularLoading />
                  </td>
                </tr>
              </MDBTableBody>
            ) : (
              <MDBTableBody className="bg-light">
                {dataListTicketsAssign?.map((TicketAssign, index) => {
                  const ticketStatusOption = TicketStatusOptions.find(
                    (option) => option.id === TicketAssign.ticketStatus
                  );
                  return (
                    <tr key={index}>
                      {/* <td>{TicketAssign.id}</td> */}
                      {/* <td>
                        <input type="checkbox" />
                      </td> */}
                      <td
                        className="tooltip-cell"
                        title={`Id:${TicketAssign.id} \nDescription:${TicketAssign.description}`}
                      >
                        {TicketAssign.title.length > 20
                          ? `${TicketAssign.title.slice(0, 20)}...`
                          : TicketAssign.title}
                      </td>
                      <td>{getPriorityOption(TicketAssign.priority)}</td>
                      <td>{getImpactById(TicketAssign.impact)}</td>
                      <td>
                        {
                          <span
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={handleDropdownClick}
                            style={ticketStatusOption.badgeStyle}
                          >
                            {isDropdownVisible ? (
                              <select
                                value={TicketAssign.ticketStatus}
                                onChange={(e) =>
                                  handleTicketStatusChange(
                                    TicketAssign.id,
                                    parseInt(e.target.value)
                                  )
                                }
                                onBlur={() => setDropdownVisible(false)}
                              >
                                {TicketStatusOptions?.map((option) => (
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
                      <td>{formatDate(TicketAssign.createdAt)}</td>
                      <td>{formatDate(TicketAssign.modifiedAt)}</td>
                      <td>
                        <ViewCompact
                          onClick={() =>
                            handleOpenDetailTicketAssign(TicketAssign.id)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            )}
          </MDBTable>

          {dataListTicketsAssign.length === 0 && !loading && (
            <Card style={{ height: "450px", width: "100%" }}>
              <CardContent style={{ marginRight: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "10px",
                  }}
                >
                  <img
                    src={CloseTicket}
                    alt="No Solutions"
                    style={{ maxWidth: "350px", maxHeight: "300px" }}
                  />
                  <p
                    style={{
                      marginTop: "2px",
                      fontSize: "16px",
                      color: "#666",
                    }}
                  >
                    No Ticket Assign Available
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </MDBContainer>
      <Box display="flex" justifyContent="center" my={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>
    </>
  );
};

export default TicketAssignAvailableList;
