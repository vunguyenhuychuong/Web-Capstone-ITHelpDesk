import React, { useState } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { createMode } from "../../../app/api/mode";
import { toast } from "react-toastify";

const CreateMode = ({ onClose, onSubmitSuccess }) => {
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitMode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createMode(data);
      setIsSubmitting(false);
      toast.success("Create Mode successful", {
        autoClose: 1000,
        hideProgressBar: false,
      });
      onClose();
      if (typeof onSubmitSuccess === "function") {
        onSubmitSuccess();
      }
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
            <h2>Submit a New Mode</h2>
          </MDBCol>
        </MDBRow>
        <form method="post" onSubmit={handleSubmitMode}>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="requesterId" className="narrow-input">
                <span style={{ color: "red" }}>*</span>Mode Name
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

export default CreateMode;
