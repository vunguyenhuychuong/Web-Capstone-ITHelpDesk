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
  List,
  ListItem,
  ListItemButton,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
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
  deletePaymentTerm,
  getAllPayment,
  getPaymentById,
  getPaymentTerm,
} from "../../../../app/api/payment";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  Delete,
  DeleteSweep,
  EditCalendar,
  Label,
  ViewCompact,
} from "@mui/icons-material";
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
import { FaPlus, FaSearch } from "react-icons/fa";
import CustomizedProgressBars from "../../../../components/iconify/LinearProccessing";
import { toast } from "react-toastify";
import PageSizeSelector from "../../Pagination/Pagination";
import { deleteMode } from "../../../../app/api/mode";
import { PostPaymentContract, getPaymentContract } from "../../../../app/api/contract";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const emails = ['username@gmail.com', 'user02@gmail.com'];

const PaymentContract = ({dataPayment}) => {
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
  const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState(null);
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
      const res = await getPaymentById(paymentId);
      const term = await getPaymentTerm(paymentId);
      setDataPaymentDetail(res);
      setDataPaymentTerm(term);
      setSelectedPaymentForEdit(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemovePayment = async (paymentId) => {
    try{
      await deletePaymentTerm(paymentId);
    }catch(error){
      console.log(error);
    }
  }

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






  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  const [payment, setPayment] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  useEffect(() => {
    fetchPaymentData();
  }, [dataPayment])

  const fetchPaymentData = async () => {
    try {
      const payment = await getPaymentContract(dataPayment?.id ?? 0);
      setPayment(payment);
      console.log(payment)
      console.log('asasa', dataPayment)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Grid container spacing={2} alignItems="center" className="gridContainer">
        {/* <MDBContainer
          className="py-5"
          style={{ paddingLeft: 20, paddingRight: 20, maxWidth: "100%" }}
        >
          <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
            <MDBContainer fluid>
              <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "20px" }}>
                <ContentCopy
                  style={{ marginRight: "20px", color: "#FFFFFF" }}
                />{" "}
                <span style={{ color: "#FFFFFF" }}> All PaymentList</span>
              </MDBNavbarBrand>
              <MDBNavbarNav className="ms-auto manager-navbar-nav">
                <MDBBtn
                  color="#eee"
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    color: "#FFFFFF",
                  }}
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
                  onClick={handleDeleteSelectedTeamMember}
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
                    <MenuItem value="description">Title</MenuItem>
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
                        fetchAllPaymentList();
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
                          selectedPayment.length === dataPaymentList.length
                        }
                        onChange={handleSelectAllTeamMembers}
                      />
                    </th>
                    <th style={{ fontWeight: "bold" }}>Edit</th>
                    <th
                      style={{ fontWeight: "bold" }}
                      onClick={() => handleSortChange("contractId")}
                    >
                      ID
                      {sortBy === "contractId" &&
                        (sortDirection === "asc" ? (
                          <ArrowDropDown />
                        ) : (
                          <ArrowDropUp />
                        ))}
                    </th>
                    <th
                      style={{ fontWeight: "bold" }}
                      onClick={() => handleSortChange("description")}
                    >
                      Description
                      {sortBy === "description" &&
                        (sortDirection === "asc" ? (
                          <ArrowDropDown />
                        ) : (
                          <ArrowDropUp />
                        ))}
                    </th>
                    <th
                      style={{ fontWeight: "bold" }}
                      onClick={() => handleSortChange("numberOfTerms")}
                    >
                      Number of Term
                      {sortBy === "numberOfTerms" &&
                        (sortDirection === "asc" ? (
                          <ArrowDropDown />
                        ) : (
                          <ArrowDropUp />
                        ))}
                    </th>
                    <th
                      style={{ fontWeight: "bold" }}
                      onClick={() => handleSortChange("duration")}
                    >
                      Duration
                      {sortBy === "duration" &&
                        (sortDirection === "asc" ? (
                          <ArrowDropDown />
                        ) : (
                          <ArrowDropUp />
                        ))}
                    </th>
                    <th
                      style={{ fontWeight: "bold" }}
                      onClick={() => handleSortChange("firstDateOfPayment")}
                    >
                      First Date of Payment
                      {sortBy === "id" &&
                        (sortDirection === "asc" ? (
                          <ArrowDropDown />
                        ) : (
                          <ArrowDropUp />
                        ))}
                    </th>
                    <th
                      style={{ fontWeight: "bold" }}
                      onClick={() => handleSortChange("paymentFinishTime")}
                    >
                      Finish Date of Payment
                      {sortBy === "paymentFinishTime" &&
                        (sortDirection === "asc" ? (
                          <ArrowDropDown />
                        ) : (
                          <ArrowDropUp />
                        ))}
                    </th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody className="bg-light">
                  {dataPaymentList.map((payment, index) => {
                    const isSelected = selectedPayment.includes(payment.id);
                    return (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectPayment(payment.id)}
                          />
                        </td>
                        <td>
                          <ViewCompact
                            onClick={() => handleDetailPayment(payment.id)}
                          />
                        </td>
                        <td>{payment.contractId}</td>
                        <td>{payment.description}</td>
                        <td>{payment.numberOfTerms}</td>
                        <td>{payment.duration}</td>
                        <td>{formatDate(payment.firstDateOfPayment || "-")}</td>
                        <td>{formatDate(payment.paymentFinishTime || "-")}</td>
                      </tr>
                    );
                  })}
                </MDBTableBody>
                <MDBTableBody className="bg-light"></MDBTableBody>
              </MDBTable>
            </>
          )}
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
            />
          </Box>
        </MDBContainer>

        {selectedPaymentForEdit && (
          <Grid item xs={12}>
            <Table
              style={{
                marginTop: "20px",
                marginBottom: "10px",
                border: "1px solid #000",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell colSpan={4} className="paymentCell">
                    <div className="paymentContent">
                      <div className="paymentText">Payment Information</div>
                      <div className="buttonsContainer">
                        <Button
                          variant="contained"
                          color="primary"
                          className="button-payment"
                          style={{
                            backgroundColor: "#2196F3",
                            color: "#fff",
                            marginRight: 10,
                          }}
                        >
                          <EditCalendar
                            style={{ marginRight: 10 }}
                            onClick={() => handleEditPayment(dataPaymentDetail.id)}
                          />{" "}
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          className="button-payment"
                          style={{ backgroundColor: "#f44336", color: "#fff" }}
                        >
                          <DeleteSweep 
                            style={{ marginRight: 10 }} 
                            onClick={() => handleRemovePayment(dataPaymentDetail.id)}
                            /> Remove
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              {dataPaymentDetail.id ? (
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
                      Description
                    </TableCell>
                    <TableCell style={{ marginTop: "10px", width: "150px" }}>
                      {dataPaymentDetail.description}
                    </TableCell>
                    <TableCell
                      style={{
                        background: "#CCCCCC",
                        marginTop: "10px",
                        textAlign: "right",
                        width: "150px",
                      }}
                    >
                      Duration
                    </TableCell>
                    <TableCell style={{ marginTop: "10px" }}>
                      {dataPaymentDetail.duration}
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
                      First date of payment
                    </TableCell>
                    <TableCell style={{ marginTop: "10px", width: "150px" }}>
                      {formatDate(dataPaymentDetail.firstDateOfPayment)}
                    </TableCell>
                    <TableCell
                      style={{
                        background: "#CCCCCC",
                        marginTop: "10px",
                        textAlign: "right",
                        width: "150px",
                      }}
                    >
                      Number of term
                    </TableCell>
                    <TableCell style={{ marginTop: "10px", width: "150px" }}>
                      {dataPaymentDetail.numberOfTerms}
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
                      Initial payment amount
                    </TableCell>
                    <TableCell style={{ marginTop: "10px", width: "150px" }}>
                      {dataPaymentDetail.initialPaymentAmount}
                    </TableCell>
                    <TableCell
                      style={{
                        background: "#CCCCCC",
                        marginTop: "10px",
                        textAlign: "right",
                      }}
                    >
                      Is Fully Paid
                    </TableCell>
                    <TableCell style={{ marginTop: "10px", width: "150px" }}>
                      {dataPaymentDetail.isFullyPaid}
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
                      Note
                    </TableCell>
                    <TableCell style={{ marginTop: "10px", width: "150px" }}>
                      {dataPaymentDetail.note}
                    </TableCell>
                    <TableCell
                      style={{
                        background: "#CCCCCC",
                        marginTop: "10px",
                        textAlign: "right",
                      }}
                    >
                      Completion date
                    </TableCell>
                    <TableCell style={{ marginTop: "10px", width: "150px" }}>
                      {dataPaymentDetail.paymentFinishTime}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                <Typography variant="subtitle1" style={{ margin: "20px" }}>
                  No Payment Information available.
                  <Button
                    style={{
                      marginLeft: "5px",
                      color: "blue",
                      textDecoration: "underline",
                      transformStyle: "none",
                    }}
                    onClick={handleOpenCreatePayment}
                  >
                    Add Payment
                  </Button>
                </Typography>
              )}
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
                    width: "100%",
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
                        Payment Term
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {dataPaymentTerm.length === 0 ? (
                  <Typography variant="subtitle1" style={{ margin: "20px" }}>
                    No Services available.
                  </Typography>
                ) : (
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
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        )} */}

        <div>
          <Button variant="outlined" onClick={handleClickOpen}>
            Create payment
          </Button>
          <SimpleDialog
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
            contractId={dataPayment?.id}
          />
        </div>

      </Grid>
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
    attachmentUrls: []
  })
  
  const [selectedFile, setSelectedFile] = useState(null);
  const handleClose = () => {
    onClose(selectedValue);
  };

  useEffect(() => console.log(contractId), [contractId])

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    const formattedStartDateOfPayment = moment(newPayment.startDateOfPayment).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    try {
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
    }  catch (error) {
      console.error(error);
    } finally {
      handleClose();
    }
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((pre) => ({...pre, [name]: value}))
  }
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
    console.log(file)
    // file.filter(f => f !== {} || f !== undefined || f !== null)
    setSelectedFile([...file]);
    setNewPayment((prevInputs) => ({
      ...prevInputs,
      attachmentUrls: [...file],
    }));
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ '& .MuiDialog-paper': { width: '80%' } }}>
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
                onChange={(newValue) =>
                  handleStartDateChange(newValue)
                }
                renderInput={(props) => <TextField {...props} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <FormLabel>Days Amount for Payment</FormLabel>
            <TextField fullWidth type="number" name="daysAmountForPayment" id="outlined-basic" variant="outlined" onChange={handleInputChange} />
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
          <TextField fullWidth type="file" name="attachmentUrls" className="form-control input-field" multiple onChange={handleFileChange}/>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCreatePayment}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  contractId: PropTypes.number.isRequired,
};