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
  ContentCopy,
  Delete,
  ViewCompact,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import {
  Box,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { FaPlus, FaSearch } from "react-icons/fa";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import {
  deleteCompany,
  getAllCompany,
  getCompanyById,
} from "../../../app/api/company";
import { toast } from "react-toastify";
import { formatDate } from "../../helpers/FormatDate";
import { truncateUrl } from "../../helpers/FormatText";
import CircularLoading from "../../../components/iconify/CircularLoading";

const CompanyList = () => {
  const [dataListCompany, setDataListCompany] = useState([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("companyName");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const navigate = useNavigate();

  const [data, setData] = useState({
    companyName: "",
    taxCode: "",
    phoneNumber: "",
    email: "",
    website: "",
    companyAddress: "",
    logoUrl: "",
    fieldOfBusiness: "",
    isActive: true,
    customerAdminId: null,
  });

  const fetchDataListTicketTask = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `companyName="${encodeURIComponent(searchQuery)}"`;
      }
      setLoading(true);
      const response = await getAllCompany(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      const companies = response?.data.map((company) => {
        const newCompany = {
          ...company,
          phoneNumber: { value: company.phoneNumber, isVisible: false },
        };
        return newCompany;
      });
      setDataListCompany(companies);
      setTotalPages(response?.totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  const handleSelectCompany = (companyId) => {
    if (selectedCompanyIds.includes(companyId)) {
      setSelectedCompanyIds(
        selectedCompanyIds.filter((id) => id !== companyId)
      );
    } else {
      setSelectedCompanyIds([...selectedCompanyIds, companyId]);
    }
  };

  const handleSelectAllCompany = () => {
    if (selectedCompanyIds.length === dataListCompany.length) {
      setSelectedCompanyIds([]);
    } else {
      setSelectedCompanyIds(dataListCompany?.map((company) => company.id));
    }
  };

  const handleDeleteSelectedCompany = (id) => {
    const shouldDelete = window.confirm(
      "Are you sure want to delete selected company"
    );
    if (shouldDelete) {
      try {
        console.log("Deleting selected companies...");

        if (selectedCompanyIds.length === 0) {
          console.log("No selected companies to delete.");
          return;
        }

        let currentIndex = 0;

        const deleteNextSolution = () => {
          if (currentIndex < selectedCompanyIds.length) {
            const companyId = selectedCompanyIds[currentIndex];

            deleteCompany(companyId)
              .then(() => {
                console.log(
                  `Solution with ID ${companyId} deleted successfully`
                );
                currentIndex++;
                deleteNextSolution();
              })
              .catch((error) => {
                console.error(
                  `Error deleting company with ID ${companyId}: `,
                  error
                );
                toast.error(
                  `Error deleting company with ID ${companyId}: `,
                  error
                );
              });
          } else {
            setSelectedCompanyIds([]);
            toast.success("Selected companies deleted successfully");
            setRefreshData((prev) => !prev);
          }
        };

        deleteNextSolution();
      } catch (error) {
        console.error("Failed to delete selected companies: ", error);
        toast.error(
          "Failed to delete selected companies, Please try again later"
        );
      }
    }
  };

  const handleOpenCreateCompany = () => {
    navigate(`/home/createCompany`);
  };

  const handleOpenCompanyDetail = async (companyId) => {
    navigate(`/home/companyDetail/${companyId}`);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleChangeIsVisiblePhone = (phoneNumber) => {
    var newCompanyList = [...dataListCompany];
    const index = dataListCompany.findIndex(
      (company) => company.phoneNumber === phoneNumber
    );
    if (index > -1) {
      newCompanyList[index].phoneNumber = {
        ...newCompanyList[index].phoneNumber,
        isVisible: !newCompanyList[index].phoneNumber.isVisible,
      };
    }
    setDataListCompany(newCompanyList);
  };

  //   const handleSortChange = (field) => {
  //     if (sortBy === field) {
  //       setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  //     } else {
  //       setSortBy(field);
  //       setSortDirection("asc");
  //     }
  //   };

  const maxLength = 30;

  useEffect(() => {
    fetchDataListTicketTask();
  }, [fetchDataListTicketTask, refreshData]);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All Companies</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                onClick={() => handleOpenCreateCompany()}
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
                onClick={() => handleDeleteSelectedCompany()}
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
                  <MenuItem value="companyName">Company Name</MenuItem>
                  <MenuItem value="phoneNumber">Phone Number</MenuItem>
                  <MenuItem value="taxCode">Tax Code</MenuItem>
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
                      selectedCompanyIds.length === dataListCompany.length
                    }
                    onChange={handleSelectAllCompany}
                  />
                </th>

                <th
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                  // onClick={() => handleSortChange("title")}
                >
                  Logo
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                  // onClick={() => handleSortChange("keyword")}
                >
                  Company Name
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                  // onClick={() => handleSortChange("isApproved")}
                >
                  Tax Code
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                  // onClick={() => handleSortChange("isApproved")}
                >
                  Phone Number
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "18px" }}
                  // onClick={() => handleSortChange("isPublic")}
                >
                  Website
                </th>
                <th style={{ fontWeight: "bold", fontSize: "18px" }}>Status</th>
                <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                  Created
                </th>
                <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                  Modified
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
                {dataListCompany?.map((company, index) => {
                  const isSelected = selectedCompanyIds.includes(company.id);
                  return (
                    <tr key={index}>
                      {/* <td>{company.id}</td> */}
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectCompany(company.id)}
                        />
                      </td>

                      <td>
                        <img
                          src={
                            company.logoUrl ??
                            "https://cdn-icons-png.flaticon.com/512/1630/1630842.png"
                          }
                          alt="Company Logo"
                          style={{ width: 50, height: "auto" }}
                        />
                      </td>
                      <td>{company.companyName}</td>
                      <td>{company.taxCode}</td>
                      <td>
                        <Stack
                          direction={"row"}
                          spacing={1}
                          alignItems={"center"}
                        >
                          <Typography minWidth={"5vw"}>
                            {!company.phoneNumber.isVisible
                              ? "*******".concat(
                                  company.phoneNumber.value.substring(
                                    company.phoneNumber.value.length - 3
                                  )
                                )
                              : company.phoneNumber.value}
                          </Typography>
                          <IconButton
                            onClick={() =>
                              handleChangeIsVisiblePhone(company.phoneNumber)
                            }
                          >
                            {company.phoneNumber.isVisible ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </Stack>
                      </td>
                      <td>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-toggle="tooltip"
                            data-placement="top"
                            title={company.website}
                          >
                            {truncateUrl(company.website, maxLength)}
                          </a>
                        )}
                      </td>
                      <td>
                        {company.isActive ? (
                          <span className="badge bg-success rounded-pill">
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-danger rounded-pill">
                            Not Active
                          </span>
                        )}
                      </td>
                      <td>{formatDate(company.createdAt || "-")}</td>
                      <td>{formatDate(company.deletedAt || "-")}</td>
                      <td>
                        <ViewCompact
                          onClick={() => handleOpenCompanyDetail(company.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            )}
          </MDBTable>
        </div>

        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
          />
        </Box>
      </MDBContainer>
    </>
  );
};

export default CompanyList;
