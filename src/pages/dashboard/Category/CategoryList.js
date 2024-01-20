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
import {
  Dialog,
  FormControl,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import { formatDate } from "../../helpers/FormatDate";
import PageSizeSelector from "../Pagination/Pagination";
import { Box } from "@mui/system";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import { deleteCategory, getCategoriesAll } from "../../../app/api/category";
import EditCategory from "./EditCategory";
import CreateCategory from "./CreateCategory";
import CircularLoading from "../../../components/iconify/CircularLoading";

const CategoryList = () => {
  const [dataCategory, setDataCategory] = useState([]);
  const [selectCategory, setSelectCategory] = useState(null);
  const [selectedTeamMembers, setSelectedTeamMember] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("description");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEdit, setDialogEdit] = useState(false);
  const fetchAllCategory = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }

      const response = await getCategoriesAll(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataCategory(response?.data);
      setTotalPages(response?.totalPage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  const handleSelectCategory = (categoryId) => {
    if (selectedTeamMembers.includes(categoryId)) {
      setSelectedTeamMember(
        selectedTeamMembers.filter((id) => id !== categoryId)
      );
      console.log("many select", selectCategory);
    } else {
      setSelectedTeamMember([...selectedTeamMembers, categoryId]);
    }
  };

  const handleSelectAllCategory = () => {
    if (selectedTeamMembers.length === dataCategory.length) {
      setSelectedTeamMember([]);
    } else {
      setSelectedTeamMember(dataCategory?.map((mode) => mode.id));
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

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleReloadData = () => {
    fetchAllCategory();
  };

  const handleDeleteSelectedCategory = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure want to delete selected categories"
    );
    if (shouldDelete) {
      try {
        if (selectedTeamMembers.length === 0) {
          return;
        }
        const deletePromises = selectedTeamMembers.map(async (categoryId) => {
          try {
            const res = await Promise.resolve(deleteCategory(categoryId));
            if (res.isError) {
              throw new Error(
                `Error deleting category with ID ${categoryId}: ${res.message}`
              );
            }
            return categoryId;
          } catch (error) {
            throw new Error(
              `Error deleting category with ID ${categoryId}: ${error.message}`
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
        const updateModes = dataCategory.filter(
          (mode) => !successfulDeletes.includes(mode.id)
        );
        setDataCategory(updateModes);
        setSelectCategory([]);
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete selected modes, Please try again later");
      }
    }
  };

  const handleOpenCategory = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleCloseCategory = () => {
    setDialogOpen(false);
  };

  const handleEditClick = async (categoryId) => {
    setSelectCategory(categoryId);
    setDialogEdit(true);
  };

  const handleCloseEdit = (e) => {
    if (e) {
      e.preventDefault();
    }
    setDialogEdit(false);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchAllCategory();
  }, [fetchAllCategory]);

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
              <span style={{ color: "#FFFFFF" }}> All Categories</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                onClick={handleOpenCategory}
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
                onClick={handleDeleteSelectedCategory}
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
                  <MenuItem value="name">name</MenuItem>
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
                      fetchAllCategory();
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
            <MDBTable className="align-middle mb-0" responsive>
              <MDBTableHead className="bg-light">
                <tr style={{ fontSize: "1.2rem" }}>
                  <th style={{ fontWeight: "bold" }}>
                    <input
                      type="checkbox"
                      checked={
                        selectedTeamMembers.length === dataCategory.length
                      }
                      onChange={handleSelectAllCategory}
                    />
                  </th>

                  <th
                    style={{ fontWeight: "bold" }}
                    className="sortable-header"
                    onClick={() => handleSortChange("name")}
                    title="Click to Sort by name"
                  >
                    name
                    {sortBy === "name" &&
                      (sortDirection === "asc" ? (
                        <ArrowDropDown />
                      ) : (
                        <ArrowDropUp />
                      ))}
                  </th>
                  <th
                    style={{ fontWeight: "bold" }}
                    className="sortable-header"
                    onClick={() => handleSortChange("description")}
                    title="Click to Sort by description"
                  >
                    description
                    {sortBy === "description" &&
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
                  <th style={{ fontWeight: "bold" }}></th>
                </tr>
              </MDBTableHead>
              <MDBTableBody className="bg-light">
                {dataCategory?.map((category, index) => {
                  const isSelected = selectedTeamMembers.includes(category.id);
                  return (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectCategory(category.id)}
                        />
                      </td>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>{formatDate(category.createdAt || "-")}</td>
                      <td>{formatDate(category.modifiedAt || "-")}</td>
                      <td>
                        <Edit onClick={() => handleEditClick(category.id)} />
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

      <Dialog open={dialogOpen} onClose={handleCloseCategory}>
        <CreateCategory onClose={handleCloseCategory} />
      </Dialog>

      <Dialog open={dialogEdit} onClose={handleCloseEdit}>
        <EditCategory onClose={handleCloseEdit} categoryId={selectCategory} />
      </Dialog>
    </>
  );
};

export default CategoryList;
