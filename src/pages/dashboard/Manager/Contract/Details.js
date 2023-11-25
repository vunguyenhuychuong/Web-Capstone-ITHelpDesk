import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import "../../../../assets/css/detailTicket.css";
import PropTypes from "prop-types";
import "../../../../assets/css/homeManager.css";
import { useSelector } from "react-redux";
import { formatDate } from "../../../helpers/FormatDate";
import { formatCurrency } from "../../../helpers/FormatCurrency";
import { useState } from "react";
import {
  createContractService,
  deleteContractService,
  getContractService,
  getServiceSelect,
} from "../../../../app/api/contract";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import UploadComponent from "./UploadComponent";
import { ControlPoint, Delete, RemoveCircleOutline } from "@mui/icons-material";
import { toast } from "react-toastify";

const Details = ({ data, loading, error }) => {
  const user = useSelector((state) => state.auth);
  const { contractId } = useParams();
  const [dataContractService, setDataContractService] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [dataSelectedService, setDataSelectedService] = useState([]);

  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  Details.propTypes = {
    data: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const closeImagePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  const selectServiceAdd = async () => {
    try {
      const res = await getServiceSelect(contractId);
      setDataSelectedService(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const contractData = await getContractService(contractId);
      if (!contractData || contractData.length === 0) {
        setErrorMessage("No data available.");
      } else {
        setDataContractService(contractData);
      }
    } catch (error) {
      console.log("Error fetching contract data: ", error);
      setErrorMessage("Failed to fetch contract data. Please try again later.");
    }
  };

  const handleAddService = async () => {
    if (!selectedService) {
      toast.warning("Please select a service");
      return;
    }
    try {
      const result = await createContractService(contractId, [selectedService]);
      fetchData();
      handleCloseDialog();
      toast.success(result.message, {
        autoClose: 2000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error("Error creating contract service:", error);
    }
  };

  const handleDelete = async (selectedRows) => {
    console.log("Deleting selected rows:", selectedRows);
    try {
      await deleteContractService(selectedRows);
      fetchData();
    } catch (error) {
      console.error("Error deleting contract services:", error);
    }
  };

  useEffect(() => {
    fetchData();
    selectServiceAdd();
  }, [contractId]);

  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "Name",
      headerName: "Name",
      width: 500,
      editable: true,
    },
    {
      field: "Type",
      headerName: "Type",
      width: 250,
      editable: true,
    },
    {
      field: "amount",
      headerName: "Value(VND)",
      type: "number",
      width: 150,
      editable: true,
    },
    {
      field: "createdAt",
      headerName: "Date Added",
      width: 350,
      editable: true,
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete([params.id])} color="secondary">
          <Delete />
        </IconButton>
      ),
    },
  ];

  const formattedDataContractService = dataContractService.map((contract) => ({
    id: contract.serviceId,
    Name: contract.service.description,
    Type: contract.service.type,
    amount: contract.service.amount,
    createdAt: formatDate(contract.createdAt),
  }));

  return (
    <div>
      <Grid container spacing={2} alignItems="center" className="gridContainer">
        <Grid item xs={12}>
          <Table
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              border: "1px solid #000",
            }}
          >
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Name
                </TableCell>
                <TableCell style={{ marginTop: "10px" }}>{data.name}</TableCell>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Active Period
                </TableCell>
                <TableCell style={{ marginTop: "10px" }}>
                  {formatDate(data.startDate)} - {formatDate(data.endDate)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Description
                </TableCell>
                <TableCell style={{ marginTop: "10px" }}>
                  {data.description}
                </TableCell>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Parent Contract
                </TableCell>
                <TableCell style={{ marginTop: "10px" }}>
                  {data.parentContractId}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Value (VND)
                </TableCell>
                <TableCell style={{ marginTop: "10px" }}>
                  {formatCurrency(data.value)} VND
                </TableCell>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Accountant
                </TableCell>
                <TableCell style={{ marginTop: "10px" }}>
                  {data &&
                    data.accountant &&
                    `${data.accountant.lastName} ${data.accountant.firstName}`}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <UploadComponent attachmentURL={data.attachmentURL} />
          {dataContractService.length === 0 && (
            <Typography variant="subtitle1" style={{ margin: "20px" }}>
              This contract has no payment yet.
            </Typography>
          )}
          <Table
            style={{
              marginTop: "20px",
              marginBottom: "10px",
              border: "1px solid #000",
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  colSpan={4}
                  style={{
                    background: "#EEEEEE",
                    textAlign: "center",
                    fontSize: "18px",
                    textAlign: "left",
                    borderBottom: "2px solid #CCCCCC",
                    fontWeight: "bold",
                  }}
                >
                  Company
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Company Name
                </TableCell>
                <TableCell style={{ marginTop: "10px", width: "150px" }}>
                  {data && data.company
                    ? data.company.companyName
                    : "No data available"}
                </TableCell>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Phone Number
                </TableCell>
                <TableCell style={{ marginTop: "10px" }}>
                  {data && data.company
                    ? data.company.phoneNumber
                    : "No data available"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                  }}
                >
                  Tax Code
                </TableCell>
                <TableCell style={{ marginTop: "10px", width: "150px" }}>
                  {data && data.company
                    ? data.company.taxCode
                    : "No data available"}
                </TableCell>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Email
                </TableCell>
                <TableCell style={{ marginTop: "10px", width: "150px" }}>
                  {data && data.company
                    ? data.company.email
                    : "No data available"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Website
                </TableCell>
                <TableCell style={{ marginTop: "10px", width: "150px" }}>
                  {data && data.company
                    ? data.company.website
                    : "No data available"}
                </TableCell>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                  }}
                >
                  Address
                </TableCell>
                <TableCell style={{ marginTop: "10px", width: "150px" }}>
                  {data && data.company
                    ? data.company.companyAddress
                    : "No data available"}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                    width: "150px",
                  }}
                >
                  Field Of Address
                </TableCell>
                <TableCell style={{ marginTop: "10px", width: "150px" }}>
                  {data && data.company
                    ? data.company.fieldOfBusiness
                    : "No data available"}
                </TableCell>
                <TableCell
                  style={{
                    background: "#CCCCCC",
                    marginTop: "10px",
                    textAlign: "right",
                  }}
                >
                  Company Admin
                </TableCell>
                <TableCell style={{ marginTop: "10px", width: "150px" }}>
                  {data && data.company
                    ? data.company.customerAdmin
                    : "No data available"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Grid
            container
            spacing={2}
            alignItems="center"
            className="gridContainer"
          >
            <Grid item xs={12}>
              <Table
                style={{
                  marginTop: "20px",
                  border: "1px solid #000",
                }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      style={{
                        background: "#EEEEEE",
                        textAlign: "left",
                        fontSize: "18px",
                        borderBottom: "2px solid #CCCCCC",
                        fontWeight: "bold",
                      }}
                    >
                      Associate Service
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "10px" }}
                        onClick={handleOpenDialog}
                      >
                        <ControlPoint /> Add
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "10px" }}
                      >
                        <RemoveCircleOutline /> Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <DataGrid
                rows={formattedDataContractService}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                onSelectionModelChange={(newSelection) => {
                  const selectedRows = newSelection.map((selectedId) => {
                    const selectedRow = formattedDataContractService.find(
                      (row) => row.id === selectedId
                    );
                    return selectedRow;
                  });
                  console.log("Selected Rows:", selectedRows);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add Service</DialogTitle>
        <DialogContent>
          <Select
            label="Service"
            value={selectedService}
            onChange={handleServiceChange}
            fullWidth
          >
            {dataSelectedService.map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {`${service.description} - ${service.amount}VND - ${service.type}`}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleAddService}>
            Add
          </Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Details;
