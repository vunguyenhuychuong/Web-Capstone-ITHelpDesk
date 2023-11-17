import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import { Grid, TextField } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { createPayment } from "../../../app/api/payment";

const CreatePayment = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    contractId: 1,
    description: "",
    numberOfTerms: 0,
    firstDateOfPayment: "",
    duration: 0,
    initialPaymentAmount: 0,
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstDateOfPayment, setStartDate] = useState(moment());

  const handleReviewDateOfPayment = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setStartDate(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      firstDateOfPayment: formattedDate,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "contractId" ||
      name === "numberOfTerms" ||
      name === "initialPaymentAmount" ||
      name === "duration"
    ) {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const formattedReviewDate = moment(data.firstDateOfPayment).format(
        "YYYY-MM-DDTHH:mm:ss"
      );

      const updatedData = {
        ...data,
        firstDateOfPayment: formattedReviewDate,
      };

      setData(updatedData);
      const response = await createPayment({
        contractId: data.contractId,
        description: data.description,
        numberOfTerms: data.numberOfTerms,
        firstDateOfPayment: data.firstDateOfPayment,
        duration: data.duration,
        initialPaymentAmount: data.initialPaymentAmount,
        note: data.note,
      });
      if (
        response.data.isError &&
        response.data.responseException.exceptionMessage
      ) {
        console.log(response.data.responseException.exceptionMessage);
      } else {
        toast.success("Payment created successfully");
      }
      toast.success("Payment created successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/home/paymentList`);
  };

  return (
    <Grid
      container
      style={{
        border: "1px solid #ccc",
        paddingRight: "10px",
        paddingLeft: "10px",
      }}
    >
      <Grid item xs={12}>
        <MDBCol md="12">
          <MDBRow className="border-box">
            <MDBCol md="5" className="mt-2">
              <div className="d-flex align-items-center">
                <button type="button" className="btn btn-link icon-label">
                  <ArrowBack
                    onClick={handleGoBack}
                    className="arrow-back-icon"
                  />
                </button>

                <h2 style={{ marginLeft: "10px" }}>New Payment</h2>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBRow className="mb-4">
          <MDBCol
            md="12"
            className="mt-4"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Grid container justifyContent="flex-end">
              {" "}
              {/* Set justifyContent to 'flex-end' */}
              <Grid item xs={3}>
                <h2 className="align-right">
                  <span style={{ color: "red" }}>*</span>contractId
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  id="contractId"
                  type="number"
                  name="contractId"
                  className="form-control input-field"
                  value={data.contractId}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={3}>
                <h2 className="align-right">
                  <span style={{ color: "red" }}>*</span>Description
                </h2>
              </Grid>
              <Grid item xs={9}>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  className="form-control input-field-2"
                  rows="6"
                  value={data.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={3}>
                <h2 className="align-right">numberOfTerms</h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  id="numberOfTerms"
                  type="number"
                  name="numberOfTerms"
                  className="form-control input-field"
                  value={data.numberOfTerms}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2 className="align-right">
                        <span style={{ color: "red" }}>*</span>duration
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="duration"
                        type="text"
                        name="duration"
                        className="form-control input-field"
                        value={data.duration}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <h2 className="align-right">initialPaymentAmount</h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="initialPaymentAmount"
                        type="text"
                        name="initialPaymentAmount"
                        className="form-control input-field"
                        value={data.initialPaymentAmount}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2 className="align-right">
                        <span style={{ color: "red" }}>*</span>note
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="note"
                        type="text"
                        name="note"
                        className="form-control input-field"
                        value={data.note}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2 className="align-right">firstDateOfPayment</h2>
                    </Grid>
                    <Grid item xs={5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          slotProps={{
                            textField: {
                              helperText: `${firstDateOfPayment}`,
                            },
                          }}
                          value={firstDateOfPayment}
                          onChange={(newValue) =>
                            handleReviewDateOfPayment(newValue)
                          }
                          renderInput={(props) => <TextField {...props} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBCol>
        </MDBRow>

        <MDBCol md="12">
          <MDBRow className="border-box">
            <MDBCol md="12" className="mt-2 mb-2">
              <div className="d-flex justify-content-center align-items-center">
                <button
                  type="button"
                  className="btn btn-primary custom-btn-margin"
                  onClick={handleSubmitPayment}
                  disabled={isSubmitting}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary custom-btn-margin"
                >
                  Save and Approve
                </button>
                <button
                  type="button"
                  className="btn btn-secondary custom-btn-margin"
                >
                  Cancel
                </button>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </Grid>
    </Grid>
  );
};

export default CreatePayment;
