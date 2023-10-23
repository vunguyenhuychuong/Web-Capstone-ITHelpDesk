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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
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
            </MDBCol>
            
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
                <span style={{ color: "red" }}>*</span>amount
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
