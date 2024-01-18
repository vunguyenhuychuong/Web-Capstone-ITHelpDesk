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
import PageSizeSelector from "../../Pagination/Pagination";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  DeleteForever,
  ViewCompact,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import {
  Box,
  Chip,
  FormControl,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { FaPlus, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  getContractCompany,
  getContractCompanyByCompanyId,
} from "../../../../app/api/contract";
import CircularLoading from "../../../../components/iconify/CircularLoading";
import { getStatusContract } from "../../../helpers/tableComlumn";
import { formatDate } from "../../../helpers/FormatDate";
import { useSelector } from "react-redux";

const CompanyContractList = () => {
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
  const [sortBy, setSortBy] = useState("name");
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchDataListContract = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getContractCompany();
      setDataListContract(response?.data);
      setTotalPages(response?.totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

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
    if (selectedContractIds?.length === dataListContract?.length) {
      setSelectedContractIds([]);
    } else {
      setSelectedContractIds(dataListContract.map((solution) => solution.id));
    }
  };

  const handleOpenCreateTicketSolution = () => {
    navigate("/home/createContract");
  };

  const handleOpenDetailContract = (contractId) => {
    navigate(`/home/detailCompanyContract/${contractId}`);
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
  }, [fetchDataListContract, refreshData]);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All Company Contracts</span>
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
                <Select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  inputProps={{
                    name: "searchField",
                    id: "search-field",
                  }}
                  style={{ color: "white" }}
                >
                  {/* <MenuItem value="id">ID</MenuItem> */}
                  <MenuItem value="name">Name</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  {/* <MenuItem value="value">Value</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="startDate">StartDate</MenuItem> */}
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
                    className="sortable-header"
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
                      selectedContractIds?.length === dataListContract?.length
                    }
                    onChange={handleSelectAllSolutions}
                  />
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("name")}
                  className="sortable-header"
                >
                  Name
                  {sortBy === "name" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                {/* <th
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
                  </th> */}
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("value")}
                  className="sortable-header"
                >
                  Status
                  {sortBy === "value" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                {/* <th
                    style={{ fontWeight: "bold", fontSize: "14px" }}
                    onClick={() => handleSortChange("status")}
                    className="sortable-header"
                  >
                    Visible
                    {sortBy === "status" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </th> */}
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("startDate")}
                  className="sortable-header"
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
                  className="sortable-header"
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
                  className="sortable-header"
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
                      <td
                        className="tooltip-cell"
                        title={`Name Contract: ${Contract.name}\nDescription: ${Contract.description}`}
                        onClick={() => handleOpenDetailContract(Contract.id)}
                      >
                        {Contract.name}
                      </td>
                      <td>
                        <Chip
                          label={getStatusContract(Contract.status)?.name}
                          sx={{
                            color: "white",
                            backgroundColor: getStatusContract(Contract.status)
                              ?.color,
                          }}
                        />
                      </td>
                      {/* <td>
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
                        </td> */}
                      <td>{formatDate(Contract.startDate)}</td>
                      <td>{formatDate(Contract.endDate)}</td>
                      <td>{formatDate(Contract.createdAt)}</td>
                      <td>{formatDate(Contract.modifiedAt)}</td>
                      <td>
                        <ViewCompact
                          onClick={() => handleOpenDetailContract(Contract.id)}
                        />
                      </td>
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

export default CompanyContractList;
