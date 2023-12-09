import React from "react";
import {
  Button,
  Grid,
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
import { DataGrid } from "@mui/x-data-grid";
import { formatDate } from "../../../helpers/FormatDate";
import { getPaymentTerm } from "../../../../app/api/payment";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteSweep, EditCalendar } from "@mui/icons-material";

const PaymentContract = ({ dataPayment, loading }) => {
  
  const navigate = useNavigate();
  const [dataPaymentTerm, setDataPaymentTerm] = useState([]);
  PaymentContract.propTypes = {
    dataPayment: PropTypes.object,
    loading: PropTypes.bool.isRequired,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contractData = await getPaymentTerm(dataPayment.id);
        setDataPaymentTerm(contractData);
      } catch (error) {
        console.error("Error fetching contract data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenCreatePayment = () => {
    navigate("/home/createPayment");
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
                        style={{ backgroundColor: '#2196F3', color: '#fff', marginRight: 10 }}
                      >
                       <EditCalendar  style={{marginRight: 10}}/> Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className="button-payment"
                        style={{ backgroundColor: '#f44336', color: '#fff' }}
                      >
                        <DeleteSweep style={{marginRight: 10}}/> Remove
                      </Button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            {dataPaymentTerm.id ? (
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
                    {dataPayment.description}
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
                    {dataPayment.duration}
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
                    {formatDate(dataPayment.firstDateOfPayment)}
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
                    {dataPayment.numberOfTerms}
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
                    {dataPayment.initialPaymentAmount}
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
                    {dataPayment.isFullyPaid}
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
                    {dataPayment.note}
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
                    {dataPayment.paymentFinishTime}
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
                      colSpan={columns.length + 1} // Span the entire width of the DataGrid
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
      </Grid>
    </div>
  );
};

export default PaymentContract;
