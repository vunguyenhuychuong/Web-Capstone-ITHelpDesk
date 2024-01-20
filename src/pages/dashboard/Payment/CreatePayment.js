import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import { Grid, TextField } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { createPayment } from "../../../app/api/payment";
import { getAllContractSelect } from "../../../app/api/contract";
import { numberOfDuration, numberOfTerms } from "../../helpers/tableComlumn";

const CreatePayment = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    contractId: 1,
    description: "",
    numberOfTerms: 0,
    firstDateOfPayment: "",
    duration: 0,
    initialPaymentAmount: 10000,
    note: "",
  });

  const [dataContract, setDataContract] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstDateOfPayment, setStartDate] = useState(moment());
  const [fieldErrors, setFieldErrors] = useState({
    description: "",
    initialPaymentAmount: "",
  });

  const handleReviewDateOfPayment = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setStartDate(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      firstDateOfPayment: formattedDate,
    }));
  };

  const fetchDataSelect = async () => {
    try {
      const dataContract = await getAllContractSelect();
      setDataContract(dataContract);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataSelect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "contractId" ||
      name === "numberOfTerms" ||
      name === "duration"
    ) {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else if (name === "initialPaymentAmount") {
      const numericValue = parseInt(value);
      if (numericValue >= 10000 && numericValue <= 99999999) {
        setData((prevData) => ({ ...prevData, [name]: numericValue }));
        setFieldErrors((prevData) => ({ ...prevData, [name]: "" }));
      } else {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Initial PaymentAmount must be between 10000 and 99999999",
        }));
      }
    } else if (name === "firstDateOfPayment" && !value) {
      const formattedCurrentDate = moment().format("YYYY-MM-DDTHH:mm:ss");
      const dayOfCurrentDate = moment().day();
      setData((prevData) => ({
        ...prevData,
        firstDateOfPayment: formattedCurrentDate,
        initialPaymentAmount: dayOfCurrentDate,
      }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.description) {
      errors.description = "Description contract is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

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
      await createPayment({
        contractId: data.contractId,
        description: data.description,
        numberOfTerms: data.numberOfTerms,
        firstDateOfPayment: data.firstDateOfPayment,
        duration: data.duration,
        initialPaymentAmount: data.initialPaymentAmount,
        note: data.note,
      });
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

                <div
                  style={{
                    marginLeft: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                  >
                    Create Payment
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Create a payment for assistance.
                  </span>
                </div>
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
              <Grid item xs={3}>
                <h2
                  className="align-right"
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  <span style={{ color: "red" }}>*</span>Contract
                </h2>
              </Grid>
              <Grid item xs={9}>
                <select
                  id="contractId"
                  name="contractId"
                  className="form-select-custom"
                  value={data.contractId}
                  onChange={handleInputChange}
                >
                  {dataContract
                    .filter((contract) => contract.id !== "")
                    .map((contract) => (
                      <option key={contract.id} value={contract.id}>
                        {contract.name || "null"}
                      </option>
                    ))}
                </select>
              </Grid>
              <Grid item xs={3} style={{ marginTop: "10px" }}>
                <h2
                  className="align-right"
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  <span style={{ color: "red" }}>*</span>Description
                </h2>
              </Grid>
              <Grid item xs={9} style={{ marginTop: "15px" }}>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  className="form-control-text input-field-2"
                  rows="6"
                  value={data.description}
                  onChange={handleInputChange}
                />
                {fieldErrors.description && (
                  <div style={{ color: "red" }}>{fieldErrors.description}</div>
                )}
              </Grid>
              <Grid item xs={3}>
                <h2
                  className="align-right"
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  Number Of Terms
                </h2>
              </Grid>
              <Grid item xs={9}>
                <select
                  id="numberOfTerms"
                  name="numberOfTerms"
                  className="form-select-custom"
                  value={data.numberOfTerms}
                  onChange={handleInputChange}
                >
                  {numberOfTerms
                    .filter((term) => term.id !== "")
                    .map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.name}
                      </option>
                    ))}
                </select>
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
                <Grid item xs={6} style={{ marginTop: "20px" }}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        <span style={{ color: "red" }}>*</span>duration
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="duration"
                        name="duration"
                        className="form-select-custom"
                        value={data.duration}
                        onChange={handleInputChange}
                      >
                        {numberOfDuration
                          .filter((duration) => duration.id !== "")
                          .map((duration) => (
                            <option key={duration.id} value={duration.id}>
                              {duration.name}
                            </option>
                          ))}
                      </select>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        Initial Payment Amount
                      </h2>
                    </Grid>
                    <Grid item xs={5} style={{ marginTop: "20px" }}>
                      <input
                        id="initialPaymentAmount"
                        type="number"
                        name="initialPaymentAmount"
                        className="form-control-text input-field"
                        value={data.initialPaymentAmount}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.initialPaymentAmount && (
                        <div style={{ color: "red" }}>
                          {fieldErrors.initialPaymentAmount}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        Note
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <textarea
                        type="text"
                        id="note"
                        name="note"
                        className="form-control-text input-field-2"
                        rows="3"
                        value={data.note}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        First Date Of Payment
                      </h2>
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
                  {isSubmitting ? "Submitting..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary custom-btn-margin"
                  onClick={() => handleGoBack()}
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
