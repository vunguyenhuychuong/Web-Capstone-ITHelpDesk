import React, { useEffect, useState } from "react";
import "../../../../assets/css/ticketSolution.css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, Close } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  getAllAccountant,
  updateContractReNew,
} from "../../../../app/api/contract";
import moment from "moment";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const CreateRenewContract = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();
  const [data, setData] = useState({
    name: "",
    description: "",
    value: 1000000,
    startDate: "",
    endDate: "",
    accountantId: 1,
    attachmentUrls: [],
  });
  const [dataAccountant, setDataAccountant] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    description: "",
  });

  const fetchDataSubmit = async () => {
    try {
      const res = await getAllAccountant();
      setDataAccountant(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartDateChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setStartDate(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      startDate: formattedDate,
    }));
  };

  const handleEndDateChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setEndDate(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      endDate: formattedDate,
    }));
  };

  const images = imagePreviewUrl.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "accountantId") {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else if (name === "value") {
      const numericValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: numericValue }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  useEffect(() => {
    fetchDataSubmit();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const closeImagePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const validateDate = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return false;
    }
    return moment(startDate).isBefore(endDate);
  };

  const handleSubmitContractRenew = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.name) {
      errors.name = "Name Contract is required";
    }

    if (!data.description) {
      errors.description = "Description is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const formattedStartDate = moment(data.startDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    const formattedEndDate = moment(data.endDate).format("YYYY-MM-DDTHH:mm:ss");

    const isDataValid = validateDate(formattedStartDate, formattedEndDate);
    if (!isDataValid) {
      toast.warning("Start Date must be earlier than End Date.", {
        autoClose: 2000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let attachmentUrls = data.attachmentUrls;
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);
        attachmentUrls = await getDownloadURL(storageRef);
      }

      const updatedData = {
        ...data,
        attachmentUrls: attachmentUrls,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };

      setData(updatedData);
      const response = await updateContractReNew(
        {
          name: data.name,
          description: data.description,
          value: data.value,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          accountantId: data.accountantId,
          attachmentUrls: attachmentUrls,
        },
        contractId
      );
      if (
        response.data.isError &&
        response.data.responseException.exceptionMessage
      ) {
        console.log(response.data.responseException.exceptionMessage);
      } else {
        toast.success("Contract Renew successfully");
      }
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/home/contractList/`);
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
                    onClick={() => handleGoBack(contractId)}
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
                    Renew Contract
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Renew Contract for assistance.
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
              {" "}
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
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
                        <span style={{ color: "red" }}>*</span>Name
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        className="form-control"
                        value={data.name}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.name && (
                        <div style={{ color: "red" }}>{fieldErrors.name}</div>
                      )}
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
                        <span style={{ color: "red" }}>*</span>Accountant
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="accountantId"
                        name="accountantId"
                        className="form-select"
                        value={data.accountantId}
                        onChange={handleInputChange}
                      >
                        {dataAccountant.map((accountant) => (
                          <option key={accountant.id} value={accountant.id}>
                            {accountant.lastName} {accountant.firstName}
                          </option>
                        ))}
                      </select>
                    </Grid>
                  </Grid>
                </Grid>
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
                  Attachment
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="file"
                  name="file"
                  className="form-control input-field"
                  id="attachmentUrls"
                  onChange={handleFileChange}
                  value={data.attachmentUrls}
                />
                {imagePreviewUrl.length > 0 && (
                  <div
                    className="image-preview"
                    onClick={() => setIsImagePreviewOpen(true)}
                  >
                    <p className="preview-text">
                      Click here to view attachment
                    </p>
                  </div>
                )}
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
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
                        <span style={{ color: "red" }}>*</span>Start Date
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
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
                          marginBottom: "40px",
                        }}
                      >
                        <span style={{ color: "red" }}>*</span>End Date
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          slotProps={{
                            textField: {
                              helperText: `${endDate}`,
                            },
                          }}
                          value={endDate}
                          onChange={(newValue) => handleEndDateChange(newValue)}
                          renderInput={(props) => <TextField {...props} />}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginTop: "15px" }}
              >
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
                        Value(VND)
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="value"
                        type="text"
                        name="value"
                        className="form-control"
                        value={data.value}
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
                      ></h2>
                    </Grid>
                    <Grid item xs={5}></Grid>
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
                  onClick={handleSubmitContractRenew}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Save"}
                  Save
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
          <Gallery items={images} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default CreateRenewContract;
