import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import { Grid } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack } from "@mui/icons-material";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createTicketByCustomer } from "../../../app/api/ticket";
import CustomizedSteppers from "./CustomizedSteppers";
import { useNavigate } from "react-router-dom";
import { getAllService } from "../../../app/api/service";

const RequestIssue = () => {
  const [data, setData] = useState({
    title: "",
    description: "",
    serviceId: 1,
    attachmentUrls: [],
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dataService, setDataServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const navigate = useNavigate();

  const fetchService = async () => {
    try {
      const response = await getAllService();
      setDataServices(response);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target || e;
    if (name === "priority") {
      const priorityValue = parseInt(value, 10);

      setData((prevData) => ({
        ...prevData,
        [name]: priorityValue,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles([...files]);

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

    if (!data.title) {
      toast.warning("Title is required");
      return;
    }
    let attachmentUrls = data.attachmentUrls;

    if(selectedFiles.length > 0) {
      const storage = getStorage();
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
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
    setIsSubmitting(true);
    try {
      await createTicketByCustomer({
        title: data.title,
        description: data.description,
        serviceId: data.serviceId,
        attachmentUrls: attachmentUrls,
      });
      navigate(`/home/mains`);
    } catch (error) {
      console.log("Please check data input", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/home/mains`);
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
                    New Ticket
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Create a new ticket for assistance.
                  </span>
                </div>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBRow className="mb-4" style={{ marginTop: "20px" }}>
          <CustomizedSteppers
            data={data}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            handleSubmitTicket={handleSubmitTicket}
            imagePreviewUrl={imagePreviewUrl}
            isImagePreviewOpen={isImagePreviewOpen}
            setIsImagePreviewOpen={setIsImagePreviewOpen}
          />
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

      
    </Grid>
  );
};

export default RequestIssue;
