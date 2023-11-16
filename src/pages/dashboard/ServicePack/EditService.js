import React, { useState } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "../../../assets/css/EditTicket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { getServiceDetail, updateService } from "../../../app/api/service";

const EditService = ({ onClose, serviceId }) => {
  const [data, setData] = useState({
    description: "",
    type: "",
    amount: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    type: "",
    description: "",
    amount: "",
  });

  useEffect(() => {
    const fetchDataService = async () => {
      try {
        const result = await getServiceDetail(serviceId);
        setData({
          description: result.description,
          type: result.type,
          amount: result.amount,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (serviceId) {
      fetchDataService();
    }
  }, [serviceId]);

  const handleCancelEdit = () => {
    onClose();
  };
  
  

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAmount = (value) => {
    const errors = {};
    if (!value) {
      errors.amount = "Amount is required";
    } else if (!/^\d+(,\d{3})*(\.\d{0,2})?$/.test(value.replace(/,/g, ""))) {
      errors.amount =
        "Invalid amount format. Please enter a valid numeric value.";
    }
    return errors;
  };

  const onHandleEditService = async (e) => {
    e.preventDefault();

    const errors = {
      description: !data.description ? "Description is required" : "",
      type: !data.type ? "Type is required" : "",
      amount: !data.amount ? "Amount is required" : "",
      ...validateAmount(data.amount),
    };
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await updateService(serviceId, data);
      setIsSubmitting(false);
      toast.success("Update Mode successful", {
        autoClose: 1000,
        hideProgressBar: false,
      });
      onClose();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <section
      style={{ backgroundColor: "#DDDDDD" }}
      className="edit-ticket-container"
    >
      <MDBContainer>
        <MDBRow className="mb-4">
          <MDBCol className="text-center">
            <h2>Edit Service</h2>
          </MDBCol>
        </MDBRow>
        <form onSubmit={(e) => e.preventDefault()}>
          <MDBRow className="mb-4">
            <MDBRow className="mb-4">
              <MDBCol md="2" className="text-center mt-2">
                <label htmlFor="title" className="narrow-input">
                  Description
                </label>
              </MDBCol>
              <MDBCol md="10">
                <input
                  id="description"
                  type="text"
                  name="description"
                  className="form-control"
                  value={data.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                />
                {fieldErrors.description && (
                  <div style={{ color: "red" }}>{fieldErrors.description}</div>
                )}
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="2" className="text-center mt-2">
                <label htmlFor="title" className="narrow-input">
                  Type
                </label>
              </MDBCol>
              <MDBCol md="10">
                <input
                  id="type"
                  type="text"
                  name="type"
                  className="form-control"
                  value={data.type}
                  onChange={(e) => setData({ ...data, type: e.target.value })}
                />
                {fieldErrors.type && (
                  <div style={{ color: "red" }}>{fieldErrors.type}</div>
                )}
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="2" className="text-center mt-2">
                <label htmlFor="title" className="narrow-input">
                  Amount
                </label>
              </MDBCol>
              <MDBCol md="10">
                <input
                  id="amount"
                  type="text"
                  name="amount"
                  className="form-control"
                  value={data.amount}
                  onChange={(e) => {
                    setData({ ...data, amount: e.target.value });
                    setFieldErrors({ ...fieldErrors, amount: "" });
                  }}
                />
                {fieldErrors.amount && (
                  <div style={{ color: "red" }}>{fieldErrors.amount}</div>
                )}
              </MDBCol>
            </MDBRow>
          </MDBRow>

          <MDBRow className="mb-4">
            <MDBCol md="12" className="text-center">
              <MDBBtn
                small="true"
                color="primary"
                type="submit"
                onClick={onHandleEditService}
              >
                Edit
              </MDBBtn>
              <MDBBtn
                color="danger"
                className="ms-2"
                onClick={() => handleCancelEdit()}
              >
                Cancel
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </form>
      </MDBContainer>
    </section>
  );
};

export default EditService;
