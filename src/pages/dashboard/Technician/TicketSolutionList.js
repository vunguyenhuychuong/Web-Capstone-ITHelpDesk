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
import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketCustomer.css";
import PageSizeSelector from "../Pagination/Pagination";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  DeleteForever,
  Square,
  ViewCompact,
} from "@mui/icons-material";
import { formatDate } from "../../helpers/FormatDate";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tooltip,
} from "@mui/material";
import { FaPlus, FaSearch } from "react-icons/fa";
import {
  deleteTicketSolution,
  getAllTicketSolutions,
} from "../../../app/api/ticketSolution";
import { toast } from "react-toastify";

import CloseTicket from "../../../assets/images/NoTicketSolution.jpg";
import CircularLoading from "../../../components/iconify/CircularLoading";
import { useSelector } from "react-redux";

const TicketSolutionList = () => {
  const [dataListTicketsSolution, setDataListTicketsSolution] = useState([]);
  const [selectedSolutionIds, setSelectedSolutionIds] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const user = useSelector((state) => state.auth);
  const userRole = user.user.role;
  const navigate = useNavigate();
  const fetchDataListTicketSolution = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      setLoading(true);
      const response = await getAllTicketSolutions(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataListTicketsSolution(response?.data);
      setTotalPages(response?.totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

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
        dataListTicketsSolution?.map((solution) => solution.id)
      );
    }
  };

  const handleDeleteSelectedSolutions = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure want to delete selected solutions"
    );
    if (shouldDelete) {
      try {
        if (selectedSolutionIds.length === 0) {
          return;
        }

        let currentIndex = 0;

        const deleteNextSolution = () => {
          if (currentIndex < selectedSolutionIds.length) {
            const solutionId = selectedSolutionIds[currentIndex];

            deleteTicketSolution(solutionId)
              .then(() => {
                console.log(
                  `Solution with ID ${solutionId} deleted successfully`
                );
                currentIndex++;
                deleteNextSolution();
              })
              .catch((error) => {
                console.error(
                  `Error deleting solution with ID ${solutionId}: `,
                  error
                );
                toast.error(
                  `Error deleting solution with ID ${solutionId}: `,
                  error
                );
              });
          } else {
            setSelectedSolutionIds([]);
            toast.success("Selected solutions deleted successfully");
            setRefreshData((prev) => !prev);
          }
        };

        deleteNextSolution();
      } catch (error) {
        console.error("Failed to delete selected solutions: ", error);
        toast.error(
          "Failed to delete selected solutions, Please try again later"
        );
      }
    }
  };

  const handleOpenCreateTicketSolution = () => {
    navigate("/home/createSolution");
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
  }, [fetchDataListTicketSolution, refreshData]);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid style={{ color: "#FFFFFF" }}>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />
              <span style={{ color: "#FFFFFF" }}>All Solutions</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
              {userRole === 1 ? null : (
                <>
                  <MDBBtn
                    color="#eee"
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#FFFFFF",
                    }}
                    onClick={() => handleOpenCreateTicketSolution()}
                  >
                    <FaPlus style={{ color: "#FFFFFF" }} />{" "}
                    <span style={{ color: "#FFFFFF" }}>New</span>
                  </MDBBtn>
                  {userRole === 3 ? null : (
                    <MDBBtn
                      color="#eee"
                      style={{
                        fontWeight: "bold",
                        fontSize: "20px",
                        color: "#FFFFFF",
                      }}
                      onClick={() => handleDeleteSelectedSolutions()}
                    >
                      <DeleteForever style={{ color: "#FFFFFF" }} />{" "}
                      <span style={{ color: "#FFFFFF" }}>Delete</span>
                    </MDBBtn>
                  )}
                </>
              )}
              <FormControl
                variant="outlined"
                style={{
                  minWidth: 120,
                  margin: 10,
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
                  style={{ color: "white", height: "100%" }}
                >
                  <MenuItem value="title">Title</MenuItem>
                  <MenuItem value="keyword">Keyword</MenuItem>
                  <MenuItem value="isApproved">Status</MenuItem>
                </Select>
              </FormControl>
              <div className="input-wrapper">
                <FaSearch id="search-icon" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
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
              />
            </MDBNavbarNav>
          </MDBContainer>
        </MDBNavbar>
        <div>
          <MDBTable className="align-middle mb-0" responsive>
            <MDBTableHead className="bg-light">
              <tr>
                {userRole === 2 && (
                  <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedSolutionIds?.length ===
                        dataListTicketsSolution?.length
                      }
                      onChange={handleSelectAllSolutions}
                    />
                  </th>
                )}
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("title")}
                >
                  Title{""}
                  {sortBy === "title" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("keyword")}
                >
                  Keyword
                  {sortBy === "keyword" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("isApproved")}
                >
                  Status
                  {sortBy === "isApproved" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("reviewDate")}
                >
                  Review Date
                  {sortBy === "reviewDate" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("createdAt")}
                >
                  Created
                  {sortBy === "createdAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("modifiedAt")}
                  className="sortable-header"
                >
                  Last Update
                  {sortBy === "modifiedAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
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
                {dataListTicketsSolution?.map((TicketSolution, index) => {
                  const isSelected = selectedSolutionIds.includes(
                    TicketSolution.id
                  );
                  return (
                    <tr key={index}>
                      {/* <td>{TicketSolution.id}</td> */}
                      {userRole === 2 && (
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              handleSelectSolution(TicketSolution.id)
                            }
                          />
                        </td>
                      )}

                      <td
                        className="tooltip-cell text-truncate"
                        style={{ maxWidth: 250 }}
                        title={`Id:${TicketSolution.id} \n💡:${TicketSolution.title}\nContent:${TicketSolution.content}`}
                      >
                        {TicketSolution.title}
                      </td>
                      <td
                        className="tooltip-cell text-truncate"
                        style={{ maxWidth: 250 }}
                        title={`Keyword:${TicketSolution.keyword}`}
                      >
                        {TicketSolution.keyword}
                      </td>
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
                      {/* <td>
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
                      </td> */}
                      <td>{formatDate(TicketSolution.reviewDate)}</td>
                      <td>{formatDate(TicketSolution.createdAt)}</td>
                      <td>{formatDate(TicketSolution.modifiedAt)}</td>
                      <td>
                        <Tooltip title="View detail" arrow>
                          <ViewCompact
                            onClick={() =>
                              handleOpenDetailTicketSolution(TicketSolution.id)
                            }
                          />
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            )}
          </MDBTable>

          {dataListTicketsSolution.length === 0 && !loading && (
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
                    No Ticket Solutions Available
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
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

export default TicketSolutionList;
