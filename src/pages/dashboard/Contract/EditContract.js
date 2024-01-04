import React, { useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import moment from "moment";
import { toast } from "react-toastify";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import DateValidation from "../../helpers/DateValidation";
import {
  getAllAccountList,
  getAllCompanyList,
  getContractById,
  getParentContract,
  updateContract,
} from "../../../app/api/contract";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const EditContract = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();
  const [data, setData] = useState({
    name: "",
    description: "",
    value: 10000,
    startDate: "",
    endDate: "",
    parentContractId: 1,
    accountantId: 1,
    companyId: 1,
    attachmentUrls: [],
    status: 0,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataParentContract, setDataParentContract] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataAccountList, setDataAccountList] = useState([]);
  const [dataCompanyList, setDataCompanyList] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(data.startDate ? data.startDate : undefined)
  );
  const [endDate, setEndDate] = useState(
    moment(data.endDate ? data.endDate : undefined)
  );
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    description: "",
    value: "",
  });

  const images = data.attachmentUrls.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

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

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const contractData = await getContractById(contractId);
        setData((prevData) => ({
          ...prevData,
          name: contractData.name,
          description: contractData.description,
          value: contractData.value,
          startDate: contractData.startDate,
          endDate: contractData.endDate,
          parentContractId: contractData.parentContractId,
          accountantId: contractData.accountantId,
          attachmentUrls: contractData.attachmentUrls,
          companyId: contractData.companyId,
        }));

        setStartDate(moment(contractData.startDate));
        setEndDate(moment(contractData.endDate));
      } catch (error) {
        console.log("Error while fetching solution data", error);
      }
    };
    fetchContractData();
    fetchDataCreateContract();
    setImagePreviewUrl(data.attachmentUrls);
  }, [contractId, data.attachmentUrls]);

  const validateDate = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return false;
    }
    return moment(startDate).isBefore(endDate);
  };

  const handleEditContract = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.name) {
      errors.name = "Name Contract is required";
    }

    if (!data.description) {
      errors.description = "Description Contract is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const isDataValid = validateDate(data.startDate, data.endDate);
    if (!isDataValid) {
      toast.info("Review Date must be earlier than Expired Date.");
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

        for (let i = 0; i < selectedFile.length; i++) {
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
      await updateContract(
        {
          name: updatedData.name,
          description: updatedData.description,
          value: updatedData.value,
          startDate: formattedReviewDate,
          endDate: formattedExpiredDate,
          parentContractId: updatedData.parentContractId,
          accountantId: updatedData.accountantId,
          companyId: updatedData.companyId,
          attachmentUrls: attachmentUrls,
          status: updatedData.status,
        },
        contractId
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
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

  const handleGoBack = () => {
    navigate(`/home/contractList`);
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
            <MDBCol md="12" className="mt-2">
              <div className="d-flex align-items-center justify-content-between">
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
                      Edit Contract
                    </h2>
                    <span style={{ fontSize: "18px", color: "#888" }}>
                      Edit a contract for assistance.
                    </span>
                  </div>
                </div>
                <span
                  className="bg-round text-white px-2 py-1 ml-auto"
                  style={{
                    borderRadius: "15px",
                    backgroundColor: data.status === 1 ? "green" : "red",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {data.status === 1 ? "Active" : "Not Active"}
                </span>
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
                  type="content"
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
                  name="attachmentUrls"
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
                        <span style={{ color: "red" }}>*</span>value(VND)
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="value"
                        type="number"
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
                    <DateValidation
                      className="text-center"
                      startDate={data.startDate}
                      endDate={data.endDate}
                    />
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
                  onClick={handleEditContract}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Save"}
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

export default EditContract;
