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
import { formatCurrency } from "../../helpers/FormatCurrency";
import { formatDate } from "../../helpers/FormatDate";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";


const ServiceList = () => {
  const [dataService, setDataService] = useState([]);
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


  const fetchAllService = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      const service = await getAllServices(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection);
      setDataService(service);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  useEffect(() => {
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
    setTotalPages(3);
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
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} /> <span style={{ color: "#FFFFFF" }}>All Service</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px",color: "#FFFFFF" }}
                onClick={handleOpenCreateService}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="eee"
                style={{ fontWeight: "bold", fontSize: "20px",color: "#FFFFFF" }}
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
                  <MenuItem value="name">Name</MenuItem>
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
           <CustomizedProgressBars />
          ) : (
        <MDBTable
          className="align-middle mb-0"
          responsive
          style={{ border: "0.05px solid #50545c" }}
        >
          <MDBTableHead className="bg-light">
            <tr style={{ fontSize: "1.2rem" }}>
              <th style={{ fontWeight: "bold" }}>
                <input type="checkbox" />
              </th>
              <th style={{ fontWeight: "bold" }}>Edit</th>
              <th style={{ fontWeight: "bold" }}>Delete</th>
              <th style={{ fontWeight: "bold" }}>Service Name</th>
              <th style={{ fontWeight: "bold" }}>Price</th>
              <th style={{ fontWeight: "bold" }}>Create Time</th>
              <th style={{ fontWeight: "bold" }}>Modify Time</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody className="bg-light">
            {dataService.map((service, index) => {
              return (
                <tr key={index}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td onClick={() => handleEditClick(service.id)}>
                    <Edit />
                  </td>
                  <td onClick={() => onDeleteService(service.id)}>
                    <DeleteForeverSharp />
                  </td>
                  <td>{service.description}</td>
                  <td>{formatCurrency(service.amount)} VND</td>
                  <td>{formatDate(service.createdAt || "-")}</td>
                  <td>{formatDate(service.modifiedAt || "-")}</td>
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
        <CreateService onClose={handleCloseService} />
      </Dialog>

      <Dialog open={dialogEdit} onClose={handleCloseEdit}>
        <EditService onClose={handleCloseEdit} serviceId={selectService} />
      </Dialog>
    </>
  );
};

export default ServiceList;
