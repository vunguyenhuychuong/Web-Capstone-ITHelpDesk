import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {
  createContract,
  getAllAccountList,
  getAllCompanyList,
  getParentContract,
} from "../../../app/api/contract";
import Slider from "react-slick";

const CreateContract = () => {
  const navigate = useNavigate();
  const [dataParentContract, setDataParentContract] = useState([]);
  const [dataAccountList, setDataAccountList] = useState([]);
  const [dataCompanyList, setDataCompanyList] = useState([]);
  const [data, setData] = useState({
    name: "",
    description: "",
    value: 1000,
    startDate: "",  
    endDate: "",
    parentContractId: null,
    accountantId: 1,
    companyId: 1,
    attachmentUrls: [],
  });
  const [selectedFile, setSelectedFile] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    description: "",
    value: "",
  });

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const fetchDataCreateContract = async () => {
    try {
      const contractParent = await getParentContract();
      const accountList = await getAllAccountList();
      const companyList = await getAllCompanyList();
      setDataParentContract(contractParent);
      setDataAccountList(accountList);
      setDataCompanyList(companyList);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "parentContractId" ||
      name === "accountantId" ||
      name === "companyId"
    ) {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else if (name === "value") {
      const numericValue = parseInt(value);
      if (numericValue >= 10000 && numericValue <= 99999999) {
        setData((prevData) => ({ ...prevData, [name]: numericValue }));
        setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      } else {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "Value must be between 10000 and 99999999",
        }));
      }
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files;
    setSelectedFile([...file]);

    const promises = [];
    const previewUrls = [];

    for (let i = 0; i < file.length; i++) {
      const currentFile = file[i];
      const reader = new FileReader();

      promises.push(
        new Promise((resolve) => {
          reader.onloadend = () => {
            previewUrls.push(reader.result);
            resolve();
          };
          reader.readAsDataURL(currentFile);
        })
      );
    }

    Promise.all(promises).then(() => {
      setImagePreviewUrl(previewUrls);
    });

    setIsImagePreviewOpen(true);
  };

  const validateDate = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return false;
    }
    const isBefore = moment(startDate).isBefore(endDate);
    return isBefore;
  };

  const handleSubmitContract = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.name) {
      errors.name = "Name contract is required";
    }
    if (!data.description) {
      errors.description = "Description contract is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const isDataValid = validateDate(data.startDate, data.endDate);
    if (!isDataValid) {
      toast.info("Start Date must be earlier than End Date.", {
        autoClose: 2000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const formattedReviewDate = moment(data.startDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    const formattedExpiredDate = moment(data.endDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );

    setIsSubmitting(true);
    try {
      let attachmentUrls = data.attachmentUrls || []; 
      if (selectedFile.length > 0) {
        const storage = getStorage();
        const promises = [];

        for(let i = 0; i < selectedFile.length; i++) {
          const file = selectedFile[i];
          const storageRef = ref(storage, `images/${file.name}`);
          await uploadBytes(storageRef, file);

          const downloadURL = await getDownloadURL(storageRef);
          attachmentUrls.push(downloadURL);
        }
      }

      const updatedData = {
        ...data,
        attachmentUrls: attachmentUrls,
        startDate: formattedReviewDate,
        endDate: formattedExpiredDate,
      };

      setData(updatedData);
      await createContract({
        name: data.name,
        description: data.description,
        value: data.value,
        startDate: formattedReviewDate,
        endDate: formattedExpiredDate,
        parentContractId: data.parentContractId,
        accountantId: data.accountantId,
        companyId: data.companyId,
        attachmentUrls: attachmentUrls,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/home/contractList`);
  };

  useEffect(() => {
    fetchDataCreateContract();
  }, []);

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
                    New Contract
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Create a new contract for assistance.
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
                  <span style={{ color: "red" }}>*</span>Name
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-control-text input-field"
                  value={data.name}
                  onChange={handleInputChange}
                />
                {fieldErrors.name && (
                  <div style={{ color: "red" }}>{fieldErrors.name}</div>
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
                  <span style={{ color: "red" }}>*</span>Description
                </h2>
              </Grid>
              <Grid item xs={9}>
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
                  Attachment
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="file"
                  name="file"
                  className="form-control input-field"
                  id="attachmentUrls"
                  multiple
                  onChange={handleFileChange}
                />
                {imagePreviewUrl && (
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
                        <span style={{ color: "red" }}>*</span>value(VND)
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="value"
                        type="text"
                        name="value"
                        className="form-control-text input-field"
                        value={data.value}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.value && (
                        <div style={{ color: "red" }}>{fieldErrors.value}</div>
                      )}
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
                        Parent Contract
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="parentContractId"
                        name="parentContractId"
                        className="form-select-custom"
                        value={data.parentContractId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Parent Contract</option>
                        {dataParentContract
                          .filter((parentContract) => parentContract.id !== "")
                          .map((parentContract) => (
                            <option
                              key={parentContract.id}
                              value={parentContract.id}
                            >
                              {parentContract.name}
                            </option>
                          ))}
                      </select>
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
                        Start Date
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
                        End Date
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
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
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
                        <span style={{ color: "red" }}>*</span>Accountant
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="accountantId"
                        name="accountantId"
                        className="form-select-custom"
                        value={data.accountantId}
                        onChange={handleInputChange}
                      >
                        {dataAccountList
                          .filter((accountant) => accountant.id !== "")
                          .map((accountant) => (
                            <option key={accountant.id} value={accountant.id}>
                              {accountant.lastName} {accountant.firstName}
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
                        Company{" "}
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="companyId"
                        name="companyId"
                        className="form-select-custom"
                        value={data.companyId}
                        onChange={handleInputChange}
                      >
                        {dataCompanyList
                          .filter((company) => company.id !== "")
                          .map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.companyName}
                            </option>
                          ))}
                      </select>
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
                  onClick={handleSubmitContract}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary custom-btn-margin"
                  onClick={handleGoBack}
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
        <DialogTitle >
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
          <Slider {...settings}>
            {imagePreviewUrl.map((url, index) => (
              <div key={index}>
                <img
                  src={url}
                  alt={`Attachment Preview ${index + 1}`}
                  style={{ width: "100%" }}
                />
              </div>
            ))}
          </Slider>
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default CreateContract;
