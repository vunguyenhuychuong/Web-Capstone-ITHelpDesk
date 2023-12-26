import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import { Dialog, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, Close } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { priorityOption } from "../../helpers/tableComlumn";
import { getDataCategories } from "../../../app/api/category";
import {
  editTicketByManager,
  getTicketByTicketId,
} from "../../../app/api/ticket";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const EditTicketCustomer = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [data, setData] = useState({
    title: "",
    description: "",
    priority: 0,
    categoryId: 1,
    attachmentUrls: [],
  });
  const [dataCategories, setDataCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    description: "",
  });

  const fetchDataManager = async () => {
    try {
      const fetchCategories = await getDataCategories();
      setDataCategories(fetchCategories);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else if (name === "priority") {
      const numericValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: numericValue }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const images = data.attachmentUrls.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const ticketData = await getTicketByTicketId(ticketId);
        setData((prevData) => ({
          ...prevData,
          title: ticketData.title,
          description: ticketData.description,
          categoryId: ticketData.categoryId,
          priority: ticketData.priority,
          attachmentUrls: ticketData.attachmentUrls,
        }));
      } catch (error) {
        console.error("Error fetching ticket data: ", error);
      }
    };
    fetchTicketData();
    fetchDataManager();
  }, []);

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

    if (!data.content) {
      errors.content = "Description is required";
    }

    setIsSubmitting(true);
    try {

      let attachmentUrls = data.attachmentUrls || [];
      if (selectedFile.length > 0) {
        const storage = getStorage();
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
      };
      setData(updatedData);
      const res = await editTicketByManager(ticketId, data);
      setIsSubmitting(false);
      if (res.isError && res.responseException?.exceptionMessage) {
        toast.info("Ticket is currently being executed and cannot be updated.");
      } else {
        toast.success("Ticket updated successfully");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage =
          error.response.data?.message ||
          "Ticket can not be updated when it is being executed";
        toast.error(errorMessage);
      } else {
        toast.info("Error updating ticket. Please try again later");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/home/requestCustomerList`);
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
            <MDBCol md="9" className="mt-2">
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
                    Change ticket for customer
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Help change ticket for assistance.
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
                <Grid item xs={3}>
                  <h2
                    className="align-right"
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    Title
                  </h2>
                </Grid>
                <Grid item xs={9}>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    className="form-control"
                    value={data.title}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.title && (
                    <div style={{ color: "red" }}>{fieldErrors.title}</div>
                  )}
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
                        Priority
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="priority"
                        name="priority"
                        className="form-select"
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
                        Category
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

export default EditTicketCustomer;
