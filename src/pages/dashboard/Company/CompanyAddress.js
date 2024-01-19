import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import PropTypes from "prop-types";
import { useState } from "react";

import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  ControlPoint,
  Delete,
  Edit,
  Label,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import {
  createCompanyAddress,
  deleteCompanyAddress,
  getCompanyAddress,
  getCompanyAddressList,
  updateCompanyAddress,
} from "../../../app/api/companyAddress";
import ConfirmDialog from "../../../components/dialog/ConfirmDialog";

const CompanyAddress = ({ data, refetch }) => {
  const [editedData, setEditedData] = useState({
    address: "",
    phoneNumber: "",
  });
  const [fieldErrors, setFieldErrors] = useState({
    address: "",
    phoneNumber: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAddressIds, setSelectedAddressIds] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataAddress, setDataAddress] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [dataSelectedService, setDataSelectedService] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenEditDialog = async () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditedData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  const fetchCompanyAddressList = async () => {
    try {
      const res = await getCompanyAddressList(data.id, {
        page: currentPage,
        pageSize: 10,
      });
      if (!res || res.length === 0) {
        setErrorMessage("No data available.");
      } else {
        setDataAddress(res);
      }
    } catch (error) {
      console.log("Error fetching address data: ", error);
      setErrorMessage("Failed to fetch address data. Please try again later.");
    }
  };
  // const fetchData = async () => {
  //   try {
  //     const res = await getCompanyAddress(data.id);
  //     if (!res || res.length === 0) {
  //       setErrorMessage("No data available.");
  //     } else {
  //       setDataAddress(res);
  //     }
  //   } catch (error) {
  //     console.log("Error fetching address data: ", error);
  //     setErrorMessage("Failed to fetch address data. Please try again later.");
  //   }
  // };

  const handleSubmitAddress = async () => {
    try {
      setIsSubmitting(true);
      const errors = {};
      if (!editedData.address) {
        errors.address = "Address is required";
      }
      if (!editedData.phoneNumber) {
        errors.phoneNumber = "Phone Number is required";
      }
      if (editedData.phoneNumber.length > 10) {
        errors.phoneNumber = "Phone Number's maximum length is 10";
      }
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      if (isEditing) {
        await updateCompanyAddress(editedData, dataAddress.id);
      } else {
        const res = await createCompanyAddress(editedData, data.id);
        if (res) {
          refetch();
        }
      }
      fetchCompanyAddressList();
    } catch (error) {
      console.error("Error deleting company address:", error);
    } finally {
      handleCloseConfirm();
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const shouldDelete = window.confirm(
      "Are you sure want to delete this address?"
    );
    if (shouldDelete) {
      try {
        await deleteCompanyAddress(addressId);
        fetchCompanyAddressList();
      } catch (error) {
        console.error("Error deleting company address:", error);
      } finally {
        handleCloseConfirm();
      }
    }
  };

  const handleSelectAddress = (addressId) => {
    if (selectedAddressIds.includes(addressId)) {
      setSelectedAddressIds(
        selectedAddressIds.filter((id) => id !== addressId)
      );
    } else {
      setSelectedAddressIds([...selectedAddressIds, addressId]);
    }
  };

  const handleSelectAllAddresses = () => {
    if (selectedAddressIds.length === dataAddress.length) {
      setSelectedAddressIds([]);
    } else {
      setSelectedAddressIds(dataAddress?.map((address) => address.id));
    }
  };

  const handleDeleteSelectedAddresses = () => {
    try {
      if (selectedAddressIds.length === 0) {
        console.log("No selected addresses to delete.");
        return;
      }
      let currentIndex = 0;
      const deleteNextAddress = () => {
        if (currentIndex < selectedAddressIds.length) {
          const addressId = selectedAddressIds[currentIndex];
          deleteCompanyAddress(addressId)
            .then(() => {
              console.log(`Address with ID ${addressId} deleted successfully`);
              currentIndex++;
              deleteNextAddress();
            })
            .catch((error) => {
              console.error(
                `Error deleting address with ID ${addressId}: `,
                error
              );
              toast.error(
                `Error deleting address with ID ${addressId}: `,
                error
              );
            });
        } else {
          setSelectedAddressIds([]);
          toast.success("Selected addresses deleted successfully");
          fetchCompanyAddressList();
        }
      };
      deleteNextAddress();
    } catch (error) {
      console.error("Failed to delete selected addreses: ", error);
      toast.error("Failed to delete selected addreses, Please try again later");
    }
  };

  useEffect(() => {
    if (data.id !== null) {
      // fetchData();
      fetchCompanyAddressList();
    }
  }, [data]);

  return (
    <div>
      <Grid container spacing={2} alignItems="center" className="gridContainer">
        <Grid item xs={12}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            p={2}
            sx={{
              background: "#EEEEEE",
              borderBottom: "2px solid #CCCCCC",
              minWidth: 500,
              width: "40vw",
            }}
          >
            <Typography
              colSpan={4}
              style={{
                fontSize: "18px",
                textAlign: "left",
                fontWeight: "bold",
              }}
            >
              Company's Address
            </Typography>
            {!dataAddress?.companyId && (
              <Button
                variant="contained"
                onClick={() => {
                  setEditedData({
                    address: "",
                    phoneNumber: "",
                  });
                  setIsEditing(false);
                  handleOpenEditDialog();
                }}
              >
                New
              </Button>
            )}

            {/* <Button
                  variant="contained"
                  onClick={() => {
                    setEditedData({
                      address: dataAddress.address,
                      phoneNumber: dataAddress.phoneNumber,
                    });
                    setIsEditing(true);

                    handleOpenEditDialog();
                  }}
                >
                  Edit
                </Button> */}
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpenConfirm(true)}
            >
              Delete
            </Button>
          </Stack>
          <Stack
            style={{
              minWidth: 500,
              width: "40vw",
              marginBottom: "10px",
              border: "1px solid #000",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      width: "30px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedAddressIds?.length === dataAddress?.length
                      }
                      onChange={handleSelectAllAddresses}
                    />
                  </TableCell>
                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      width: "150px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Address
                  </TableCell>
                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Phone Number
                  </TableCell>
                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  ></TableCell>
                  <TableCell
                    style={{
                      background: "#CCCCCC",
                      marginTop: "10px",
                      textAlign: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataAddress?.map((address) => {
                  const isSelected = selectedAddressIds.includes(address.id);
                  return (
                    <TableRow key={address.id}>
                      <TableCell
                        sx={{
                          marginTop: "10px",
                          textAlign: "center",
                          width: "30px",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        <input
                          style={{ width: 10, height: 10 }}
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectAddress(address.id)}
                        />
                      </TableCell>
                      <TableCell style={{ marginTop: "10px", width: "150px" }}>
                        {address && address.companyId ? address.address : ""}
                      </TableCell>
                      <TableCell
                        style={{
                          marginTop: "10px",
                          width: "150px",
                          textAlign: "center",
                        }}
                      >
                        {address && address.companyId
                          ? address.phoneNumber
                          : ""}
                      </TableCell>
                      <TableCell
                        style={{
                          marginTop: "10px",
                          width: "50px",
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          onClick={() => {
                            setEditedData({
                              address: address.address,
                              phoneNumber: address.phoneNumber,
                            });
                            setIsEditing(true);
                            handleOpenEditDialog();
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        style={{
                          marginTop: "10px",
                          width: "50px",
                          textAlign: "center",
                        }}
                      >
                        <IconButton
                          color="error"
                          onClick={() => {
                            handleDeleteAddress(address.id);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Stack
              direction="row"
              width={"100%"}
              justifyContent="center"
              mt={2}
            >
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handleChangePage}
              />
            </Stack>
          </Stack>
          <ConfirmDialog
            content={"Are you sure want to delete seleted addresses?"}
            open={openConfirm}
            action={() => handleDeleteSelectedAddresses()}
            handleClose={handleCloseConfirm}
          />

          {/* Edit */}
          <Dialog
            open={openEditDialog}
            keepMounted
            onClose={handleCloseEditDialog}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>
              {isEditing ? "Edit" : "Create"} Company's Address
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography variant="h6">Address:</Typography>
                    <TextField
                      onChange={handleInputChange}
                      name={"address"}
                      value={editedData.address}
                    />
                  </Stack>
                  {fieldErrors.address && (
                    <div style={{ color: "red" }}>{fieldErrors.address}</div>
                  )}
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography variant="h6">Phone Number:</Typography>
                    <TextField
                      value={editedData.phoneNumber}
                      onChange={handleInputChange}
                      name={"phoneNumber"}
                    />
                  </Stack>
                  {fieldErrors.phoneNumber && (
                    <div style={{ color: "red" }}>
                      {fieldErrors.phoneNumber}
                    </div>
                  )}
                </Stack>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSubmitAddress}>
                {isSubmitting ? "Submitting" : isEditing ? "Save" : "Create"}
              </Button>
              <Button onClick={handleCloseEditDialog} color="error">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};

export default CompanyAddress;
