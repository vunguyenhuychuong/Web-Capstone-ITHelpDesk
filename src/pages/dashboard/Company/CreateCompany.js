import React, { useState } from "react";
import "../../../assets/css/createCompany.css";
import { Button, Grid, Stack, Switch } from "@mui/material";
import { MDBCardImage, MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, CloudUpload } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { createCompany } from "../../../app/api/company";
import { VisuallyHidden } from "../Profile";

const CreateCompany = (props) => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    companyName: "",
    taxCode: "",
    phoneNumber: "",
    email: "",
    website: "",
    companyAddress: "",
    logoUrl: "",
    fieldOfBusiness: "",
    isActive: true,
    customerAdminId: null,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [companyAddressError, setCompanyAddressError] = useState("");
  const [taxCodeError, setTaxCodeError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let parsedValue = value;
    let companyNameError = "";
    let taxCodeError = "";
    let phoneNumberError = "";
    let companyAddressError = "";
    if (name === "customerAdminId") {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        parsedValue = 0;
      }
    }

    if (name === "companyAddress" && (!value || value.trim() === "")) {
      companyAddressError = "Company Address is required.";
    }

    if (name === "companyNameError" && (!value || value.trim() === "")) {
      companyNameError = "Company Name is required.";
    }

    if (name === "taxCodeError" && (!value || value.trim() === "")) {
      taxCodeError = "Tax Code is required.";
    }

    if (name === "phoneNumber") {
      const phoneNumberRegex = /^[0-9]{10}$/;
      if (!phoneNumberRegex.test(value)) {
        phoneNumberError =
          "Phone number must be 10 digits long and contain only numbers.";
      }
    }
    setPhoneNumberError(phoneNumberError);
    setTaxCodeError(taxCodeError);
    setCompanyNameError(companyNameError);
    setCompanyAddressError(companyAddressError);
    setData((prevData) => ({ ...prevData, [name]: parsedValue }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const phoneNumberRegex = /^[0-9]{10}$/;

    if (!data.companyName) {
      toast.info("Company Name are required fields.");
      setIsSubmitting(false);
      return;
    }
    if (!data.companyAddress) {
      toast.info("Company Address are required fields.");
      setIsSubmitting(false);
      return;
    }
    if (!data.taxCode) {
      toast.info("Tax Code are required fields.");
      setIsSubmitting(false);
      return;
    }

    if (!phoneNumberRegex.test(data.phoneNumber)) {
      toast.info(
        "Phone number must be 10 digits long and contain only numbers."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      let logoUrl = data.logoUrl;
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);
        logoUrl = await getDownloadURL(storageRef);
      }
      const updatedData = {
        ...data,
        logoUrl: logoUrl,
      };

      setData(updatedData);
      const response = await createCompany({
        companyName: data.companyName,
        taxCode: data.taxCode,
        phoneNumber: data.phoneNumber,
        email: data.email,
        website: data.website,
        companyAddress: data.companyAddress,
        logoUrl: logoUrl,
        fieldOfBusiness: data.fieldOfBusiness,
        isActive: data.isActive,
        customerAdminId: data.customerAdminId,
      });
      if (
        response.data.isError &&
        response.data.responseException.exceptionMessage
      ) {
        console.log(response.data.responseException.exceptionMessage);
      } else {
        toast.success("Company created successfully");
      }

      toast.success("Company created successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublicToggle = () => {
    setData((prevData) => ({
      ...prevData,
      isActive: !prevData.isActive,
    }));
  };

  const handleGoBack = () => {
    navigate(`/home/companyList`);
  };

  return (
    <Grid container>
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
                    Create Company
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Create a company for assistance.
                  </span>
                </div>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <Grid container className="card-image-section">
          <Grid item xs={3}>
            <div className="image-container">
              {data && data.logoUrl ? (
                <MDBCardImage
                  src={data.logoUrl}
                  alt="logoUrl"
                  className=" card-image"
                  fluid
                />
              ) : (
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                  alt="logoUrl"
                  className=" card-image"
                  style={{ width: "150px", height: "auto" }}
                  fluid
                />
              )}
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUpload />}
                className="file-upload-button input-field file-input"
              >
                Upload Image
                <VisuallyHidden
                  type="file"
                  onChange={handleFileChange}
                  {...props}
                />
              </Button>
            </div>
          </Grid>
          <Grid item xs={9}>
            <Grid container justifyContent="flex-end">
              {" "}
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item xs={3}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        <span style={{ color: "red" }}>*</span>Company Name
                      </h2>
                    </Grid>
                    <Grid item xs={9}>
                      <input
                        type="text"
                        name="companyName"
                        className="form-control input-field"
                        id="companyName"
                        value={data.companyName}
                        onChange={handleInputChange}
                      />
                      {companyNameError && (
                        <span style={{ color: "red" }}>{companyNameError}</span>
                      )}
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
                  <span style={{ color: "red" }}>*</span>Company Address
                </h2>
              </Grid>
              <Grid item xs={9}>
                <textarea
                  type="text"
                  id="companyAddress"
                  name="companyAddress"
                  className="form-control input-field-2"
                  rows="4"
                  value={data.companyAddress}
                  onChange={handleInputChange}
                />
                {companyAddressError && (
                  <span style={{ color: "red" }}>{companyAddressError}</span>
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
                  <span style={{ color: "red" }}>*</span>Email
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="text"
                  id="email"
                  name="email"
                  className="form-control input-field-2"
                  value={data.email}
                  onChange={handleInputChange}
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
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        <span style={{ color: "red" }}>*</span>Tax Code
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        type="text"
                        name="taxCode"
                        className="form-control input-field"
                        id="taxCode"
                        value={data.taxCode}
                        onChange={handleInputChange}
                      />
                      {taxCodeError && (
                        <span style={{ color: "red" }}>{taxCodeError}</span>
                      )}
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
                        Phone Number
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        type="text"
                        name="phoneNumber"
                        className="form-control input-field"
                        id="phoneNumber"
                        value={data.phoneNumber}
                        onChange={handleInputChange}
                      />
                      {phoneNumberError && (
                        <span style={{ color: "red" }}>{phoneNumberError}</span>
                      )}
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
                        field Business
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        type="text"
                        name="fieldOfBusiness"
                        className="form-control input-field"
                        id="fieldOfBusiness"
                        value={data.fieldOfBusiness}
                        onChange={handleInputChange}
                      />
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
                        Customer Admin
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        type="number"
                        name="customerAdminId"
                        className="form-control input-field"
                        id="customerAdminId"
                        value={data.customerAdminId}
                        onChange={handleInputChange}
                        disabled
                      />
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
                        Website
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        type="text"
                        name="website"
                        className="form-control input-field"
                        id="website"
                        value={data.website}
                        onChange={handleInputChange}
                      />
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
                        Active
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <Switch
                        checked={data.isActive}
                        onChange={handlePublicToggle}
                        color="primary"
                        name="isActive"
                        id="isActive"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

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
  );
};

export default CreateCompany;
