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
import React, { useCallback, useState } from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  Delete,
  Edit,
} from "@mui/icons-material";
import { useEffect } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { FormControl, MenuItem, Pagination, Select } from "@mui/material";
import { toast } from "react-toastify";
import { formatDate } from "../../helpers/FormatDate";
import PageSizeSelector from "../Pagination/Pagination";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import {
  deleteCompanyMember,
  getAllMemberCompany,
} from "../../../app/api/companyMember";
import EditCompanyMember from "./EditCompanyMember";
import CircularLoading from "../../../components/iconify/CircularLoading";
import { getAuthHeader } from "../../../app/api/auth";

const CompanyMemberList = () => {
  const [dataCompanyMembers, setDataCompanyMembers] = useState([]);
  const [selectMode, setSelectTeam] = useState(null);
  const [selectedTeamMembers, setSelectedTeamMember] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("memberPosition");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompanyMemberId, setSelectedCompanyMemberId] = useState(null);
  const navigate = useNavigate();
  const header = getAuthHeader();

  const fetchAllCompanyMember = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }

      const response = await getAllMemberCompany(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataCompanyMembers(response?.data);
      setTotalPages(response?.totalPage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  const handleSelectCompanyMember = (memberId) => {
    if (selectedTeamMembers.includes(memberId)) {
      setSelectedTeamMember(
        selectedTeamMembers.filter((id) => id !== memberId)
      );
      console.log("many select", selectMode);
    } else {
      setSelectedTeamMember([...selectedTeamMembers, memberId]);
    }
  };

  const handleSelectAllCompanyMembers = () => {
    if (selectedTeamMembers?.length === dataCompanyMembers?.length) {
      setSelectedTeamMember([]);
    } else {
      setSelectedTeamMember(dataCompanyMembers?.map((mode) => mode.id));
    }
  };

  const handleSortChange = useCallback(
    (field) => {
      if (sortBy === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortBy(field);
        setSortDirection("asc");
      }
    },
    [sortBy, sortDirection]
  );

  const handleOpenEditCompanyMember = (companyMemberId) => {
    setSelectedCompanyMemberId(companyMemberId);
    setIsEditDialogOpen(true);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleReloadData = () => {
    fetchAllCompanyMember();
  };

  const handleDeleteSelectedCompanyMember = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure want to delete selected company members"
    );
    if (shouldDelete) {
      try {
        if (selectedTeamMembers.length === 0) {
          return;
        }
        const deletePromises = selectedTeamMembers.map(async (memberId) => {
          try {
            const res = await Promise.resolve(deleteCompanyMember(memberId));
            if (res.isError) {
              throw new Error(
                `Error deleting company member with ID ${memberId}: ${res.message}`
              );
            }
            return memberId;
          } catch (error) {
            throw new Error(
              `Error deleting company member with ID ${memberId}: ${error.message}`
            );
          }
        });

        const results = await Promise.allSettled(deletePromises);

        const successfulDeletes = [];
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            successfulDeletes.push(result.value);
          } else {
            toast.error(result.reason.message);
          }
        });
        const updateModes = dataCompanyMembers.filter(
          (mode) => !successfulDeletes.includes(mode.id)
        );
        setDataCompanyMembers(updateModes);
        setSelectTeam([]);
      } catch (error) {
        console.error(error);
        toast.error(
          "Failed to delete selected company members, Please try again later"
        );
      }
    }
  };

  const handleOpenCreateCompanyMember = () => {
    navigate("/home/createCompanyMember");
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAllCompanyMember();
  }, [fetchAllCompanyMember]);

  return (
    <>
      <MDBContainer
        className="py-5"
        style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
      >
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}> All Company Members</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                onClick={() => handleOpenCreateCompanyMember()}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                onClick={handleDeleteSelectedCompanyMember}
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
                  <MenuItem value="memberId">memberId</MenuItem>
                  <MenuItem value="memberPosition">memberPosition</MenuItem>
                  <MenuItem value="isCompanyAdmin">isCompanyAdmin</MenuItem>
                  <MenuItem value="id">id</MenuItem>
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
                      fetchAllCompanyMember();
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
        {isLoading ? (
          <MDBTableBody className="bg-light">
            <tr>
              <td>
                <CircularLoading />
              </td>
            </tr>
          </MDBTableBody>
        ) : (
          <>
            <MDBTable
              className="align-middle mb-0"
              responsive
              style={{ border: "0.05px solid #50545c" }}
            >
              <MDBTableHead className="bg-light">
                <tr style={{ fontSize: "1.2rem" }}>
                  <th style={{ fontWeight: "bold" }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedTeamMembers?.length ===
                        dataCompanyMembers?.length
                      }
                      onChange={handleSelectAllCompanyMembers}
                    />
                  </th>

                  {/* <th
                    style={{ fontWeight: "bold" }}
                    className="sortable-header"
                    onClick={() => handleSortChange("memberId")}
                    title="Click to Sort by MemberID"
                  >
                    Member ID
                    {sortBy === "memberId" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </th> */}
                  <th
                    style={{ fontWeight: "bold" }}
                    className="sortable-header"
                  >
                    Name Member
                  </th>
                  <th
                    style={{ fontWeight: "bold" }}
                    className="sortable-header"
                    onClick={() => handleSortChange("memberPosition")}
                    title="Click to Sort by Member Position"
                  >
                    Member Position
                    {sortBy === "memberPosition" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </th>
                  <th
                    style={{ fontWeight: "bold" }}
                    className="sortable-header"
                    onClick={() => handleSortChange("isCompanyAdmin")}
                    title="Click to Sort by CompanyAdmin"
                  >
                    Role
                    {sortBy === "isCompanyAdmin" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </th>
                  <th
                    style={{ fontWeight: "bold" }}
                    className="sortable-header"
                    onClick={() => handleSortChange("createdAt")}
                    title="Click to Sort by CreatedAt"
                  >
                    Create Time
                    {sortBy === "createdAt" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </th>
                  <th
                    style={{ fontWeight: "bold" }}
                    className="sortable-header"
                    onClick={() => handleSortChange("modifiedAt")}
                    title="Click to Sort by ModifiedAt"
                  >
                    Modify Time
                    {sortBy === "modifiedAt" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </th>
                  <th style={{ fontWeight: "bold" }}>Edit</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody className="bg-light">
                {dataCompanyMembers?.map((companyMember, index) => {
                  const isSelected = selectedTeamMembers.includes(
                    companyMember.id
                  );
                  return (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            handleSelectCompanyMember(companyMember.id)
                          }
                        />
                      </td>

                      {/* <td>{companyMember.memberId}</td> */}
                      <td>
                        {companyMember.member.lastName}{" "}
                        {companyMember.member.firstName}
                      </td>
                      <td>{companyMember.memberPosition}</td>
                      <td>
                        {companyMember.isCompanyAdmin
                          ? "Admin Customer"
                          : "Customer"}
                      </td>
                      <td>{formatDate(companyMember.createdAt || "-")}</td>
                      <td>{formatDate(companyMember.modifiedAt || "-")}</td>
                      <td>
                        <Edit
                          onClick={() =>
                            handleOpenEditCompanyMember(companyMember.id)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </MDBTableBody>
              <MDBTableBody className="bg-light"></MDBTableBody>
            </MDBTable>
          </>
        )}
      </MDBContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>

      {isEditDialogOpen && (
        <EditCompanyMember
          memberId={selectedCompanyMemberId}
          onClose={() => setIsEditDialogOpen(false)}
          onReloadData={handleReloadData}
        />
      )}
    </>
  );
};

export default CompanyMemberList;
