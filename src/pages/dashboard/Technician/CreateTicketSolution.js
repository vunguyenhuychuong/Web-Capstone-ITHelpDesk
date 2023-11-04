import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import { Grid, Switch, TextField } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack } from "@mui/icons-material";
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

    if (name === "categoryId") {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const validateDate = (reviewDate, expiredDate) => {
    if (!reviewDate || !expiredDate) {
      return false; // If either date is missing, return false
    }
    return moment(reviewDate).isBefore(expiredDate);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!data.title) {
      toast.warning("Please fill out all fields");
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
        toast.info("Review Date must be earlier than Expired Date.");
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

                <h2 style={{ marginLeft: "10px" }}>New Solution</h2>
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
              </Grid>
              <Grid item xs={3}>
                <h2 className="align-right">
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
              </Grid>
              <Grid item xs={3}>
                <h2 className="align-right">Attachment</h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="file"
                  name="file"
                  className="form-control input-field"
                  id="attachmentUrl"
                  onChange={handleFileChange}
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
                      <h2 className="align-right">Solution Owner</h2>
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
                      <h2 className="align-right">Review Date</h2>
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
                      <h2 className="align-right">Expiry Date</h2>
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
                  <h2 className="align-right">Keywords</h2>
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
                  <h2 className="align-right">Internal Comments</h2>
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

export default CreateTicketSolution;
