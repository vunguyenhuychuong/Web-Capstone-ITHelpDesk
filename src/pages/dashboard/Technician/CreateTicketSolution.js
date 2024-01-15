import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getDataCategories } from "../../../app/api/category";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createTicketSolution } from "../../../app/api/ticketSolution";
import moment from "moment";
import { getDataUser } from "../../../app/api";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useSelector } from "react-redux";

const CreateTicketSolution = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const check = user.user.role;
  const currentDate = Date.now();
  const [data, setData] = useState({
    title: "",
    content: "",
    categoryId: 1,
    ownerId: 1,
    reviewDate: currentDate,
    expiredDate: currentDate,
    keyword: "",
    internalComments: "",
    isPublic: true,
    attachmentUrls: [],
  });
  const [dataCategories, setDataCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    content: "",
  });

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
    const files = e.target.files;
    setSelectedFile((prevFiles) => [...prevFiles, ...files]);

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

  const validateDate = (reviewDate, expiredDate) => {
    if (!reviewDate || !expiredDate) {
      return false;
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

    // const isDataValid = validateDate(data.reviewDate, data.expiredDate);
    // if (!isDataValid) {
    //   toast.warning(
    //     "scheduledStartTime must be earlier than scheduledEndTime.",
    //     {
    //       autoClose: 2000,
    //       hideProgressBar: false,
    //       position: toast.POSITION.TOP_CENTER,
    //     }
    //   );
    //   return;
    // }

    const formattedReviewDate = moment(data.reviewDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    const formattedExpiredDate = moment(data.expiredDate).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
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
        reviewDate: formattedReviewDate,
        expiredDate: formattedExpiredDate,
      };

      setData(updatedData);
      await createTicketSolution({
        title: data.title,
        content: data.content,
        categoryId: data.categoryId,
        ownerId: data.ownerId,
        reviewDate: formattedReviewDate,
        expiredDate: formattedExpiredDate,
        keyword: data.keyword,
        internalComments: data.internalComments,
        isPublic: data.isPublic,
        attachmentUrls: attachmentUrls,
      });
      if (check === 3) {
        navigate(`/home/homeTechnician`);
      } else if (check === 2) {
        navigate(`/home/homeManager`);
      } else {
        console.warn("Unhandled user role:", check);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = imagePreviewUrl.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

  const handlePublicToggle = () => {
    setData((prevData) => ({
      ...prevData,
      isPublic: !prevData.isPublic,
    }));
  };

  const handleGoBack = () => {
    if (check === 2) {
      navigate(`/home/homeManager`);
    } else if (check === 3) {
      navigate(`/home/homeTechnician`);
    } else {
      console.warn("Unhandled user role:", check);
    }
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
                <Stack direction={"row"} alignItems={"center"}>
                  <Button>
                    <ArrowBack
                      onClick={handleGoBack}
                      style={{ color: "#0099FF" }}
                    />
                  </Button>
                </Stack>
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
                  className="form-control-text input-field"
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
                  className="form-control-text input-field-2"
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
                        <span style={{ color: "red" }}>*</span>Category
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
                        className="form-select-custom"
                        value={data.ownerId}
                        onChange={handleInputChange}
                      >
                        {dataUsers
                          .filter(
                            (owner) => owner.role !== 0 && owner.role !== 1
                          )
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
                  <textarea
                    id="keyword"
                    type="text"
                    name="keyword"
                    className="form-control-text input-field"
                    rows="4"
                    value={data.keyword}
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
                  {isSubmitting ? "Submitting..." : "Create"}
                </button>
                {/* <button
                  type="button"
                  className="btn btn-secondary custom-btn-margin"
                >
                  Cancel
                </button> */}
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

export default CreateTicketSolution;
