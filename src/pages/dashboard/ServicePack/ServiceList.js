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
import React, { useState } from "react";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  Delete,
  DeleteForeverSharp,
  Edit,
} from "@mui/icons-material";
import { useEffect } from "react";
import { deleteService, getAllServices } from "../../../app/api/service";
import {
  Box,
  Dialog,
  FormControl,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import { FaPlus, FaSearch } from "react-icons/fa";
import CreateService from "./CreateService";
import EditService from "./EditService";
import { toast } from "react-toastify";
import { useCallback } from "react";
import PageSizeSelector from "../Pagination/Pagination";
import { formatDate } from "../../helpers/FormatDate";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import CircularLoading from "../../../components/iconify/CircularLoading";
import { getAllCategories } from "../../../app/api/category";

const ServiceList = () => {
  const [dataService, setDataService] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEdit, setDialogEdit] = useState(false);
  const [selectService, setSelectService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchField, setSearchField] = useState("description");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllCategories = async () => {
    try {
      const res = await getAllCategories();
      setDataCategories(res?.data);
    } catch (error) {
      console.log("Error while fetching data", error);
    }
  };

  const fetchAllService = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      const response = await getAllServices(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataService(response?.data);
      setTotalPages(response?.totalPage);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  useEffect(() => {
    fetchAllCategories();
    fetchAllService();
  }, [fetchAllService]);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
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

  const handleEditClick = async (serviceId) => {
    setSelectService(serviceId);
    setDialogEdit(true);
  };

  const handleOpenCreateService = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleCloseService = (e) => {
    e.preventDefault();
    setDialogOpen(false);
  };

  const handleCloseEdit = () => {
    setDialogEdit(false);
  };

  const getCategoryById = (id) => {
    const category = dataCategories.find((cate) => cate.id === id);
    return category;
  };

  const onDeleteService = async (id) => {
    const shouldDelete = window.confirm(
      "Are you sure want to delete this mode"
    );
    if (shouldDelete) {
      try {
        const result = await deleteService(id);
        fetchAllService();
        toast.success("Delete Service successful", result.message);
        if (result.isError === false) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to delete Service. Please try again later");
      }
    }
  };

  useEffect(() => {
    fetchAllService();
  }, [fetchAllService]);

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
              <span style={{ color: "#FFFFFF" }}>All Services</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "#FFFFFF",
                }}
                onClick={handleOpenCreateService}
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
                  <MenuItem value="type">Type</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  <MenuItem value="id">Id</MenuItem>
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
                      fetchAllService();
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
          <MDBTable className="align-middle mb-0" responsive>
            <MDBTableHead className="bg-light">
              <tr style={{ fontSize: "1.2rem" }}>
                <th style={{ fontWeight: "bold" }}>
                  <input type="checkbox" />
                </th>

                <th
                  style={{ fontWeight: "bold" }}
                  className="sortable-header"
                  onClick={() => handleSortChange("description")}
                >
                  Service Name
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
                  onClick={() => handleSortChange("categoryId")}
                >
                  Category
                  {sortBy === "categoryId" &&
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
                <th style={{ fontWeight: "bold" }}></th>
              </tr>
            </MDBTableHead>
            <MDBTableBody className="bg-light">
              {dataService?.map((service, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{service.description}</td>
                    <td>{getCategoryById(service.categoryId).name}</td>
                    <td>{formatDate(service.createdAt || "-")}</td>
                    <td>{formatDate(service.modifiedAt || "-")}</td>
                    <td onClick={() => handleEditClick(service.id)}>
                      <Edit />
                    </td>
                    <td onClick={() => onDeleteService(service.id)}>
                      <DeleteForeverSharp color="error" />
                    </td>
                  </tr>
                );
              })}
            </MDBTableBody>

            <MDBTableBody className="bg-light"></MDBTableBody>
          </MDBTable>
        )}
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
          />
        </Box>
      </MDBContainer>
      <Dialog open={dialogOpen} onClose={handleCloseService}>
        <CreateService
          onClose={handleCloseService}
          dataCategories={dataCategories}
        />
      </Dialog>

      <Dialog open={dialogEdit} onClose={handleCloseEdit}>
        <EditService
          onClose={handleCloseEdit}
          serviceId={selectService}
          dataCategories={dataCategories}
        />
      </Dialog>
    </>
  );
};

export default ServiceList;
