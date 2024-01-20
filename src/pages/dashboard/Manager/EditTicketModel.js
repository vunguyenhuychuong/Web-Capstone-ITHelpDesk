import { Button, Dialog, DialogActions, TextField } from "@mui/material";
import { MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  ImpactOptions,
  TypeOptions,
  UrgencyOptions,
  priorityOptions,
} from "../../helpers/tableComlumn";
import { UpdateTicketForTechnician } from "../../../app/api/ticket";
import moment from "moment";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useEffect } from "react";

const EditTicketModel = ({
  data,
  open,
  onClose,
  ticketId,
  updateTicket,
  refetchDetail,
}) => {
  const [editedData, setEditedData] = useState({
    location: data.location,
    impact: data.impact ?? ImpactOptions[0].id,
    impactDetail: data.impactDetail || "",
    priority: data.priority,
    scheduledStartTime: data.scheduledStartTime ?? Date.now(),
    scheduledEndTime: data.scheduledEndTime ?? Date.now(),
    type: data.type ?? TypeOptions[0],
  });
  console.log("editedData", editedData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());
  const [fieldErrors, setFieldErrors] = useState({
    impactDetail: "",
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleStartDateChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setStartDate(newDate);
    setEditedData((prevInputs) => ({
      ...prevInputs,
      scheduledStartTime: formattedDate,
    }));
  };

  const handleEndDateChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setEndDate(newDate);
    setEditedData((prevInputs) => ({
      ...prevInputs,
      scheduledEndTime: formattedDate,
    }));
  };

  const validateDate = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return false;
    }
    const isBefore = moment(startDate).isBefore(moment(endDate));
    return isBefore;
  };

  const handleSaveChanges = async () => {
    const errors = {};
    if (!editedData.impactDetail) {
      errors.impactDetail = "ImpactDetail is required";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const isDataValid = validateDate(
      editedData.scheduledStartTime,
      editedData.scheduledEndTime
    );

    if (!isDataValid) {
      toast.info("Start Date must be earlier than End Date.", {
        autoClose: 2000,
        hideProgressBar: false,
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    const formattedReviewDate = moment(editedData.scheduledStartTime).format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    const formattedExpiredDate = moment(editedData.scheduledEndTime).format(
      "YYYY-MM-DDTHH:mm:ss"
    );

    setIsSubmitting(true);
    try {
      const updatedData = {
        // location: editedData.location,
        impact: parseInt(editedData.impact, 10),
        impactDetail: editedData.impactDetail,
        urgency: parseInt(editedData.urgency, 10),
        scheduledStartTime: formattedReviewDate,
        scheduledEndTime: formattedExpiredDate,
      };
      await UpdateTicketForTechnician(ticketId, updatedData);
      updateTicket(updatedData);
    } catch (error) {
      console.log("Error while assigning ticket", error);
    } finally {
      setIsSubmitting(false);
      await refetchDetail();
      onClose();
    }
  };

  useEffect(() => {
    handleStartDateChange(
      data.scheduledStartTime
        ? moment(data.scheduledStartTime)
        : moment(Date.now())
    );
    handleEndDateChange(
      data.scheduledEndTime ? moment(data.scheduledEndTime) : moment(Date.now())
    );
  }, [data]);

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      <MDBContainer className="py-5">
        <MDBRow className="mb-4">
          <MDBCol className="text-center">
            <h2 style={{ fontWeight: "bold", color: "#3399FF" }}>
              Edit Ticket's Properties
            </h2>
          </MDBCol>
        </MDBRow>
        {/* <MDBRow className="mb-4">
          <MDBCol md="2" className="text-center mt-2">
            <label
              htmlFor="title"
              className="narrow-input"
              style={{ color: "#3399FF", fontWeight: "bold" }}
            >
              Location
            </label>
          </MDBCol>
          <MDBCol md="10">
            <textarea
              id="location"
              type="text"
              name="location"
              className="form-control"
              rows="2"
              value={editedData.location}
              onChange={handleInputChange}
            />
          </MDBCol>
        </MDBRow> */}
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
              Priority
            </label>
          </MDBCol>
          <MDBCol md="10">
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={editedData.priority}
              onChange={handleInputChange}
            >
              {priorityOptions.map((priority) => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
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
              Type
            </label>
          </MDBCol>
          <MDBCol md="10">
            <select
              id="type"
              name="type"
              className="form-select"
              value={editedData.type}
              onChange={handleInputChange}
            >
              {TypeOptions.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
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
              Scheduled Start Time
            </label>
          </MDBCol>
          <MDBCol md="10" style={{ width: "auto" }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                slotProps={{
                  textField: {
                    helperText: `${startDate}`,
                  },
                }}
                value={startDate}
                onChange={(newValue) => handleStartDateChange(newValue)}
                renderInput={(props) => <TextField {...props} />}
              />
            </LocalizationProvider>
          </MDBCol>
        </MDBRow>

        <MDBRow className="mb-4">
          <MDBCol md="2" className="text-center mt-2">
            <label
              htmlFor="title"
              className="narrow-input"
              style={{ color: "#3399FF", fontWeight: "bold" }}
            >
              Scheduled End Time
            </label>
          </MDBCol>
          <MDBCol md="9">
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                slotProps={{
                  textField: {
                    helperText: `${endDate}`,
                  },
                }}
                value={endDate}
                onChange={(newValue) => handleEndDateChange(newValue)}
                renderInput={(props) => <TextField {...props} />}
              />
            </LocalizationProvider>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      <DialogActions
        style={{ justifyContent: "center", backgroundColor: "#EEEEEE" }}
      >
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
        <Button
          color="primary"
          autoFocus
          style={{ color: "white", backgroundColor: "#007bff" }}
          onClick={() => handleSaveChanges()}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTicketModel;
