import React, { useState } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { createMode } from "../../../app/api/mode";

const CreateCategory = ({ onClose, onSubmitSuccess }) => {
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    description: "",
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

  const handleSubmitMode = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.name) {
      errors.name = "Mode Name is required";
    }

    if (!data.description) {
      errors.description = "Description is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await createMode(data);
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow className="mb-4">
          <MDBCol className="text-center">
            <h2>Submit a New Category</h2>
          </MDBCol>
        </MDBRow>
        <form method="post" onSubmit={handleSubmitMode}>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="requesterId" className="narrow-input">
                <span style={{ color: "red" }}>*</span>Category Name
              </label>
            </MDBCol>
            <MDBCol md="10">
              <input
                id="name"
                type="text"
                name="name"
                className="form-control"
                value={data.name}
                onChange={handleInputChange}
              />
              {fieldErrors.name && (
                <div style={{ color: "red" }}>{fieldErrors.name}</div>
              )}
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2 mb-2">
              <label htmlFor="title" className="narrow-input">
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
                <div style={{ color: "red" }}>{fieldErrors.description}</div>
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

export default CreateCategory;
