import React, { useState } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { toast } from "react-toastify";
import { createService } from "../../../app/api/service";

const CreateService = ({ onClose }) => {
  const [data, setData] = useState({
    description: "",
    type: "",
    amount: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    type: "",
    description: "",
    amount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();

    const errors = {};

    if(!data.type) {
      errors.type = "Type is required";
    }

    if(!data.description) {
      errors.description = "Description required";
    }

    if (!data.amount) {
      errors.amount = "Amount required";
    } else if (!/^\d+(,\d{3})*(\.\d{0,2})?$/.test(data.amount.replace(/,/g, ''))) {
      errors.amount = "Invalid amount format. Please enter a valid numeric value.";
    }

    if(Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await createService(data);
      setIsSubmitting(false);
      toast.success("Create Service successful", {
        autoClose: 1000,
        hideProgressBar: false,
      });
      onClose();
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow className="mb-4">
          <MDBCol className="text-center">
            <h2>Submit a New Service</h2>
          </MDBCol>
        </MDBRow>
        <form method="post" onSubmit={handleSubmitService}>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2 mb-4">
              <label htmlFor="title" className="narrow-input">
                <span style={{ color: "red" }}>*</span>Type
              </label>
            </MDBCol>
            <MDBCol md="10">
              <input
                id="type"
                type="text"
                name="type"
                className="form-control"
                value={data.type}
                onChange={handleInputChange}
              />
              {fieldErrors.type && (
                <div style={{ color: 'red' }}>{fieldErrors.type}</div>
              )}
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2 mb-4">
              <label htmlFor="requesterId" className="narrow-input">
                <span style={{ color: "red" }}>*</span>Description
              </label>
            </MDBCol>
            <MDBCol md="10">
              <input
                id="description"
                type="text"
                name="description"
                className="form-control"
                value={data.description}
                onChange={handleInputChange}
              />
              {fieldErrors.description && (
                <div style={{ color: 'red' }}>{fieldErrors.description}</div>
              )}
            </MDBCol>

            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
                <span style={{ color: "red" }}>*</span>Amount
              </label>
            </MDBCol>
            <MDBCol md="10">
              <input
                id="amount"
                type="text"
                name="amount"
                className="form-control"
                value={data.amount}
                onChange={handleInputChange}
              />
              {fieldErrors.amount && (
                <div style={{ color: 'red' }}>{fieldErrors.amount}</div>
              )}
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="2"></MDBCol>
            <MDBCol md="10" className="text-end">
              <MDBBtn
                small="true"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </MDBBtn>
              <MDBBtn color="danger" className="ms-2" onClick={onClose}>
                Cancel
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </form>
      </MDBContainer>
    </section>
  );
};

export default CreateService;
