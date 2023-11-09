import React, { useEffect, useState } from "react";
import "../../../assets/css/createCompany.css";
import { Button, Grid, Switch } from "@mui/material";
import { MDBCardImage, MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, CloudUpload } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getCompanyById, updateCompany } from "../../../app/api/company";
import { VisuallyHidden } from "../Profile";

const EditCompany = (props) => {
  const navigate = useNavigate();
  const { companyId } = useParams();
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
    customerAdminId: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [companyNameError, setCompanyNameError] = useState("");
  const [companyAddressError, setCompanyAddressError] = useState("");
  const [taxCodeError, setTaxCodeError] = useState("");

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const user = await getCompanyById(companyId);
        setData((prevData) => ({
          ...prevData,
          companyName: user.companyName,
          taxCode: user.taxCode,
          phoneNumber: user.phoneNumber,
          email: user.email,
          website: user.website,
          companyAddress: user.companyAddress,
          logoUrl: user.logoUrl,
          fieldOfBusiness: user.fieldOfBusiness,
          isActive: user.isActive,
          customerAdminId: user.customerAdminId,
        }));
      } catch (error) {
        toast.error("Can not get team id");
        console.log(error);
      }
    };
    fetchCompanyData();
  }, [companyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let parsedValue = value;
    let error = "";

    if (name === "customerAdminId") {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        parsedValue = 0;
      }
    }

    if (
      name === "companyName" ||
      name === "companyAddress" ||
      name === "taxCode"
    ) {
      if (!value || value.trim() === "") {
        error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
      }
    }

    if (name === "phoneNumber") {
      const phoneNumberRegex = /^[0-9]{10}$/;
      if (!phoneNumberRegex.test(value)) {
        error = "Phone number must be 10 digits long and contain only numbers.";
      }
    }

    setPhoneNumberError(error);

    switch (name) {
      case "companyName":
        setCompanyNameError(error);
        break;
      case "companyAddress":
        setCompanyAddressError(error);
        break;
      case "taxCode":
        setTaxCodeError(error);
        break;
      default:
        break;
    }
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

    if (!phoneNumberRegex.test(data.phoneNumber)) {
      setPhoneNumberError(
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
      const res = await updateCompany(companyId, updatedData);
      setIsSubmitting(false);
      if (res.isError && res.responseException?.exceptionMessage) {
        toast.info(
          "Company is currently being executed and cannot be updated."
        );
      } else {
        toast.success("Company updated successfully");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage =
          error.response.data?.message ||
          "Company can not be updated when it is being executed";
        toast.error(errorMessage);
      } else {
        toast.info("Error updating Company. Please try again later");
      }
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
                <h2 style={{ marginLeft: "10px" }}>Edit Company</h2>
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
                  className="\card-image"
                  style={{ width: "150px", height: "auto" }}
                  fluid
                />
              )}
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUpload />}
                className="file-upload-button"
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
                      <h2 className="align-right">
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
                <h2 className="align-right">
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
                <h2 className="align-right">
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
                      <h2 className="align-right">
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
                      <h2 className="align-right">Phone Number</h2>
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
                      <h2 className="align-right">field Business</h2>
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
                      <h2 className="align-right">Customer Admin</h2>
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
                      <h2 className="align-right">Website</h2>
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
                      <h2 className="align-right">Active</h2>
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
  );
};

export default EditCompany;
