import React, { useState } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { toast } from "react-toastify";
import { createService } from "../../../app/api/service";

const CreateService = ({ onClose, dataCategories, refetch }) => {
  const [data, setData] = useState({
    description: "",
    categoryId: dataCategories[0].id,
    // amount: "",
  });
  console.log("data", data);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    categoryId: "",
    description: "",
    // amount: "",
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
    const errors = {};

    if (!data.categoryId) {
      errors.type = "Category is required";
    }

    if (!data.description) {
      errors.description = "Description required";
    }
    console.log("errors", errors);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createService(data);
      if (res) {
        toast.success("Create service successfully", {
          autoClose: 1000,
          hideProgressBar: false,
        });
        refetch();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
      onClose();
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

        <MDBRow className="mb-4">
          <MDBCol md="2" className="text-center mt-2 mb-4">
            <label htmlFor="title" className="narrow-input">
              <span style={{ color: "red" }}>*</span>Category
            </label>
          </MDBCol>
          <MDBCol md="10">
            <select
              id="categoryId"
              name="categoryId"
              className="form-select"
              onChange={handleInputChange}
            >
              {dataCategories.map((cate) => (
                <option key={cate.id} value={cate.id}>
                  {cate.name}
                </option>
              ))}
            </select>
            {fieldErrors.type && (
              <div style={{ color: "red" }}>{fieldErrors.categoryId}</div>
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
              <div style={{ color: "red" }}>{fieldErrors.description}</div>
            )}
          </MDBCol>

          {/* <MDBCol md="2" className="text-center mt-2">
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
            </MDBCol> */}
        </MDBRow>
        <MDBRow className="mb-4">
          <MDBCol md="2"></MDBCol>
          <MDBCol md="10" className="text-end">
            <MDBBtn
              small="true"
              color="primary"
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmitService}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </MDBBtn>
            <MDBBtn color="danger" className="ms-2" onClick={onClose}>
              Cancel
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default CreateService;
