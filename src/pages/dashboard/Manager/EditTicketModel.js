import { Button, Dialog, DialogActions } from "@mui/material";
import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ImpactOptions, UrgencyOptions } from "../../helpers/tableComlumn";
import { UpdateTicketForTechnician } from "../../../app/api/ticket";

const EditTicketModel = ({ data, open, onClose, ticketId, updateTicket }) => {
  const [editedData, setEditedData] = useState({
    impact: data.impact,
    impactDetail: data.impactDetail || "",
    urgency: data.urgency,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    impactDetail: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSaveChanges = async () => {
    const errors = {};
    if (!data.impactDetail) {
      errors.impactDetail = "ImpactDetail is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setIsSubmitting(true);
    try {
      const updatedData = {
        impact: parseInt(editedData.impact, 10),
        impactDetail: editedData.impactDetail,
        urgency: parseInt(editedData.urgency, 10),
      };
      await UpdateTicketForTechnician(ticketId, updatedData);
      toast.success(`Update Ticket${ticketId} successful`);
      updateTicket(updatedData);
    } catch (error) {
      console.log("Error while assigning ticket", error);
    }
    onClose();
  };

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <MDBContainer className="py-5">
        <MDBRow className="mb-4">
          <MDBCol className="text-center">
            <h2 style={{ fontWeight: "bold", color: "#3399FF" }}>
              Edit Ticket
            </h2>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4">
          <MDBCol md="2" className="text-center mt-2">
            <label
              htmlFor="title"
              className="narrow-input"
              style={{ color: "#3399FF", fontWeight: "bold" }}
            >
              Impact
            </label>
          </MDBCol>
          <MDBCol md="10">
            <select
              id="impact"
              name="impact"
              className="form-select"
              value={editedData.impact}
              onChange={handleInputChange}
            >
              {ImpactOptions.map((impact) => (
                <option key={impact.id} value={impact.id}>
                  {impact.name}
                </option>
              ))}
            </select>
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4">
          <MDBCol md="2" className="text-center mt-2">
            <label
              htmlFor="title"
              className="narrow-input"
              style={{ color: "#3399FF", fontWeight: "bold" }}
            >
              Impact Detail
            </label>
          </MDBCol>
          <MDBCol md="10">
            <textarea
              id="impactDetail"
              type="text"
              name="impactDetail"
              className="form-control"
              rows="4"
              value={editedData.impactDetail}
              onChange={handleInputChange}
            />
            {fieldErrors.impactDetail && (
              <div style={{ color: "red" }}>{fieldErrors.impactDetail}</div>
            )}
          </MDBCol>
        </MDBRow>
        <MDBRow className="mb-4">
          <MDBCol md="2" className="text-center mt-2">
            <label
              htmlFor="title"
              className="narrow-input"
              style={{ color: "#3399FF", fontWeight: "bold" }}
            >
              Urgency
            </label>
          </MDBCol>
          <MDBCol md="10">
            <select
              id="urgency"
              name="urgency"
              className="form-select"
              value={editedData.urgency}
              onChange={handleInputChange}
            >
              {UrgencyOptions.map((urgency) => (
                <option key={urgency.id} value={urgency.id}>
                  {urgency.name}
                </option>
              ))}
            </select>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <DialogActions
        style={{ justifyContent: "center", backgroundColor: "#EEEEEE" }}
      >
        <Button
          color="primary"
          autoFocus
          style={{ color: "white", backgroundColor: "#007bff" }}
          onClick={() => handleSaveChanges()}
          disabled={isSubmitting}
        >
          Submit
        </Button>
        <Button
          onClick={onClose}
          color="primary"
          autoFocus
          style={{
            color: "white",
            backgroundColor: "#dc3545",
            marginLeft: "10px",
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicketModel;
