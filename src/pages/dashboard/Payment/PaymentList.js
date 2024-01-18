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
import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketCustomer.css";
import PageSizeSelector from "../Pagination/Pagination";
import {
  ArrowDropDown,
  ArrowDropUp,
  ContentCopy,
  DeleteForever,
  Edit,
  ViewCompact,
} from "@mui/icons-material";
import { formatDate } from "../../helpers/FormatDate";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Box, FormControl, MenuItem, Pagination, Select } from "@mui/material";
import { FaPlus, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import CustomizedProgressBars from "../../../components/iconify/LinearProccessing";
import { deletePaymentById, getAllPayment } from "../../../app/api/payment";
import { formatCurrency } from "../../helpers/FormatCurrency";
import Paid from "../../../assets/images/paid.svg";
import UnPaid from "../../../assets/images/unpaid.svg";
import CircularLoading from "../../../components/iconify/CircularLoading";

const PaymentList = () => {
  const [dataListPayment, setDataListPayment] = useState([]);
  const [selectedPaymentIds, setSelectedPaymentIds] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [searchField, setSearchField] = useState("description");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortBy, setSortBy] = useState("id");
  const navigate = useNavigate();

  const fetchDataListPayment = useCallback(async () => {
    try {
      let filter = "";
      if (searchQuery) {
        filter = `title="${encodeURIComponent(searchQuery)}"`;
      }
      setLoading(true);
      const response = await getAllPayment(
        searchField,
        searchQuery,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      );
      setDataListPayment(response?.data);
      setTotalPages(response?.totalPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchField, searchQuery, sortBy, sortDirection]);

  const handleSelectPayment = (paymentId) => {
    if (selectedPaymentIds.includes(paymentId)) {
      setSelectedPaymentIds(
        selectedPaymentIds.filter((id) => id !== paymentId)
      );
    } else {
      setSelectedPaymentIds([...selectedPaymentIds, paymentId]);
    }
  };

  const handleSelectAllPayments = () => {
    if (selectedPaymentIds.length === dataListPayment.length) {
      setSelectedPaymentIds([]);
    } else {
      setSelectedPaymentIds(dataListPayment.map((solution) => solution.id));
    }
  };

  const handleDeleteSelectedPayments = (id) => {
    try {
      console.log("Deleting selected payments...");

      if (selectedPaymentIds.length === 0) {
        console.log("No selected payments to delete.");
        return;
      }

      let currentIndex = 0;

      const deleteNextSolution = () => {
        if (currentIndex < selectedPaymentIds.length) {
          const paymentId = selectedPaymentIds[currentIndex];

          deletePaymentById(paymentId)
            .then(() => {
              console.log(`Payment with ID ${paymentId} deleted successfully`);
              currentIndex++;
              deleteNextSolution();
            })
            .catch((error) => {
              console.error(
                `Error deleting Payment with ID ${paymentId}: `,
                error
              );
              toast.error(
                `Error deleting Payment with ID ${paymentId}: `,
                error
              );
            });
        } else {
          setSelectedPaymentIds([]);
          toast.success("Selected Payment deleted successfully");
          setRefreshData((prev) => !prev);
        }
      };

      deleteNextSolution();
    } catch (error) {
      console.error("Failed to delete selected Payments: ", error);
      toast.error("Failed to delete selected Payments, Please try again later");
    }
  };

  const handleOpenCreatePayment = () => {
    navigate("/home/createPayment");
  };

  const handleOpenDetailPayment = (paymentId) => {
    navigate(`/home/editPayment/${paymentId}`);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleChangePageSize = (event) => {
    const newSize = parseInt(event.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    fetchDataListPayment();
  }, [fetchDataListPayment, refreshData]);

  return (
    <>
      <MDBContainer className="py-5 custom-container">
        <MDBNavbar expand="lg" style={{ backgroundColor: "#3399FF" }}>
          <MDBContainer fluid>
            <MDBNavbarBrand style={{ fontWeight: "bold", fontSize: "24px" }}>
              <ContentCopy style={{ marginRight: "20px", color: "#FFFFFF" }} />{" "}
              <span style={{ color: "#FFFFFF" }}>All Payments</span>
            </MDBNavbarBrand>
            <MDBNavbarNav className="ms-auto manager-navbar-nav justify-content-end align-items-center">
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#FFFFFF",
                }}
                onClick={() => handleOpenCreatePayment()}
              >
                <FaPlus /> New
              </MDBBtn>
              <MDBBtn
                color="#eee"
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#FFFFFF",
                }}
                onClick={() => handleDeleteSelectedPayments()}
              >
                <DeleteForever /> Delete
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
                  <MenuItem value="contractId">ContractId</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  <MenuItem value="numberOfTerms">NumberOfTerms</MenuItem>
                  <MenuItem value="note">Note</MenuItem>
                  <MenuItem value="initialPaymentAmount">
                    Initial Payment Amount
                  </MenuItem>
                  <MenuItem value="firstDateOfPayment">
                    First Date Of Payment
                  </MenuItem>
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
                      fetchDataListPayment();
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
        <div>
          <MDBTable className="align-middle mb-0" responsive>
            <MDBTableHead className="bg-light">
              <tr>
                {/* <th style={{ fontWeight: "bold", fontSize: "18px" }}>ID</th> */}
                <th style={{ fontWeight: "bold", fontSize: "18px" }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedPaymentIds.length === dataListPayment.length
                    }
                    onChange={handleSelectAllPayments}
                  />
                </th>

                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  // onClick={() => handleSortChange("contractId")}
                  title="Contract Name"
                  className="sortable-header"
                >
                  Contract Name
                  {/* {sortBy === "contractId" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))} */}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("description")}
                  className="sortable-header"
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
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("numberOfTerms")}
                  className="sortable-header"
                >
                  Terms
                  {sortBy === "numberOfTerms" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("firstDateOfPayment")}
                  className="sortable-header"
                >
                  First Date
                  {sortBy === "numberOfTerms" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("duration")}
                  className="sortable-header"
                >
                  Duration
                  {sortBy === "numberOfTerms" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  className="sortable-header"
                >
                  Amount
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("note")}
                  className="sortable-header"
                >
                  Note
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("isFullyPaid")}
                  className="sortable-header"
                >
                  Fully Paid
                  {sortBy === "isFullyPaid" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("createdAt")}
                  className="sortable-header"
                >
                  Created
                  {sortBy === "createdAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th
                  style={{ fontWeight: "bold", fontSize: "14px" }}
                  onClick={() => handleSortChange("modifiedAt")}
                  className="sortable-header"
                >
                  Last Update
                  {sortBy === "modifiedAt" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropDown />
                    ) : (
                      <ArrowDropUp />
                    ))}
                </th>
                <th style={{ fontWeight: "bold", fontSize: "14px" }}></th>
              </tr>
            </MDBTableHead>
            {loading ? (
              <MDBTableBody className="bg-light">
                <tr>
                  <td>
                    <CircularLoading />
                  </td>
                </tr>
              </MDBTableBody>
            ) : (
              <MDBTableBody className="bg-light">
                {dataListPayment.map((Payment, index) => {
                  const isSelected = selectedPaymentIds.includes(Payment.id);
                  return (
                    <tr key={index}>
                      {/* <td>{Payment.id}</td> */}
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectPayment(Payment.id)}
                        />
                      </td>
                      <td>{Payment.contract.name}</td>
                      <td
                        className="tooltip-cell"
                        title={`${Payment.description} `}
                      >
                        {Payment.description}
                      </td>
                      <td>{Payment.numberOfTerms}</td>
                      <td>{formatDate(Payment.firstDateOfPayment)}</td>
                      <td>{Payment.duration}</td>
                      <td>
                        {formatCurrency(Payment.initialPaymentAmount)} VND
                      </td>
                      <td title={`${Payment.note}`}>
                        {Payment.note.length > 15
                          ? `${Payment.note.slice(0, 15)}...`
                          : Payment.note}
                      </td>
                      <td>
                        {Payment.isFullyPaid ? (
                          <>
                            <img
                              src={Paid}
                              alt="Paid"
                              className="payment-icon"
                            />
                            <span className="payment-text">Paid</span>
                          </>
                        ) : (
                          <>
                            <img
                              src={UnPaid}
                              alt="Not Paid"
                              className="payment-icon"
                            />
                            <span className="payment-text">Not Paid</span>
                          </>
                        )}
                      </td>
                      <td>{formatDate(Payment.createdAt)}</td>
                      <td>{formatDate(Payment.modifiedAt)}</td>
                      <td>
                        <Edit
                          onClick={() => handleOpenDetailPayment(Payment.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </MDBTableBody>
            )}
          </MDBTable>
        </div>
      </MDBContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
        />
      </Box>
    </>
  );
};

export default PaymentList;
