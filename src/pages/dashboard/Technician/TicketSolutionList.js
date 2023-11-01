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

import {
  ContentCopy,
  PlaylistAdd,
  Search,
  Settings,
  ViewCompact,
} from "@mui/icons-material";
import { formatDate } from "../../helpers/FormatDate";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Box } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import {
  deleteTicketSolution,
  getAllTicketSolutions,
} from "../../../app/api/ticketSolution";
import { toast } from "react-toastify";

const TicketSolutionList = () => {
  const [dataListTicketsSolution, setDataListTicketsSolution] = useState([]);
  const [selectedSolutionIds, setSelectedSolutionIds] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(10);
  // const [totalPages, setTotalPages] = useState(1);
  // const [searchField, setSearchField] = useState("title");
  // const [searchQuery, setSearchQuery] = useState("");
  // const navigate = useNavigate();
  const navigate = useNavigate();

  const fetchDataListTicketSolution = useCallback(async () => {
    try {
      const response = await getAllTicketSolutions();
      setDataListTicketsSolution(response);
    } catch (error) {
      console.log(error);
    }
  }, []);

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

  const handleDeleteSelectedSolutions = (id) => {
    try {
      console.log("Deleting selected solutions...");
  
      if (selectedSolutionIds.length === 0) {
        console.log("No selected solutions to delete.");
        return;
      }
  
      let currentIndex = 0;
  
      const deleteNextSolution = () => {
        if (currentIndex < selectedSolutionIds.length) {
          const solutionId = selectedSolutionIds[currentIndex];
  
          deleteTicketSolution(solutionId)
            .then(() => {
              console.log(`Solution with ID ${solutionId} deleted successfully`);
              currentIndex++;
              deleteNextSolution();
            })
            .catch((error) => {
              console.error(`Error deleting solution with ID ${solutionId}: `, error);
              toast.error(`Error deleting solution with ID ${solutionId}: `, error);
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
      toast.error("Failed to delete selected solutions, Please try again later");
    }
  }

  const handleOpenCreateTicketSolution = () => {
    navigate("/home/createSolution");
  };

  const handleOpenDetailTicketSolution = (solutionId) => {
    navigate(`/home/detailSolution/${solutionId}`);
  };

  // const handleOpenListTicketSolution = () => {
  //   navigate('/home/ticketSolution');
  // };

  // const handleChangePage = (event, value) => {
  //   setCurrentPage(value);
  // };

  // const handleChangePageSize = (event) => {
  //   const newSize = parseInt(event.target.value);
  //   setPageSize(newSize);
  //   setCurrentPage(1);
  // };

  // const fetchCategoriesList = async () => {
  //   try {
  //     const fetchCategories = await CategoryApi.getAllCategories();
  //     setDataCategories(fetchCategories);
  //   } catch (error) {
  //     console.log("Error while fetching data", error);
  //   }
  // };

  // const handleOpenDialog = (ticketId) => {
  //   navigate(`/home/ticketService/${ticketId}`);
  // };

  // const getCategoryName = (categoryId) => {
  //   const category = dataCategories.find((cat) => cat.id === categoryId);
  //   return category ? category.name : "Unknown Category";
  // };

  // const getStatusName = (statusId) => {
  //   const statusOption = TicketStatusOptions.find(
  //     (option) => option.id === statusId
  //   );
  //   return statusOption ? statusOption.name : "Unknown Status";
  // };

  useEffect(() => {
    fetchDataListTicketSolution();
    // setTotalPages(4);
  }, [fetchDataListTicketSolution, refreshData]);

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" light bgColor="inherit">
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px" }} /> All Ticket
              Solutions
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                onClick={() => handleOpenCreateTicketSolution()}
              >
                <FaPlus /> New Solution
              </MDBBtn>
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                onClick={() => handleDeleteSelectedSolutions()}
              >
                Delete
              </MDBBtn>
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                // onClick={handleOpenRequestTicket}
              >
                <Settings /> Solution Settings
              </MDBBtn>
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                // onClick={handleOpenRequestTicket}
              >
                <Search /> <PlaylistAdd />
              </MDBBtn>
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
                </FormControl> */}
              {/* <div className="input-wrapper">
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
                </div> */}
              {/* <PageSizeSelector
                  pageSize={pageSize}
                  handleChangePageSize={handleChangePageSize}
                /> */}
            </MDBNavbarNav>
          </MDBContainer>
        </MDBNavbar>
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
              <th style={{ fontWeight: "bold", fontSize: "18px" }}></th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>Title</th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>Keyword</th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>Status</th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                Visibility
              </th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                Review Date
              </th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                Create On
              </th>
              <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                LastUpdate On
              </th>
            </tr>
          </MDBTableHead>
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
                      onChange={() => handleSelectSolution(TicketSolution.id)}
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
                  <td>{TicketSolution.keyword}</td>
                  <td>
                    {TicketSolution.isApproved ? "Approved" : "Not Approved"}
                  </td>
                  <td>{TicketSolution.isPublic ? "Public" : "Not Public"}</td>
                  <td>{formatDate(TicketSolution.reviewDate)}</td>
                  <td>
                    {TicketSolution.createdAt
                      ? new Date(TicketSolution.createdAt).toLocaleDateString()
                      : ""}
                  </td>
                  <td>{formatDate(TicketSolution.modifiedAt)}</td>
                </tr>
              );
            })}
          </MDBTableBody>
        </MDBTable>
      </MDBContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        {/* <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        /> */}
      </Box>
    </section>
  );
};

export default TicketSolutionList;
