import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import { Grid } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack } from "@mui/icons-material";
import { getAllCategories } from "../../../app/api/category";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createTicketByCustomer } from "../../../app/api/ticket";
import CustomizedSteppers from "./CustomizedSteppers";
import { useNavigate } from "react-router-dom";

const RequestIssue = () => {

  const [data, setData] = useState({
    title: "",
    description: "",
    priority: 0,
    categoryId: 1,
    avatarUrl: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [dataCategories, setDataCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const response = await getAllCategories();
      const categoriesArray = Object.values(response);
      setDataCategories(categoriesArray);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    setSelectedFile(e.target.files[0]);
    console.log(selectedFile);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    if (!data.title) {
      toast.warning("Title is required");
      return;
    }
    let avatarUrl = data.avatarUrl;
    if (selectedFile) {
      const storage = getStorage();
      const storageRef = ref(storage, "images/" + selectedFile.name);
      await uploadBytes(storageRef, selectedFile);
      avatarUrl = await getDownloadURL(storageRef);
    }
    const updatedData = {
      ...data,
      avatarUrl: avatarUrl,
    };
    setData(updatedData);
    setIsSubmitting(true);
    try {
      const result = await createTicketByCustomer({
        title: data.title,
        description: data.description,
        priority: data.priority,
        categoryId: data.categoryId,
        avatarUrl: avatarUrl,
      });
      if (result.data && result.data.responseException.exceptionMessage) {
        console.log(result.data.responseException.exceptionMessage)
      }else{
        toast.success("Ticket created successfully");
      }
    } catch (error) {
      console.log("Please check data input", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/home/mains`);
  }

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
        <MDBRow className="mb-4" style={{ marginTop: "20px" }}>
        <CustomizedSteppers
          data={data}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleSubmitTicket={handleSubmitTicket}
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

export default RequestIssue;
