import React, { useState } from "react";
import "../../../assets/css/ticketSolution.css";
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, Close } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import moment from "moment";
import { toast } from "react-toastify";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import DateValidation from "../../helpers/DateValidation";
import {
  getAllAccountList,
  getAllCompanyList,
  getContractById,
  getContractService,
  getParentContract,
  getServiceSelect,
  updateContract,
} from "../../../app/api/contract";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { convertPriceToNumber, formatPrice } from "../../../utils/helper";
import { getAllService } from "../../../app/api/service";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const EditContract = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();
  const [data, setData] = useState({
    id: 0,
    name: "",
    description: "",
    value: formatPrice(10000),
    startDate: "",
    endDate: "",
    parentContractId: 1,
    accountantId: 1,
    companyId: 1,
    attachmentUrls: [],
    status: 0,
    duration: 3,
    serviceIds: [],
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dataParentContract, setDataParentContract] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataAccountList, setDataAccountList] = useState([]);
  const [dataCompanyList, setDataCompanyList] = useState([]);
  const [dataContractService, setDataContractService] = useState([]);
  const [dataServiceList, setDataServiceList] = useState([]);
  const [startDate, setStartDate] = useState(
    moment(data.startDate ? data.startDate : undefined)
  );
  const [endDate, setEndDate] = useState(
    moment(data.endDate ? data.endDate : undefined)
  );
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
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

  const calculateMonthsDifference = (startDate, endDate) => {
    // Convert both "startDate" and "endDate" to a date format
    let start = new Date(startDate);
    let end = new Date(endDate);

    // Subtract the "startDate" from the "endDate" to get the difference in milliseconds
    let differenceInMilliseconds = end - start;

    // Convert the difference from milliseconds to months
    let differenceInMonths = differenceInMilliseconds / 2.628e9;

    // Round the result to the nearest integer
    differenceInMonths = Math.round(differenceInMonths);

    return differenceInMonths;
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
      // const contractParent = await getParentContract();
      // const accountList = await getAllAccountList();
      const companyList = await getAllCompanyList();
      const serviceList = await getAllService();
      // setDataParentContract(contractParent);
      // setDataAccountList(accountList);
      setDataServiceList(serviceList);
      setDataCompanyList(companyList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const contractData = await getContractById(contractId);
        const contractServiceData = await getContractService(contractId);
        setData((prevData) => ({
          ...prevData,
          id: contractData.id,
          contractNumber: contractData.contractNumber,
          name: contractData.name,
          description: contractData.description,
          value: formatPrice(contractData.value),
          startDate: contractData.startDate,
          endDate: contractData.endDate,
          // parentContractId: contractData.parentContractId,
          // accountantId: contractData.accountantId,
          attachmentUrls: contractData.attachmentUrls,
          companyId: contractData.companyId,
          serviceIds: contractServiceData.map(
            (contractService) => contractService.service.description
          ),
          duration: calculateMonthsDifference(
            contractData.startDate,
            contractData.endDate
          ),
        }));
        setDataContractService(contractServiceData);
        setStartDate(moment(contractData.startDate));
        setEndDate(moment(contractData.endDate));
      } catch (error) {
        console.log("Error while fetching solution data", error);
      }
    };
    fetchContractData();
    setImagePreviewUrl(data.attachmentUrls);
  }, [contractId]);

  useEffect(() => {
    fetchDataCreateContract();
  }, []);

  useEffect(() => {
    try {
      const previewUrls =
        imagePreviewUrl.length > 0 ? imagePreviewUrl : data.attachmentUrls;
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
  }, [imagePreviewUrl, data]);

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
    // if (!isDataValid) {
    //   toast.info("Review Date must be earlier than Expired Date.");
    //   return;
    // }

    const formattedReviewDate = moment(data.startDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    const formattedExpiredDate = moment(data.endDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );

    setIsSubmitting(true);
    try {
      let attachmentUrls = data.attachmentUrls || [];
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

      const updatedData = {
        ...data,
        attachmentUrls: attachmentUrls,
        startDate: formattedReviewDate,
        endDate: formattedExpiredDate,
      };
      setData(updatedData);
      const res = await updateContract(
        {
          contractNumber: updatedData.contractNumber,
          name: updatedData.name,
          description: updatedData.description,
          value: convertPriceToNumber(updatedData.value),
          startDate: formattedReviewDate,
          duration: updatedData.duration,
          // endDate: formattedExpiredDate,
          // parentContractId: updatedData.parentContractId,
          // accountantId: updatedData.accountantId,
          companyId: updatedData.companyId,
          attachmentUrls: attachmentUrls,
          // status: updatedData.status,
          serviceIds: mapServiceDescriptionToId(data.serviceIds),
        },
        contractId
      );
      if (res) {
        handleGoBack();
      }
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
      if (value !== "") {
        var numericValue = value.replace(/[^0-9]/g, "");

        if (numericValue > 0) {
          setData((prevData) => ({
            ...prevData,
            [name]: formatPrice(numericValue),
          }));
          setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        } else {
          setData((prevData) => ({
            ...prevData,
            [name]: formatPrice(numericValue),
          }));
          // setFieldErrors((prevErrors) => ({
          //   ...prevErrors,
          //   [name]: "Value must be between 10000 and 99999999",
          // }));
        }
      } else {
        setData((prevData) => ({
          ...prevData,
          [name]: formatPrice(0),
        }));
      }
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };
  const handleServiceListChange = (event) => {
    const {
      target: { value },
    } = event;
    setData((prevInputs) => ({
      ...prevInputs,
      serviceIds: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const mapServiceDescriptionToId = () => {
    const serviceIds = data.serviceIds.map((service) => {
      return dataServiceList.find((d) => d.description === service).id;
    });
    return serviceIds;
  };

  const handleGoBack = () => {
    navigate(`/home/detailContract/${data.id}`);
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
                  <span style={{ color: "red" }}>*</span>Contract Number
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  id="contractNumber"
                  type="text"
                  name="contractNumber"
                  className="form-control-text input-field"
                  value={data.contractNumber}
                  onChange={handleInputChange}
                />
                {fieldErrors.contractNumber && (
                  <div style={{ color: "red" }}>
                    {fieldErrors.contractNumber}
                  </div>
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
                {imagePreviewUrl?.length > 0 && (
                  <div
                    className="image-preview"
                    onClick={() => setIsImagePreviewOpen(true)}
                  >
                    <p className="preview-text">
                      Click here to view current attachments
                    </p>
                  </div>
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
                  Services{" "}
                </h2>
              </Grid>
              <Grid item xs={9}>
                <FormControl style={{ width: "100%" }}>
                  <InputLabel id="demo-multiple-checkbox-label">
                    Services
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={data.serviceIds}
                    onChange={handleServiceListChange}
                    input={<OutlinedInput label="Services" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                    sx={{ width: "100%", maxWidth: "65vw" }}
                  >
                    {dataServiceList.map((name) => (
                      <MenuItem key={name.id} value={name.description}>
                        <Checkbox
                          checked={
                            data.serviceIds.indexOf(name.description) > -1
                          }
                        />
                        <ListItemText
                          primary={name.description}
                          className="text-wrap"
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px", marginTop: "20px" }}
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
                        <span style={{ color: "red" }}>*</span>Duration
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
                        <option value={3}>3 months</option>
                        <option value={6}>6 months</option>
                        <option value={12}>12 months</option>
                        <option value={24}>24 months</option>
                      </select>
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

                {/* <Grid item xs={6}>
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
                </Grid> */}
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
                        <DatePicker
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
                {/* <Grid item xs={6}>
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
                </Grid> */}
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
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
                {/* <Grid item xs={6}>
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
                </Grid> */}
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
