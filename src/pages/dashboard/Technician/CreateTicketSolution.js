import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import { Dialog, DialogContent, DialogTitle, Grid, IconButton, Switch, TextField } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getDataCategories } from "../../../app/api/category";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createTicketSolution } from "../../../app/api/ticketSolution";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getDataUser } from "../../../app/api";

const CreateTicketSolution = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    content: "",
    categoryId: 1,
    ownerId: 1,
    reviewDate: "",
    expiredDate: "",
    keyword: "",
    internalComments: "",
    isPublic: true,
    attachmentUrl: "",
  });

  const [dataCategories, setDataCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewDate, setReviewDate] = useState(moment());
  const [expiredDate, setExpiredDate] = useState(moment());
  const [dataUsers, setDataUsers] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    content: "",
  });

  const handleReviewDateChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setReviewDate(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      reviewDate: formattedDate,
    }));
  };

  const handleExpiredDateChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setExpiredDate(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      expiredDate: formattedDate,
    }));
  };

  const fetchDataSolution = async () => {
    try {
      const fetchCategories = await getDataCategories();
      const fetchUsers = await getDataUser();
      setDataCategories(fetchCategories);
      setDataUsers(fetchUsers);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchDataSolution();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId" || name === "ownerId") {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

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

  const validateDate = (reviewDate, expiredDate) => {
    if (!reviewDate || !expiredDate) {
      return false; // If either date is missing, return false
    }
    return moment(reviewDate).isBefore(expiredDate);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.title) {
      errors.title = "Title Ticket is required";
    }

    if (!data.content) {
      errors.content = "Content is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsSubmitting(true);
    try {
      let attachmentUrl = data.attachmentUrl;
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);
        attachmentUrl = await getDownloadURL(storageRef);
      }

      const isDataValid = validateDate(data.reviewDate, data.expiredDate);
      if (!isDataValid) {
        toast.warning(
          "scheduledStartTime must be earlier than scheduledEndTime.",
          {
            autoClose: 2000,
            hideProgressBar: false,
            position: toast.POSITION.TOP_CENTER,
          }
        );
        return;
      }

      const formattedReviewDate = moment(data.reviewDate).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const formattedExpiredDate = moment(data.expiredDate).format(
        "YYYY-MM-DDTHH:mm:ss"
      );

      const updatedData = {
        ...data,
        attachmentUrl: attachmentUrl,
        reviewDate: formattedReviewDate,
        expiredDate: formattedExpiredDate,
      };

      setData(updatedData);
      const response = await createTicketSolution({
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        ownerId: data.ownerId,
        reviewDate: formattedReviewDate,
        expiredDate: formattedExpiredDate,
        keyword: data.keyword,
        internalComments: data.internalComments,
        isPublic: data.isPublic,
        attachmentUrl: attachmentUrl,
      });
      if (
        response.data.isError &&
        response.data.responseException.exceptionMessage
      ) {
        console.log(response.data.responseException.exceptionMessage);
      } else {
        toast.success("Ticket created successfully");
      }
      toast.success("Ticket created successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublicToggle = () => {
    setData((prevData) => ({
      ...prevData,
      isPublic: !prevData.isPublic,
    }));
  };

  const handleGoBack = () => {
    navigate(`/home/ticketSolution`);
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
                    New Solution
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Create a new solution for assistance.
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
              {/* Set justifyContent to 'flex-end' */}
              <Grid item xs={3}>
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
              <Grid item xs={9}>
                <input
                  id="title"
                  type="text"
                  name="title"
                  className="form-control input-field"
                  value={data.title}
                  onChange={handleInputChange}
                />
                {fieldErrors.title && (
                  <div style={{ color: "red" }}>{fieldErrors.title}</div>
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
                  <span style={{ color: "red" }}>*</span>Content
                </h2>
              </Grid>
              <Grid item xs={9}>
                <textarea
                  type="text"
                  id="content"
                  name="content"
                  className="form-control input-field-2"
                  rows="6"
                  value={data.content}
                  onChange={handleInputChange}
                />
                {fieldErrors.content && (
                  <div style={{ color: "red" }}>{fieldErrors.content}</div>
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
                        <span style={{ color: "red" }}>*</span>Category
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="categoryId"
                        name="categoryId"
                        className="form-select"
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
                        Solution Owner
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="ownerId"
                        name="ownerId"
                        className="form-select"
                        value={data.ownerId}
                        onChange={handleInputChange}
                      >
                        {dataUsers
                          .filter((owner) => owner.id !== "")
                          .map((owner) => (
                            <option key={owner.id} value={owner.id}>
                              {owner.lastName} {owner.firstName}
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
                        Review Date
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          slotProps={{
                            textField: {
                              helperText: `${reviewDate}`,
                            },
                          }}
                          value={reviewDate}
                          onChange={(newValue) =>
                            handleReviewDateChange(newValue)
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
                        Expiry Date
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          slotProps={{
                            textField: {
                              helperText: `${expiredDate}`,
                            },
                          }}
                          value={expiredDate}
                          onChange={(newValue) =>
                            handleExpiredDateChange(newValue)
                          }
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
                    Keywords
                  </h2>
                </Grid>
                <Grid item xs={9}>
                  <input
                    id="keyword"
                    type="text"
                    name="keyword"
                    className="form-control input-field"
                    value={data.keyword}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={9}>
                  <p className="input-field-description">
                    * Keywords should be comma separated <br /> Choosing a
                    relevant keyword for a solution will improve its search
                    capability, for example, Printer, toner, paper
                  </p>
                  <h5>Public</h5>
                  <Switch
                    checked={data.isPublic}
                    onChange={handlePublicToggle}
                    color="primary"
                  />
                </Grid>
              </Grid>
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
                    Internal Comments
                  </h2>
                </Grid>
                <Grid item xs={9}>
                  <textarea
                    id="internalComments"
                    type="text"
                    name="internalComments"
                    className="form-control input-field"
                    value={data.internalComments}
                    onChange={handleInputChange}
                    row={4}
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
                   {isSubmitting ? 'Submitting...' : 'Save'}
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
        onClose={closeImagePreview}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Image Preview
          <IconButton
            edge="end"
            color="inherit"
            onClick={closeImagePreview}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img
            src={imagePreviewUrl}
            alt="Attachment Preview"
            style={{ width: "100%" }}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default CreateTicketSolution;
