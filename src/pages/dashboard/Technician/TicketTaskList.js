import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketCustomer.css";
import PageSizeSelector from "../Pagination/Pagination";
import {
  ArrowBack,
  ContentCopy,
  Delete,
  Info,
  Square,
  ViewCompact,
} from "@mui/icons-material";
import { formatDate } from "../../helpers/FormatDate";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";
import { Box, FormControl, MenuItem, Pagination, Select } from "@mui/material";
import { FaPlus, FaSearch } from "react-icons/fa";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import {
  deleteTicketTask,
  getAllTicketTasks,
} from "../../../app/api/ticketTask";
import {
  TicketStatusOptions,
  getPriorityOption,
} from "../../helpers/tableComlumn";
import CircularLoading from "../../../components/iconify/CircularLoading";
import { toast } from "react-toastify";

const TicketTaskList = () => {
  const [dataListTicketsTask, setDataListTicketsTask] = useState([]);
  const [selectedtaskIds, setSelectedTaskIds] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("title");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const fetchDataListTicketTask = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      setLoading(true);
      const response = await getAllTicketTasks(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection,
        ticketId
      );
      setDataListTicketsTask(response);
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
    ticketId,
  ]);

  const handleSelectTask = (taskId) => {
    if (selectedtaskIds.includes(taskId)) {
      setSelectedTaskIds(selectedtaskIds.filter((id) => id !== taskId));
    } else {
      setSelectedTaskIds([...selectedtaskIds, taskId]);
    }
  };

  const handleSelectAllTasks = () => {
    if (selectedtaskIds.length === dataListTicketsTask.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(dataListTicketsTask.map((task) => task.id));
    }
  };

  const handleDeleteSelectedTasks = (id) => {
    try {
      if (selectedtaskIds.length === 0) {
        return;
      }

      let currentIndex = 0;

      const deleteNexttask = () => {
        if (currentIndex < selectedtaskIds.length) {
          const taskId = selectedtaskIds[currentIndex];

          deleteTicketTask(taskId)
            .then(() => {
              currentIndex++;
              deleteNexttask();
            })
            .catch((error) => {
              console.error(`Error deleting task with ID ${taskId}: `, error);
              toast.error(`Error deleting task with ID ${taskId}: `, error);
            });
        } else {
          setSelectedTaskIds([]);
          toast.success("Selected tasks deleted successfully");
          setRefreshData((prev) => !prev);
        }
      };

      deleteNexttask();
    } catch (error) {
      console.error("Failed to delete selected tasks: ", error);
      toast.error("Failed to delete selected tasks, Please try again later");
    }
  };

  const handleOpenCreateTask = (ticketId) => {
    navigate(`/home/createTask/${ticketId}`);
  };

  const handleOpenDetailTicketTask = (ticketId) => {
    navigate(`/home/editTask/${ticketId}`);
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

  const handleGoBack = () => {
    navigate(`/home/homeTechnician`);
  };

  useEffect(() => {
    fetchDataListTicketTask();
    setTotalPages(4);
  }, [fetchDataListTicketTask, refreshData]);

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBNavbar expand="lg" style={{ backgroundColor: "#fff" }}>
        <MDBContainer fluid>
          <MDBCol md="12">
            <MDBRow className="border-box">
              <MDBCol md="8" className="mt-2">
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-link icon-label">
                    <ArrowBack
                      onClick={() => handleGoBack()}
                      className="arrow-back-icon"
                    />
                  </button>

                  <div
                    style={{
                      marginLeft: "40px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "30px",
                        fontWeight: "bold",
                        marginRight: "10px",
                      }}
                    >
                      Task List
                    </h2>
                    <span style={{ fontSize: "18px", color: "#888" }}>
                      The list of available task for assistance.
                    </span>
                  </div>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBContainer>
      </MDBNavbar>
      <MDBContainer className="py-5 custom-container">
        {dataListTicketsTask.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Info /> No available task.{" "}
            <span
              onClick={() => handleOpenCreateTask(ticketId)}
              className="blueLink"
            >
              Create new task
            </span>{" "}
            or <span>Add task from template</span>
          </div>
        ) : (
          <>
            <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
              <MDBContainer fluid style={{ color: "#FFFFFF" }}>
                <MDBNavbarBrand
                  style={{ fontWeight: "bold", fontSize: "24px" }}
                >
                  <ContentCopy
                    style={{ marginRight: "20px", color: "#FFFFFF" }}
                  />{" "}
                  <span style={{ color: "#FFFFFF" }}>All Tasks</span>
                </MDBNavbarBrand>
                <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
                  <MDBBtn
                    color="#eee"
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#FFFFFF",
                    }}
                    onClick={() => handleOpenCreateTask(ticketId)}
                  >
                    <FaPlus /> Create
                  </MDBBtn>
                  <MDBBtn
                    color="#eee"
                    style={{
                      fontWeight: "bold",
                      fontSize: "20px",
                      color: "#FFFFFF",
                    }}
                    onClick={() => handleDeleteSelectedTasks()}
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
                      style={{ color: "white" }}
                    >
                      <MenuItem value="id">ID</MenuItem>
                      <MenuItem value="title">Title</MenuItem>
                      <MenuItem value="description">description</MenuItem>
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
                          fetchDataListTicketTask();
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
                    <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                      <input
                        type="checkbox"
                        checked={
                          selectedtaskIds.length === dataListTicketsTask.length
                        }
                        onChange={handleSelectAllTasks}
                      />
                    </th>
                    <th
                      style={{ fontWeight: "bold", fontSize: "18px" }}
                      onClick={() => handleSortChange("title")}
                    >
                      Title
                    </th>
                    <th
                      style={{ fontWeight: "bold", fontSize: "18px" }}
                      onClick={() => handleSortChange("keyword")}
                    >
                      Status
                    </th>
                    {/* <th
                      style={{ fontWeight: "bold", fontSize: "18px" }}
                      onClick={() => handleSortChange("isApproved")}
                    >
                      Team
                    </th> */}
                    <th
                      style={{ fontWeight: "bold", fontSize: "18px" }}
                      onClick={() => handleSortChange("priority")}
                    >
                      Priority
                    </th>
                    <th
                      style={{ fontWeight: "bold", fontSize: "18px" }}
                      onClick={() => handleSortChange("scheduledStartTime")}
                    >
                      Start time
                    </th>
                    <th
                      style={{ fontWeight: "bold", fontSize: "18px" }}
                      onClick={() => handleSortChange("scheduledEndTime")}
                    >
                      End time
                    </th>
                    <th
                      style={{ fontWeight: "bold", fontSize: "18px" }}
                      onClick={() => handleSortChange("progress")}
                    >
                      Progress
                    </th>
                    <th style={{ fontWeight: "bold", fontSize: "18px" }}></th>
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
                    {dataListTicketsTask.map((TicketTask, index) => {
                      const isSelected = selectedtaskIds.includes(
                        TicketTask.id
                      );
                      const ticketStatusOption = TicketStatusOptions.find(
                        (option) => option.id === TicketTask.taskStatus
                      );

                      return (
                        <tr key={index}>
                          {/* <td>{TicketTask.id}</td> */}
                          <td>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectTask(TicketTask.id)}
                            />
                          </td>
                          <td>{TicketTask.title}</td>
                          <td>
                            {ticketStatusOption ? (
                              <span style={ticketStatusOption.badgeStyle}>
                                {ticketStatusOption.icon}
                                {ticketStatusOption.name}
                              </span>
                            ) : (
                              "Unknown Status"
                            )}
                          </td>
                          {/* <td>
                            {TicketTask.isApproved ? (
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
                          </td> */}
                          <td>{getPriorityOption(TicketTask.priority)}</td>
                          <td>{formatDate(TicketTask.scheduledStartTime)}</td>
                          <td>{formatDate(TicketTask.scheduledEndTime)}</td>
                          <td>
                            <div
                              style={{
                                width: "100%",
                                backgroundColor: "#e0e0df",
                                borderRadius: "5px",
                                padding: "2px",
                              }}
                            >
                              <div
                                style={{
                                  width: `${TicketTask.progress}%`,
                                  height: "100%",
                                  backgroundColor: "#3399FF",
                                  borderRadius: "5px",
                                  textAlign: "center",
                                  color: "white",
                                }}
                              >
                                {TicketTask.progress}%
                              </div>
                            </div>
                          </td>
                          <td>
                            <ViewCompact
                              onClick={() =>
                                handleOpenDetailTicketTask(TicketTask.id)
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </MDBTableBody>
                )}
              </MDBTable>
            </div>
          </>
        )}
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
          />
        </Box>
      </MDBContainer>
    </section>
  );
};

export default TicketTaskList;
