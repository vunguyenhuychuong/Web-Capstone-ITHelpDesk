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
  Lock,
  LockOpen,
  Square,
  ViewCompact,
} from "@mui/icons-material";
import { formatDate } from "../../helpers/FormatDate";
import { useNavigate } from "react-router-dom";
import { Box, FormControl, MenuItem, Pagination, Select } from "@mui/material";
import { FaPlus, FaSearch } from "react-icons/fa";
import { deleteTicketSolution } from "../../../app/api/ticketSolution";
import { toast } from "react-toastify";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import { getContractAccountant } from "../../../app/api/contract";
import CircularLoading from "../../../components/iconify/CircularLoading";

const ContractListAcountant = () => {
  const [dataListContract, setDataListContract] = useState([]);
  const [selectedContractIds, setSelectedContractIds] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const navigate = useNavigate();

  const fetchDataListContract = async () => {
    try {
      setLoading(true);
      const response = await getContractAccountant();
      setDataListContract(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSolution = (contractId) => {
    if (selectedContractIds.includes(contractId)) {
      setSelectedContractIds(
        selectedContractIds.filter((id) => id !== contractId)
      );
    } else {
      setSelectedContractIds([...selectedContractIds, contractId]);
    }
  };

  const handleSelectAllSolutions = () => {
    if (selectedContractIds.length === dataListContract.length) {
      setSelectedContractIds([]);
    } else {
      setSelectedContractIds(dataListContract.map((solution) => solution.id));
    }
  };

  const handleDeleteSelectedSolutions = (id) => {
    try {
      console.log("Deleting selected solutions...");

      if (selectedContractIds.length === 0) {
        console.log("No selected solutions to delete.");
        return;
      }

      let currentIndex = 0;

      const deleteNextSolution = () => {
        if (currentIndex < selectedContractIds.length) {
          const contractId = selectedContractIds[currentIndex];

          deleteTicketSolution(contractId)
            .then(() => {
              console.log(
                `Solution with ID ${contractId} deleted successfully`
              );
              currentIndex++;
              deleteNextSolution();
            })
            .catch((error) => {
              console.error(
                `Error deleting solution with ID ${contractId}: `,
                error
              );
              toast.error(
                `Error deleting solution with ID ${contractId}: `,
                error
              );
            });
        } else {
          setSelectedContractIds([]);
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
  };

  const handleOpenCreateTicketSolution = () => {
    navigate("/home/createContract");
  };

  const handleOpenDetailContract = (contractId) => {
    navigate(`/home/detailContract/${contractId}`);
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
    fetchDataListContract();
    setTotalPages(4);
  }, [refreshData]);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All Contracts Accountant</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#FFFFFF",
                }}
                onClick={() => handleOpenCreateTicketSolution()}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#FFFFFF",
                }}
                onClick={() => handleDeleteSelectedSolutions()}
              >
                <DeleteForever /> Delete
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
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  <MenuItem value="value">Value</MenuItem>
                  <MenuItem value="status">Status</MenuItem>
                  <MenuItem value="startDate">StartDate</MenuItem>
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
                      fetchDataListContract();
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
                {/* <th
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                  onClick={() => handleSortChange("id")}
                >
                  Id
                  {sortBy === "id" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th> */}
                <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedContractIds.length === dataListContract.length
                    }
                    onChange={handleSelectAllSolutions}
                  />
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}></th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("name")}
                >
                  Name
                  {sortBy === "name" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("description")}
                >
                  Description
                  {sortBy === "description" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("value")}
                >
                  Status
                  {sortBy === "value" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("status")}
                >
                  Visible
                  {sortBy === "status" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("startDate")}
                >
                  Start Date
                  {sortBy === "startDate" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("endDate")}
                >
                  End Date
                  {sortBy === "endDate" &&
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
                  Created At
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
                >
                  Last Update
                  {sortBy === "modifiedAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
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
                {dataListContract.map((Contract, index) => {
                  const isSelected = selectedContractIds.includes(Contract.id);
                  return (
                    <tr key={index}>
                      {/* <td>{Contract.id}</td> */}
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectSolution(Contract.id)}
                        />
                      </td>
                      <td>
                        <ViewCompact
                          onClick={() => handleOpenDetailContract(Contract.id)}
                        />{" "}
                      </td>
                      <td>{Contract.name}</td>
                      <td>{Contract.description}</td>
                      <td>
                        {Contract.isApproved ? (
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
                        {Contract.isPublic ? (
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
                      <td>{formatDate(Contract.startDate)}</td>
                      <td>{formatDate(Contract.endDate)}</td>
                      <td>{formatDate(Contract.createdAt)}</td>
                      <td>{formatDate(Contract.modifiedAt)}</td>
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

export default ContractListAcountant;
