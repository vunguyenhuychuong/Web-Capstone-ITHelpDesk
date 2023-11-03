import React, { useState } from "react";
import "../../../assets/css/ticketSolution.css";
import { Grid, Switch } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  editTicketSolution,
  getTicketSolutionById,
} from "../../../app/api/ticketSolution";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getDataCategories } from "../../../app/api/category";
import { toast } from "react-toastify";
import DateValidation from "../../helpers/DateValidation";
import { validateDate } from "@mui/x-date-pickers/internals";

const EditTicketSolution = () => {
  const navigate = useNavigate();
  const { solutionId } = useParams();
  const [dataCategories, setDataCategories] = useState([]);
  const [data, setData] = useState({
    id: 1,
    title: "",
    content: "",
    categoryId: 1,
    ownerId: 1,
    reviewDate: "",
    expiredDate: "",
    keyword: "",
    internalComments: "",
    attachmentUrl: "",
    isApproved: false,
    isPublic: true,
    createdAt: "",
    modifiedAt: "",
  });

  const [date, setDate] = useState(moment());
  const [reviewDate, setReviewDate] = useState(
    moment(data.reviewDate || moment().format("YYYY-MM-DD"))
  );
  const [expiredDate, setExpiredDate] = useState(
    moment(data.expiredDate || moment().format("YYYY-MM-DD"))
  );

  const handlePublicToggle = () => {
    setData((prevData) => ({
      ...prevData,
      isPublic: !prevData.isPublic,
    }));
  };

  const handleDateChange = (newDate, dateType) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setDate(newDate);
    if (dateType === "reviewDate") {
      setReviewDate(newDate);
      setData((prevInputs) => ({
        ...prevInputs,
        reviewDate: formattedDate,
      }));
    } else {
      setExpiredDate(newDate);
      setData((prevInputs) => ({
        ...prevInputs,
        expiredDate: formattedDate,
      }));
    }
  };

  const fetchDataSolution = async () => {
    try {
      const fetchCategories = await getDataCategories();
      setDataCategories(fetchCategories);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  useEffect(() => {
    const fetchSolutionData = async () => {
      try {
        const solutionData = await getTicketSolutionById(solutionId);
        console.log(solutionData);
        const formattedReviewDate = moment(solutionData.reviewDate).format(
          "YYYY-MM-DD"
        );
        const formattedExpiredDate = moment(solutionData.expiredDate).format(
          "YYYY-MM-DD"
        );
        setData((prevData) => ({
          ...prevData,
          id: solutionData.id,
          title: solutionData.title,
          content: solutionData.content,
          categoryId: solutionData.categoryId,
          ownerId: solutionData.ownerId,
          reviewDate: formattedReviewDate,
          expiredDate: formattedExpiredDate,
          keyword: solutionData.keyword,
          internalComments: solutionData.internalComments,
          attachmentUrl: solutionData.attachmentUrl,
          isApproved: solutionData.isApproved,
          isPublic: solutionData.isPublic,
          createdAt: solutionData.createdAt,
          modifiedAt: solutionData.modifiedAt,
        }));
      } catch (error) {
        console.log("Error while fetching solution data", error);
      }
    };
    fetchSolutionData();
    fetchDataSolution();
  }, [solutionId]);

  const handleEditSolutionTicket = async (e) => {
    console.log("handleEditSolutionTicket function called");
    e.preventDefault();

    // const isDataValid = validateDate();
    // if (!isDataValid) {
    //   toast.info("Review Date must be earlier than Expired Date.");
    //   return;
    // }

    try {
      const res = await editTicketSolution(solutionId, data);
      console.log(res);
      toast.success("Ticket Solution edit successful");
    } catch (error) {
      console.error(error);
      toast.error("Error editing ticket solution");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));
  };

  const handleGoBack = () => {
    navigate(`/home/detailSolution/${solutionId}`);
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

                <h2 style={{ marginLeft: "10px" }}>Edit Solution</h2>
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
                  type="content"
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
                  name="attachmentUrl"
                  className="form-control input-field"
                  id="attachmentUrl"
                  value={data.attachmentUrl}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid container justifyContent="flex-end">
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
                      <input
                        id="ownerId"
                        type="text"
                        name="ownerId"
                        rows="3"
                        className="form-control input-field"
                        value={data.ownerId}
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
                      <h2 className="align-right">Review Date</h2>
                    </Grid>
                    <Grid item xs={5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          slotProps={{
                            textField: {
                              helperText: `${data.reviewDate}`,
                            },
                          }}
                          value={reviewDate}
                          onChange={(newValue) =>
                            handleDateChange(newValue, "reviewDate")
                          }
                        />
                      </LocalizationProvider>
                    </Grid>
                    {/* <DateValidation
                      className="text-center"
                      reviewDate={data.reviewDate}
                      expiredDate={data.expiredDate}
                    /> */}
                  </Grid>
                </Grid>

                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2 className="align-right">Expiry Date</h2>
                    </Grid>
                    <Grid item xs={5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          slotProps={{
                            textField: {
                              helperText: `${data.expiredDate}`,
                            },
                          }}
                          value={expiredDate}
                          onChange={(newValue) =>
                            handleDateChange(newValue, "expiredDate")
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
                    name="isPublic"
                    id="isPublic"
                  />
                </Grid>
              </Grid>
              <Grid container justifyContent="flex-end">
                <Grid item xs={3}>
                  <h2 className="align-right">Internal Comments</h2>
                </Grid>
                <Grid item xs={9}>
                  <input
                    id="internalComments"
                    type="text"
                    name="internalComments"
                    className="form-control input-field"
                    value={data.internalComments}
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
                  onClick={handleEditSolutionTicket}
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

export default EditTicketSolution;
