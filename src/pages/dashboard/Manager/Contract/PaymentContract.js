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
import "../../../../assets/css/detailTicket.css";
import PropTypes from "prop-types";
import "../../../../assets/css/homeManager.css";
import { DataGrid } from "@mui/x-data-grid";
import { formatDate } from "../../../helpers/FormatDate";
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
import CustomizedProgressBars from "../../../../components/iconify/LinearProccessing";
import { toast } from "react-toastify";
import PageSizeSelector from "../../Pagination/Pagination";
import { deleteMode } from "../../../../app/api/mode";
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
import ConfirmDialog from "../../../../components/dialog/ConfirmDialog";

const emails = ["username@gmail.com", "user02@gmail.com"];

const PaymentContract = ({ dataPayment }) => {
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
  PaymentContract.propTypes = {
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

  const handleDeleteSelectedTeamMember = async (id) => {
    try {
      if (selectedPayment.length === 0) {
        return;
      }
      const deletePromises = selectedPayment.map(async (teamId) => {
        try {
          const res = await Promise.resolve(deleteMode(teamId));
          if (res.isError) {
            throw new Error(
              `Error deleting team member with ID ${teamId}: ${res.message}`
            );
          }
          return teamId;
        } catch (error) {
          throw new Error(
            `Error deleting team member with ID ${teamId}: ${error.message}`
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
      const updateModes = dataPaymentList.filter(
        (mode) => !successfulDeletes.includes(mode.id)
      );
      setDataPaymentList(updateModes);
      setSelectPayment([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete selected modes, Please try again later");
    }
  };

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
                      <TableCell align="right" style={{ fontWeight: "bold" }}>
                        {moment(payment.startDateOfPayment).format(
                          "MM/DD/YYYY hh:mm A"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" className="fw-bold" scope="row">
                        End Date
                      </TableCell>
                      <TableCell align="right" style={{ fontWeight: "bold" }}>
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

        <Grid
          item
          className="justify-content-center d-flex w-100 mb-5"
          sx={{ gap: 1 }}
        >
          {payment?.contract ? (
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenConfirm(true)}
              >
                Delete payment
              </Button>
              <Button variant="outlined" onClick={handleClickOpen}>
                Edit payment
              </Button>
              <EditDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                payment={payment}
              />
            </>
          ) : (
            <>
              <Button variant="outlined" onClick={handleClickOpen}>
                Create payment
              </Button>
              <SimpleDialog
                selectedValue={selectedValue}
                open={open}
                onClose={handleClose}
                contractId={dataPayment?.id}
              />
            </>
          )}{" "}
        </Grid>
      </Grid>
      <ConfirmDialog
        content={"Are you sure want to delete this payment?"}
        open={openConfirm}
        action={() => handleRemovePayment(payment.id)}
        handleClose={handleCloseConfirm}
      />
    </div>
  );
};

export default PaymentContract;

function SimpleDialog(props) {
  const { onClose, selectedValue, open, contractId } = props;
  const [newPayment, setNewPayment] = useState({
    contractId: contractId ?? 0,
    description: "",
    startDateOfPayment: new Date(),
    daysAmountForPayment: 0,
    note: "",
    attachmentUrls: [],
  });
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const handleClose = () => {
    onClose(selectedValue);
  };

  useEffect(() => console.log(contractId), [contractId]);

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    const formattedStartDateOfPayment = moment(
      newPayment.startDateOfPayment
    ).format("YYYY-MM-DDTHH:mm:ss");
    try {
      setIsSubmitting(true);
      let attachmentUrls = [];
      if (selectedFile && selectedFile.length > 0) {
        const storage = getStorage();
        const promises = [];

        for (let i = 0; i < selectedFile.length; i++) {
          const file = selectedFile[i];
          const storageRef = ref(storage, `images/${file.name}`);
          await uploadBytes(storageRef, file);

          const downloadURL = await getDownloadURL(storageRef);
          attachmentUrls.push(downloadURL);
        }
      }
      const paymentPayload = {
        ...newPayment,
        attachmentUrls: attachmentUrls,
        startDateOfPayment: formattedStartDateOfPayment,
      };
      await PostPaymentContract(paymentPayload);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((pre) => ({ ...pre, [name]: value }));
  };
  const handleStartDateChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setStartDate(newDate);
    setNewPayment((prevInputs) => ({
      ...prevInputs,
      startDateOfPayment: formattedDate,
    }));
  };
  const [startDate, setStartDate] = useState(
    moment(newPayment.startDateOfPayment ?? undefined)
  );
  const handleFileChange = (e) => {
    const file = e.target.files;
    console.log(file);
    // file.filter(f => f !== {} || f !== undefined || f !== null)
    setSelectedFile([...file]);
    setNewPayment((prevInputs) => ({
      ...prevInputs,
      attachmentUrls: [...file],
    }));
  };

  return (
    <Stack>
      <Dialog
        onClose={handleClose}
        open={open}
        sx={{ "& .MuiDialog-paper": { width: "80%" } }}
      >
        <DialogTitle>Create Payment</DialogTitle>
        <DialogContent className="pt-2">
          <Grid container>
            <Grid item className="w-100 pb-3">
              <FormLabel>Description</FormLabel>
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={1}
                className="w-100"
                name="description"
                value={newPayment.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormLabel>Start Date</FormLabel>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                  slotProps={{
                    textField: {
                      helperText: `${startDate}`,
                    },
                  }}
                  value={startDate}
                  onChange={(newValue) => handleStartDateChange(newValue)}
                  renderInput={(props) => <TextField {...props} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <FormLabel>Days Amount for Payment</FormLabel>
              <TextField
                fullWidth
                type="number"
                InputProps={{
                  inputProps: {
                    min: 10,
                  },
                }}
                name="daysAmountForPayment"
                id="outlined-basic"
                variant="outlined"
                onChange={(e) => {
                  var value = parseInt(e.target.value, 10);
                  if (value < 0) e.target.value = 0;

                  handleInputChange(e);
                }}
              />
            </Grid>
            <Grid item className="w-100 pt-3">
              <FormLabel>Note</FormLabel>
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={1}
                className="w-100"
                name="note"
                value={newPayment.note}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item className="pt-3" xs={12}>
              <FormLabel>Attachments</FormLabel>
              <input
                type="file"
                name="file"
                className="form-control input-field"
                id="attachmentUrls"
                multiple
                onChange={handleFileChange}
              />
              {imagePreviewUrl.length > 0 && (
                <div
                  className="image-preview"
                  onClick={() => setIsImagePreviewOpen(true)}
                >
                  <p className="preview-text">Click here to view attachment</p>
                </div>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreatePayment} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>{" "}
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
    </Stack>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  contractId: PropTypes.number.isRequired,
};

function EditDialog(props) {
  const { onClose, selectedValue, open, payment } = props;
  const handleClose = () => {
    onClose(selectedValue);
  };
  const [isFullyPaid, setIsFullyPaid] = useState(payment.isFullyPaid);
  const [note, setNote] = useState(payment.note);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  useEffect(() => {
    setIsFullyPaid(payment.isFullyPaid);
    setNote(payment.note);
  }, [payment]);

  useEffect(() => {
    try {
      const previewUrls = payment.attachmentUrls;
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

  const handleFileChange = (e) => {
    const file = e.target.files;
    console.log(file);
    // file.filter(f => f !== {} || f !== undefined || f !== null)
    setSelectedFile([...file]);
  };
  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      let attachmentUrls = [];
      if (selectedFile && selectedFile.length > 0) {
        const storage = getStorage();

        for (let i = 0; i < selectedFile.length; i++) {
          const file = selectedFile[i];
          const storageRef = ref(storage, `images/${file.name}`);
          await uploadBytes(storageRef, file);

          const downloadURL = await getDownloadURL(storageRef);
          attachmentUrls.push(downloadURL);
        }
      }
      const paymentPayload = {
        isFullyPaid: isFullyPaid,
        attachmentUrls: attachmentUrls,
        note: note,
      };
      await PutPaymentContract(payment.id, paymentPayload);
    } catch (error) {
      console.error(error);
    } finally {
      handleClose();
    }
  };
  return (
    <Stack>
      <Dialog
        onClose={handleClose}
        open={open}
        sx={{ "& .MuiDialog-paper": { width: "80%" } }}
      >
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent className="pt-2">
          <Grid container>
            <Grid item className="w-100">
              <FormLabel>Is Fully Paid</FormLabel>
              <Select
                label="Is Fully Paid"
                className="w-100"
                variant="outlined"
                value={isFullyPaid}
                onChange={(e) => setIsFullyPaid(e.target.value)}
              >
                <MenuItem value={false}>Not Paid</MenuItem>
                <MenuItem value={true}>Paid</MenuItem>
              </Select>
            </Grid>
            <Grid item className="w-100 pt-2">
              <FormLabel>Note</FormLabel>
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={1}
                className="w-100"
                name="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Grid>
            <Grid item className="pt-3" xs={12}>
              <FormLabel>Attachments</FormLabel>
              <input
                type="file"
                name="file"
                className="form-control input-field"
                id="attachmentUrls"
                multiple
                onChange={handleFileChange}
              />
              {imagePreviewUrl.length > 0 && (
                <div
                  className="image-preview"
                  onClick={() => setIsImagePreviewOpen(true)}
                >
                  <p className="preview-text">Click here to view attachment</p>
                </div>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdatePayment}>Save</Button>
        </DialogActions>
      </Dialog>{" "}
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
    </Stack>
  );
}
