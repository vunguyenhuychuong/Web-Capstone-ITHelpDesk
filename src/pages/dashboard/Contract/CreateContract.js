import React, { useEffect, useState } from "react";
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
} from "../../../app/api/contract";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { getAllService } from "../../../app/api/service";
import { DatePicker } from "@mui/x-date-pickers";
import { convertPriceToNumber, formatPrice } from "../../../utils/helper";

const currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);
const CreateContract = () => {
  const navigate = useNavigate();
  const [dataParentContract, setDataParentContract] = useState([]);
  const [dataAccountList, setDataAccountList] = useState([]);
  const [dataCompanyList, setDataCompanyList] = useState([]);
  const [dataServiceList, setDataServiceList] = useState([]);
  const [data, setData] = useState({
    contractNumber: "",
    name: "",
    description: "",
    value: formatPrice(10000),
    startDate: moment(currentDate).format("YYYY-MM-DDTHH:mm:ss"),
    endDate: "",
    parentContractId: null,
    // accountantId: 1,
    // companyId: 1,
    duration: 3,
    attachmentUrls: [],
    serviceIds: [],
  });
  const [selectedFile, setSelectedFile] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    contractNumber: "",
    name: "",
    description: "",
    value: "",
  });

  // Dropdown service
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

  const images = imagePreviewUrl?.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

  const fetchDataCreateContract = async () => {
    try {
      // const contractParent = await getParentContract();
      // const accountList = await getAllAccountList();
      const companyList = await getAllCompanyList();
      const serviceList = await getAllService();
      // setDataParentContract(contractParent);
      // setDataAccountList(accountList);
      setDataCompanyList(companyList);
      setDataServiceList(serviceList);
      setData((prevInputs) => ({
        ...prevInputs,
        companyId: companyList[0].id,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleStartDateChange = (newDate) => {
    const newDateWithHours = new Date(newDate).setHours(0, 0, 0, 0);
    const formattedDate = moment(newDateWithHours).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
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
    const serviceIds = data.serviceIds?.map((service) => {
      return dataServiceList.find((d) => d.description === service).id;
    });
    return serviceIds;
  };

  const handleSubmitContract = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.contractNumber) {
      errors.contractNumber = "Description contract is required";
    }
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
    // if (!isDataValid) {
    //   toast.info("Start Date must be earlier than End Date.", {
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    //   return;
    // }

    const formattedStartDate = moment(data.startDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    const formattedExpiredDate = moment(data.endDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );

    setIsSubmitting(true);
    mapServiceDescriptionToId();
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
        startDate: formattedStartDate,
        // endDate: formattedExpiredDate,
      };

      setData(updatedData);
      const res = await createContract({
        contractNumber: data.contractNumber,
        name: data.name,
        description: data.description,
        value: convertPriceToNumber(data.value),
        startDate: formattedStartDate,
        // endDate: formattedExpiredDate,
        companyId: data.companyId,
        attachmentUrls: attachmentUrls,
        duration: data.duration,
        serviceIds: mapServiceDescriptionToId(),
      });
      if (res) {
        navigate("/home/contractList");
      }
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
                    className={{ width: "100%" }}
                  >
                    {dataServiceList?.map((name) => (
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
                          ?.map((parentContract) => (
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
                          ?.map((company) => (
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
                          ?.map((accountant) => (
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
                  onClick={handleSubmitContract}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Create"}
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

export default CreateContract;
