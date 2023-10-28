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
  Pagination,
} from "@mui/material";
import { FaPlus } from "react-icons/fa";
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
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);


  const fetchAllService = useCallback(async () => {
    try {
      const service = await getAllServices(currentPage, pageSize);
      setDataService(service);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

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

  const handleCloseEdit = (e) => {
    e.preventDefault();
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
    <section style={{ backgroundColor: "#FFF" }}>
      <MDBContainer
        className="py-5"
        style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
      >
        <MDBNavbar expand="lg" light bgColor="inherit">
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px" }} /> All Service
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav">
              <MDBBtn
                color="#eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
                onClick={handleOpenCreateService}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="eee"
                style={{ fontWeight: "bold", fontSize: "20px" }}
              >
                <Delete /> Delete
              </MDBBtn>

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
    </section>
  );
};

export default ServiceList;
