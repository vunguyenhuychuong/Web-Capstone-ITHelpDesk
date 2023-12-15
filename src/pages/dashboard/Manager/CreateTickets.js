import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
} from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, Close } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  ImpactOptions,
  TicketStatusOptions,
  TypeOptions,
  UrgencyOptions,
  priorityOption,
} from "../../helpers/tableComlumn";
import { getDataCategories } from "../../../app/api/category";
import { getDataUser } from "../../../app/api";
import ModeApi from "../../../app/api/mode";
import { getAllServiceByCategory } from "../../../app/api/service";
import { createTicketByManager } from "../../../app/api/ticket";
import {
  fetchCity,
  fetchDistricts,
  fetchWards,
} from "../Customer/StepForm/fetchDataSelect";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CreateTickets = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [dataUser, setDataUser] = useState([]);
  const [isPeriodic, setIsPeriodic] = useState(false);
  const [data, setData] = useState({
    requesterId: 1,
    title: "",
    description: "",
    modeId: 1,
    serviceId: 1,
    impactDetail: "",
    ticketStatus: 0,
    priority: 0,
    impact: 0,
    urgency: 0,
    type: "Offline",
    street: "",
    ward: 0,
    district: 0,
    city: 0,
    isPeriodic: false,
    categoryId: 1,
    attachmentUrls: [],
  });
  const [dataCategories, setDataCategories] = useState([]);
  const [dataMode, setDataMode] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [dataLocation, setDataLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [categoryServices, setCategoryServices] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    description: "",
  });

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const fetchDataManager = async () => {
    try {
      const fetchCategories = await getDataCategories();
      const fetchUsers = await getDataUser();
      const fetchModes = await ModeApi.getMode();
      setDataCategories(fetchCategories);
      setDataUser(fetchUsers);
      setDataMode(fetchModes);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const handleToggle = () => {
    setIsPeriodic((prevIsPeriodic) => !prevIsPeriodic);
  };

  const handleCityChange = async (e) => {
    const { name, value } = e.target;
    handleInputChange(e);

    if (value) {
      const districtResponse = await fetchDistricts(value);
      setDistricts(districtResponse);
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
    }
  };

  const handleDistrictChange = async (e) => {
    const { name, value } = e.target;
    handleInputChange(e);

    if (value) {
      const wardResponse = await fetchWards(value);
      setWards(wardResponse);
    } else {
      setWards([]);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    if (
      name === "categoryId" ||
      name === "modeId" ||
      name === "serviceId" ||
      name === "requesterId"
    ) {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else if (
      name === "priority" ||
      name === "impact" ||
      name === "ticketStatus" ||
      name === "urgency"
    ) {
      const numericValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: numericValue }));
    } else if (["city", "district", "ward"].includes(name)) {
      const numericValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: numericValue }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
    if (name === "categoryId") {
      const selectedCategory = dataCategories.find(
        (category) => category.id === parseInt(value, 10)
      );
      const categoryIdValue = selectedCategory ? selectedCategory.id : null;
      console.log(categoryIdValue);
      setData((prevData) => ({ ...prevData, [name]: categoryIdValue }));

      const services = await getAllServiceByCategory(parseInt(value, 10));
      setCategoryServices(services);
    }

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityResponse = await fetchCity();
        setDataLocation(cityResponse);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchCity();
    fetchDataManager();
    fetchData();
  }, []);

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      requesterId: dataUser.length > 0 ? dataUser[0].id : 1,
    }));
  }, [dataUser]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFile([...files]);

    const promises = [];
    const previewUrls = [];

    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
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

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.title) {
      errors.title = "Title Ticket is required";
    }

    if (!data.description) {
      errors.description = "Description is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

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

        // await uploadBytes(storageRef, selectedFile);
        // attachmentUrl = await getDownloadURL(storageRef);
      }

      const updatedData = {
        ...data,
        attachmentUrls: attachmentUrls,
      };
      setData(updatedData);
      await createTicketByManager({
        requesterId: data.requesterId,
        title: data.title,
        description: data.description,
        modeId: data.modeId,
        serviceId: data.serviceId,
        impactDetail: data.impactDetail,
        ticketStatus: data.ticketStatus,
        priority: data.priority,
        impact: data.impact,
        urgency: data.urgency,
        type: data.type,
        street: data.street,
        ward: data.ward,
        district: data.district,
        city: data.city,
        isPeriodic: data.isPeriodic,
        categoryId: data.categoryId,
        attachmentUrls: attachmentUrls,
      });
      // navigate("home/listTicket");
      handleGoBack();
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/home/listTicket`);
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
                    onClick={() => handleGoBack(ticketId)}
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
                    New Ticket
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Create a new ticket for assistance.
                  </span>
                </div>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPeriodic}
                      onChange={handleToggle}
                      inputProps={{ "aria-label": "Periodic switch" }}
                    />
                  }
                  label="Periodic"
                  labelPlacement="start"
                />
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
                        <span style={{ color: "red" }}>*</span>Title
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="title"
                        type="text"
                        name="title"
                        className="form-control-text"
                        value={data.title}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.title && (
                        <div style={{ color: "red" }}>{fieldErrors.title}</div>
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
                        <span style={{ color: "red" }}>*</span>Requester
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="requesterId"
                        name="requesterId"
                        className="form-select-custom"
                        value={data.requesterId}
                        onChange={handleInputChange}
                      >
                        {dataUser.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.lastName} {user.firstName} - {user.username} -{" "}
                            {user.id}
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
                  id="attachmentUrl"
                  onChange={handleFileChange}
                  multiple
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
                        <span style={{ color: "red" }}>*</span>Mode Id
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="modeId"
                        name="modeId"
                        className="form-select-custom"
                        value={data.modeId}
                        onChange={handleInputChange}
                      >
                        {dataMode
                          .filter((mode) => mode.id !== "")
                          .map((mode) => (
                            <option key={mode.id} value={mode.id}>
                              {mode.name}
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
                        Category
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="categoryId"
                        name="categoryId"
                        className="form-select-custom"
                        value={data.categoryId}
                        onChange={handleInputChange}
                      >
                        {dataCategories
                          .filter((category) => category.id !== "")
                          .map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
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
                        Urgency
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="urgency"
                        name="urgency"
                        className="form-select-custom"
                        value={data.urgency}
                        onChange={handleInputChange}
                      >
                        {UrgencyOptions.filter(
                          (urgency) => urgency.id !== ""
                        ).map((urgency) => (
                          <option key={urgency.id} value={urgency.id}>
                            {urgency.name}
                          </option>
                        ))}
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
                        Service
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="serviceId"
                        name="serviceId"
                        className="form-select-custom"
                        value={data.serviceId}
                        onChange={handleInputChange}
                      >
                        {categoryServices.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.description}
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
                        Ticket Status
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="ticketStatus"
                        name="ticketStatus"
                        className="form-select-custom"
                        value={data.ticketStatus}
                        onChange={handleInputChange}
                      >
                        {TicketStatusOptions.map((ticketStatus) => (
                          <option key={ticketStatus.id} value={ticketStatus.id}>
                            {ticketStatus.name}
                          </option>
                        ))}
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
                        Priority
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="priority"
                        name="priority"
                        className="form-select-custom"
                        onChange={handleInputChange}
                      >
                        {priorityOption.map((priorityItem) => (
                          <option
                            key={priorityItem.id}
                            value={parseInt(priorityItem.id, 10)}
                          >
                            {priorityItem.name}
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
                        Impact
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="impact"
                        name="impact"
                        className="form-select-custom"
                        value={data.impact}
                        onChange={handleInputChange}
                      >
                        {ImpactOptions.map((impact) => (
                          <option key={impact.id} value={impact.id}>
                            {impact.name}
                          </option>
                        ))}
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
                        Type
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="type"
                        name="type"
                        className="form-select-custom"
                        onChange={handleInputChange}
                      >
                        {TypeOptions.map((type) => (
                          <option key={type.id} value={parseInt(type.id, 10)}>
                            {type.name}
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
                        City
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="city"
                        name="city"
                        className="form-select-custom"
                        value={data.city}
                        onChange={handleCityChange}
                      >
                        {dataLocation.map((city) => (
                          <option key={city.code} value={city.code}>
                            {city.name}
                          </option>
                        ))}
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
                        District
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="district"
                        name="district"
                        className="form-select-custom"
                        value={data.district}
                        onChange={handleDistrictChange}
                      >
                        {districts.map((district) => (
                          <option key={district.code} value={district.code}>
                            {district.name}
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
                        Ward
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="ward"
                        name="ward"
                        className="form-select-custom"
                        value={data.ward}
                        onChange={handleInputChange}
                      >
                        {wards.map((ward) => (
                          <option key={ward.code} value={ward.code}>
                            {ward.name}
                          </option>
                        ))}
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
                        Street
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        id="street"
                        type="text"
                        name="street"
                        className="form-control-text"
                        value={data.street}
                        onChange={handleInputChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginTop: "15px" }}
              >
                <Grid item xs={3}>
                  <h2
                    className="align-right"
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <span style={{ color: "red" }}>*</span>ImpactDetail
                  </h2>
                </Grid>
                <Grid item xs={9}>
                  <textarea
                    id="impactDetail"
                    type="text"
                    name="impactDetail"
                    row="2"
                    className="form-control-text"
                    value={data.impactDetail}
                    onChange={handleInputChange}
                  />
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
                  onClick={handleSubmitTicket}
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

export default CreateTickets;
