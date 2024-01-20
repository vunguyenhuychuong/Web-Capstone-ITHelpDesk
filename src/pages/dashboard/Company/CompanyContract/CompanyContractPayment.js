import React, { useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import "../../../../assets/css/homeManager.css";
import { DataGrid } from "@mui/x-data-grid";

import {
  deletePaymentById,
  deletePaymentTerm,
  getAllPayment,
  getPaymentById,
  getPaymentTerm,
} from "../../../../app/api/payment";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Close } from "@mui/icons-material";
import {} from "mdb-react-ui-kit";
import { FaPlus, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  PostPaymentContract,
  PutPaymentContract,
  getPaymentContract,
} from "../../../../app/api/contract";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import ReactImageGallery from "react-image-gallery";
import { deleteMode } from "../../../../app/api/mode";
import { formatDate } from "../../../helpers/FormatDate";

const emails = ["username@gmail.com", "user02@gmail.com"];

const CompanyContractPayment = ({ dataPayment }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dataPaymentTerm, setDataPaymentTerm] = useState([]);
  const [selectPayment, setSelectPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchField, setSearchField] = useState("description");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [totalPages, setTotalPages] = useState(1);
  const [dataPaymentList, setDataPaymentList] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  const [payment, setPayment] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [dataPaymentDetail, setDataPaymentDetail] = useState({
    contractId: 1,
    description: "",
    numberOfTerms: 0,
    firstDateOfPayment: "",
    duration: 0,
    initialPaymentAmount: "",
    isFullyPaid: false,
    paymentFinishTime: "",
    note: "",
  });
  CompanyContractPayment.propTypes = {
    dataPayment: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  };

  const fetchAllPaymentList = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      const payment = await getAllPayment(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataPaymentList(payment);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  const handleDetailPayment = async (paymentId) => {
    try {
      // const res = await getPaymentById(paymentId);
      // const term = await getPaymentTerm(paymentId);
      // setDataPaymentDetail(res);
      // setDataPaymentTerm(term);
      // setSelectedPaymentForEdit(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemovePayment = async (paymentId) => {
    try {
      await deletePaymentById(paymentId);
      await fetchPaymentData();
      handleCloseConfirm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenCreatePayment = () => {
    navigate("/home/createPayment");
  };

  const handleEditPayment = (paymentId) => {
    navigate(`/home/editPayment/${paymentId}`);
  };

  useEffect(() => {
    handleDetailPayment();
    fetchAllPaymentList();
  }, []);

  const handleSelectPayment = (teamId) => {
    if (selectedPayment.includes(teamId)) {
      setSelectedPayment(selectedPayment.filter((id) => id !== teamId));
      console.log("many select", selectPayment);
    } else {
      setSelectedPayment([...selectedPayment, teamId]);
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

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleSelectAllTeamMembers = () => {
    if (selectedPayment.length === dataPaymentList.length) {
      setSelectedPayment([]);
    } else {
      setSelectedPayment(dataPaymentList.map((mode) => mode.id));
    }
  };

  useEffect(() => {
    try {
      const previewUrls = payment?.attachmentUrls;
      if (previewUrls && previewUrls.length > 0) {
        const images = previewUrls.map((url, index) => ({
          original: url,
          thumbnail: url,
          description: `Attachment Preview ${index + 1}`,
        }));
        setImagePreviewUrl(images);
      }
    } catch (error) {
      console.log("Error", error);
    }
  }, [payment]);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    {
      field: "Description",
      headerName: "Description",
      width: 400,
      editable: true,
    },
    {
      field: "termStart",
      headerName: "Date Added",
      width: 150,
      editable: true,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "termEnd",
      headerName: "Date End",
      width: 150,
      editable: true,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "termAmount",
      headerName: "Value(VND)",
      width: 200,
      editable: true,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "isPaid",
      headerName: "Is Paid",
      width: 100,
      editable: true,
      align: "right",
      headerAlign: "right",
    },
    {
      field: "termFinishTime",
      headerName: "Term Finish Time",
      width: 150,
      editable: true,
      align: "right",
      headerAlign: "right",
    },
  ];

  const formattedDataContractService = (dataPaymentTerm || []).map(
    (payment) => ({
      id: payment?.id,
      Description: payment?.description,
      termAmount: payment?.termAmount,
      termStart: payment?.termStart,
      termEnd: payment?.termEnd,
      isPaid: payment?.isPaid,
      termFinishTime: payment?.termFinishTime,
    })
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
    fetchPaymentData();
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  useEffect(() => {
    fetchPaymentData();
  }, [dataPayment]);

  const fetchPaymentData = async () => {
    try {
      const payment = await getPaymentContract(dataPayment?.id ?? 0);
      setPayment(payment);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayment((pre) => ({ ...pre, [name]: value }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files;
    console.log(file);
    setSelectedFile([...file]);
    setPayment((prevInputs) => ({
      ...prevInputs,
      attachmentUrls: [...file],
    }));
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" className="gridContainer">
        <Grid
          item
          className="justify-content-center d-flex w-100 border p-5 mt-5"
        >
          {payment?.contract ? (
            <>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="caption table">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" className="fw-bold" scope="row">
                        Description
                      </TableCell>
                      <TableCell align="right">{payment.description}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" className="fw-bold" scope="row">
                        Start Date
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {moment(payment.startDateOfPayment).format(
                          "MM/DD/YYYY hh:mm A"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" className="fw-bold" scope="row">
                        End Date
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {moment(payment.endDateOfPayment).format(
                          "MM/DD/YYYY hh:mm A"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" className="fw-bold" scope="row">
                        Created At
                      </TableCell>
                      <TableCell align="right">
                        {payment.createdAt && payment.createdAt !== ""
                          ? moment(payment.createdAt).format(
                              "MM/DD/YYYY hh:mm A"
                            )
                          : "-"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" className="fw-bold" scope="row">
                        Note
                      </TableCell>
                      <TableCell align="right">{payment.note}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" className="fw-bold" scope="row">
                        Is Fully Paid
                      </TableCell>
                      <TableCell
                        align="right"
                        className={
                          payment.isFullyPaid ? "text-success" : "text-danger"
                        }
                      >
                        {payment.isFullyPaid ? "Paid" : "Not Paid"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" className="fw-bold" scope="row">
                        Attachments
                      </TableCell>
                      <TableCell align="right">
                        {/* <input
                              type="file"
                              name="file"
                              className="form-control input-field"
                              id="attachmentUrls"
                              multiple
                              onChange={handleFileChange}
                            /> */}
                        {imagePreviewUrl.length > 0 && (
                          <Button onClick={() => setIsImagePreviewOpen(true)}>
                            Click here to view attachment
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <>No payment.</>
          )}
          <Dialog
            open={isImagePreviewOpen}
            onClose={() => setIsImagePreviewOpen(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Image Preview
              <IconButton
                edge="end"
                color="inherit"
                onClick={() => setIsImagePreviewOpen(false)}
                aria-label="close"
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <ReactImageGallery items={imagePreviewUrl} />
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    </div>
  );
};

export default CompanyContractPayment;
