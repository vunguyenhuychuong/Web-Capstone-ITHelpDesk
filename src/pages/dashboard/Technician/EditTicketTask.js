import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, Close } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import AssignApi from "../../../app/api/assign";
import Process, {
  TicketStatusOptions,
  priorityOption,
} from "../../helpers/tableComlumn";
import {
  getTicketTaskById,
  updateTicketTask,
} from "../../../app/api/ticketTask";
import { getAllTeams } from "../../../app/api/team";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const EditTicketTask = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [data, setData] = useState({
    ticketId: ticketId,
    title: "",
    description: "",
    taskStatus: 1,
    technicianId: 1,
    teamId: 1,
    priority: 0,
    scheduledStartTime: "",
    scheduledEndTime: "",
    progress: 0,
    attachmentUrls: [],
    note: "",
  });
  const [dataTeam, setDataTeam] = useState([]);
  const [dataTechnician, setDataTechnician] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [scheduledStartTime, setScheduledStartTime] = useState(moment());
  const [scheduledEndTime, setScheduledEndTime] = useState(moment());
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    description: "",
  });

  const handleScheduledStartTimeChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setScheduledStartTime(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      scheduledStartTime: formattedDate,
    }));
  };

  const handleScheduledEndTimeChange = (newDate) => {
    const formattedDate = moment(newDate).format("YYYY-MM-DDTHH:mm:ss");
    setScheduledEndTime(newDate);
    setData((prevInputs) => ({
      ...prevInputs,
      scheduledEndTime: formattedDate,
    }));
  };

  const fetchDataTeam = async () => {
    try {
      const fetchTeam = await getAllTeams();
      setDataTeam(fetchTeam);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const handleTeamChange = async (event) => {
    const selectedTeamId = event.target.value;
    setSelectedTeamId(selectedTeamId);

    try {
      const technicians = await AssignApi.getTechnician(selectedTeamId);
      console.log(technicians);
      setDataTechnician(technicians);
    } catch (error) {
      console.error("Error while fetching technicians", error);
    }
  };

  const images = data.attachmentUrls.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const taskData = await getTicketTaskById(ticketId);
        setData((prevData) => ({
          ...prevData,
          id: taskData.id,
          ticketId: taskData.ticketId,
          createById: taskData.createById,
          technicianId: taskData.technicianId,
          title: taskData.title,
          description: taskData.description,
          teamId: taskData.teamId,
          note: taskData.note,
          priority: taskData.priority,
          scheduledStartTime: taskData.scheduledStartTime,
          scheduledEndTime: taskData.scheduledEndTime,
          createdAt: taskData.createdAt,
          modifiedAt: taskData.modifiedAt,
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchTaskData();
    fetchDataTeam();
  }, [ticketId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;
    if (
      name === "taskStatus" ||
      name === "teamId" ||
      name === "priority" ||
      name === "ticketId" ||
      name === "technicianId" ||
      name === "progress"
    ) {
      processedValue = parseInt(value, 10);
    }
    setData((prevData) => ({
      ...prevData,
      [name]: processedValue,
    }));
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
    }
  };

  const closeImagePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const validateDate = (scheduledStartTime, scheduledEndTime) => {
    if (!scheduledStartTime || !scheduledEndTime) {
      return false;
    }
    return moment(scheduledStartTime).isBefore(scheduledEndTime);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!data.title) {
      errors.title = "Title Ticket is required";
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
      let attachmentUrls = data.attachmentUrls;
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);
        attachmentUrls = await getDownloadURL(storageRef);
      }

      const isDataValid = validateDate(
        data.scheduledStartTime,
        data.scheduledEndTime
      );
      if (!isDataValid) {
        toast.info("scheduledStartTime must be earlier than scheduledEndTime.");
        return;
      }

      const formattedScheduledStartTime = moment(
        data.scheduledStartTime
      ).format("YYYY-MM-DDTHH:mm:ss");
      const formattedScheduledEndTime = moment(data.scheduledEndTime).format(
        "YYYY-MM-DDTHH:mm:ss"
      );

      const updatedData = {
        ...data,
        attachmentUrls: attachmentUrls,
        scheduledStartTime: formattedScheduledStartTime,
        scheduledEndTime: formattedScheduledEndTime,
        technicianId: selectedTechnicianId,
      };

      setData(updatedData);
      await updateTicketTask(ticketId, {
        title: data.title,
        description: data.description,
        // taskStatus: data.taskStatus,
        teamId: data.teamId,
        // technicianId: data.technicianId,
        priority: parseInt(data.priority, 10),
        scheduledStartTime: data.scheduledStartTime,
        scheduledEndTime: data.scheduledEndTime,
        progress: data.progress,
        attachmentUrls: data.attachmentUrls,
        note: data.note,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = (ticketId) => {
    navigate(`/home/detailTicket/${ticketId}`);
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
                    onClick={() => handleGoBack(data.ticketId)}
                    className="arrow-back-icon"
                  />
                </button>

                <h2 style={{ marginLeft: "10px" }}>Edit Task</h2>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBRow className="mb-4">
          <MDBCol
            md="12"
            className="mt-4"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <Grid container justifyContent="flex-end">
              {" "}
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
                <Grid item xs={3}>
                  <h2
                    className="align-right"
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <span style={{ color: "red" }}>*</span>Title
                  </h2>
                </Grid>
                <Grid item xs={9}>
                  <input
                    type="text"
                    name="title"
                    className="form-control input-field"
                    id="title"
                    value={data.title}
                    onChange={handleInputChange}
                  />
                  {fieldErrors.title && (
                    <div style={{ color: "red" }}>{fieldErrors.title}</div>
                  )}
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
                  <span style={{ color: "red" }}>*</span>Description
                </h2>
              </Grid>
              <Grid item xs={9}>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  className="form-control input-field-2"
                  rows="6"
                  value={data.description}
                  onChange={handleInputChange}
                />
                {fieldErrors.description && (
                  <div style={{ color: "red" }}>{fieldErrors.description}</div>
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
                  Attachment
                </h2>
              </Grid>
              <Grid item xs={9}>
                <input
                  type="file"
                  name="file"
                  className="form-control input-field"
                  id="attachmentUrls"
                  onChange={handleFileChange}
                  value={data.attachmentUrls}
                />
                {imagePreviewUrl.length > 0 && (
                  <div
                    className="image-preview"
                    onClick={() => setIsImagePreviewOpen(true)}
                  >
                    <p className="preview-text">
                      Click here to view attachment
                    </p>
                  </div>
                )}
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginBottom: "20px" }}
              >
                {/* <Grid item xs={6}>
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
                        <span style={{ color: "red" }}>*</span>TechnicianId
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="teamId"
                        name="teamId"
                        className="form-select"
                        value={selectedTeamId}
                        onChange={handleTeamChange}
                      >
                        {dataTeam
                          .filter((team) => team.id !== "")
                          .map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                      </select>
                      <select
                        id="technician"
                        name="technician"
                        className="form-select"
                        value={selectedTechnicianId}
                        onChange={(e) =>
                          setSelectedTechnicianId(e.target.value)
                        }
                      >
                        {dataTechnician
                          .filter((technician) => technician.id !== "")
                          .map((technician) => (
                            <option key={technician.id} value={technician.id}>
                              {technician.lastName} {technician.firstName}
                            </option>
                          ))}
                      </select>
                    </Grid>
                  </Grid>
                </Grid> */}
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
                        Progress
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      {/* <select
                        id="progress"
                        name="progress"
                        className="form-select"
                        value={data.progress}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Progress</option>{" "}
                        {Object.keys(Process).map((processId) => (
                          <option key={processId} value={processId}>
                            {Process[processId]}
                          </option>
                        ))}
                      </select> */}
                      <Stack>
                        <Slider
                          aria-label="progress"
                          id="progress"
                          name="progress"
                          value={data.progress}
                          onChange={handleInputChange}
                          valueLabelDisplay="auto"
                        />
                        <TextField
                          type="number"
                          aria-label="progress input"
                          id="progress"
                          name="progress"
                          sx={{ width: "100%", my: 5 }}
                          InputProps={{
                            inputProps: { min: 0, max: 100 },
                            endAdornment: <Typography>%</Typography>,
                          }}
                          onChange={(e) => {
                            var value = parseInt(e.target.value, 10);

                            if (value > 100) e.target.value = 100;
                            if (value < 0) e.target.value = 0;
                            handleInputChange(e);
                          }}
                          value={data.progress}
                        />
                      </Stack>
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
                        Priority
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="priority"
                        name="priority"
                        className="form-select"
                        value={data.priority}
                        onChange={handleInputChange}
                      >
                        {priorityOption
                          .filter((priority) => priority.id !== "")
                          .map((priority) => (
                            <option key={priority.id} value={priority.id}>
                              {priority.name}
                            </option>
                          ))}
                      </select>
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
                        Schedule startTime
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          slotProps={{
                            textField: {
                              helperText: `${scheduledStartTime}`,
                            },
                          }}
                          value={scheduledStartTime}
                          onChange={(newValue) =>
                            handleScheduledStartTimeChange(newValue)
                          }
                          renderInput={(props) => <TextField {...props} />}
                        />
                      </LocalizationProvider>
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
                        Schedule endTime
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          slotProps={{
                            textField: {
                              helperText: `${scheduledEndTime}`,
                            },
                          }}
                          value={scheduledEndTime}
                          onChange={(newValue) =>
                            handleScheduledEndTimeChange(newValue)
                          }
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid container justifyContent="flex-end">
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
                        Task Status
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="taskStatus"
                        name="taskStatus"
                        className="form-select"
                        value={data.taskStatus}
                        onChange={handleInputChange}
                      >
                        {TicketStatusOptions.filter(
                          (status) => status.id !== ""
                        ).map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.name}
                          </option>
                        ))}
                      </select>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid> */}
              <Grid
                container
                justifyContent="flex-end"
                style={{ marginTop: "15px" }}
              >
                <Grid item xs={3}>
                  <h2
                    className="align-right"
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    Note
                  </h2>
                </Grid>
                <Grid item xs={9}>
                  <textarea
                    type="text"
                    id="note"
                    name="note"
                    className="form-control input-field-2"
                    rows="4"
                    value={data.note}
                    onChange={handleInputChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </MDBCol>
        </MDBRow>

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
                  {isSubmitting ? "Submitting..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary custom-btn-margin"
                  onClick={() => handleGoBack(data.ticketId)}
                >
                  Cancel
                </button>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBCol>
      </Grid>

      <Dialog
        open={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Image Preview
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setIsImagePreviewOpen(false)}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Gallery items={images} />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default EditTicketTask;
