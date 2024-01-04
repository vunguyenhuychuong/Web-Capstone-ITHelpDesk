import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
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
import { createTicketTask } from "../../../app/api/ticketTask";
import { getAllTeams } from "../../../app/api/team";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const CreateTicketTask = () => {
  const navigate = useNavigate();
  const { ticketId } = useParams();
  const [data, setData] = useState({
    ticketId: parseInt(ticketId, 10),
    title: "",
    description: "",
    taskStatus: 1,
    technicianId: 1,
    priority: 1,
    scheduledStartTime: "",
    scheduledEndTime: "",
    progress: 1,
    attachmentUrls: [],
  });
  const [dataTeam, setDataTeam] = useState([]);
  const [dataTechnician, setDataTechnician] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledStartTime, setScheduledStartTime] = useState(moment());
  const [scheduledEndTime, setScheduledEndTime] = useState(moment());
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [defaultTechnicianId, setDefaultTechnicianId] = useState(null);
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

  const images = imagePreviewUrl.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

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
      const newDefaultTechnicianId  = technicians.length > 0 ? technicians[0].id : null;

      setDefaultTechnicianId(newDefaultTechnicianId );
      setData((prevData) => ({
        ...prevData,
        technicianId: newDefaultTechnicianId ,
      }));
      setDataTechnician(technicians);
    } catch (error) {
      console.error("Error while fetching technicians", error);
    }
  };

  useEffect(() => {
    fetchDataTeam();
  }, []);

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
    const files = e.target.files;
    setSelectedFile((prevFiles) => [...prevFiles, ...files]);

    const promises = [];
    const previewUrls = [];

    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      const reader = new FileReader();

      promises.push(
        new Promise((resolve) => {
          reader.onloadend = () => {
            previewUrls.push(reader.result);
            resolve();
          };
          reader.readAsDataURL(currentFile);
        })
      );
    }

    Promise.all(promises).then(() => {
      setImagePreviewUrl(previewUrls);
    });

    setIsImagePreviewOpen(true);
  };

  const validateDate = (scheduledStartTime, scheduledEndTime) => {
    if (!scheduledStartTime || !scheduledStartTime) {
      return false;
    }
    return moment(scheduledStartTime).isBefore(scheduledEndTime);
  };

  const handleSubmitTicket = async (e, defaultTechnicianId) => {
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
      if (selectedFile.length > 0) {
        const storage = getStorage();

        for (let i = 0; i < selectedFile.length; i++) {
          const file = selectedFile[i];
          const storageRef = ref(storage, `images/${file.name}`);
          await uploadBytes(storageRef, file);

          const downloadURL = await getDownloadURL(storageRef);
          attachmentUrls.push(downloadURL);
        }
      }

      const isDataValid = validateDate(
        data.scheduledStartTime,
        data.scheduledEndTime
      );

      if (!isDataValid) {
        toast.warning(
          "scheduledStartTime must be earlier than scheduledEndTime.",
          {
            autoClose: 2000,
            hideProgressBar: false,
            position: toast.POSITION.TOP_CENTER,
          }
        );
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
        technicianId: parseInt(defaultTechnicianId),
      };
      setData(updatedData);
      await createTicketTask({
        ticketId: data.ticketId,
        title: data.title,
        description: data.description,
        taskStatus: parseInt(data.taskStatus),
        technicianId: parseInt(data.technicianId),
        priority: parseInt(data.priority, 10),
        scheduledStartTime: data.scheduledStartTime,
        scheduledEndTime: data.scheduledEndTime,
        progress: parseInt(data.progress),
        attachmentUrls: data.attachmentUrls,
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
                    onClick={() => handleGoBack(ticketId)}
                    className="arrow-back-icon"
                  />
                </button>

                <div
                  style={{
                    marginLeft: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "30px",
                      fontWeight: "bold",
                      marginRight: "10px",
                    }}
                  >
                    New Task
                  </h2>
                  <span style={{ fontSize: "18px", color: "#888" }}>
                    Create a new task for assistance.
                  </span>
                </div>
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
                        <span style={{ color: "red", marginRight: "5px" }}>
                          *
                        </span>
                        Title
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        type="text"
                        name="title"
                        className="form-control-text input-field"
                        id="title"
                        value={data.title}
                        onChange={handleInputChange}
                      />
                      {fieldErrors.title && (
                        <div style={{ color: "red" }}>{fieldErrors.title}</div>
                      )}
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
                          marginBottom: "25px",
                        }}
                      >
                        TicketId
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        type="number"
                        name="ticketId"
                        className="form-control input-field"
                        id="ticketId"
                        value={data.ticketId}
                        onChange={handleInputChange}
                        disabled
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={3}>
                <h2
                  className="align-right"
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "25px",
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
                  className="form-control-text input-field-2"
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
                    marginBottom: "25px",
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
                  id="attachmentUrl"
                  onChange={handleFileChange}

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
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "25px",
                        }}
                      >
                        <span style={{ color: "red" }}>*</span> Technician
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="teamId"
                        name="teamId"
                        className="form-select-custom"
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
                        id="technicianId"
                        name="technicianId"
                        className="form-select-custom"
                        value={data.technicianId}
                        onChange={handleInputChange}
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
                </Grid>

                <Grid item xs={6}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "25px",
                        }}
                      >
                        Priority
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="priority"
                        name="priority"
                        className="form-select-custom"
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
                          marginBottom: "25px",
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
                          marginBottom: "25px",
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
              <Grid container justifyContent="flex-end">
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "25px",
                        }}
                      >
                        Task Status
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="taskStatus"
                        name="taskStatus"
                        className="form-select-custom"
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
                <Grid item xs={6}>
                  <Grid container>
                    <Grid item xs={6}>
                      <h2
                        className="align-right"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          marginBottom: "25px",
                        }}
                      >
                        Progress
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <select
                        id="progress"
                        name="progress"
                        className="form-select-custom"
                        value={data.progress}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Progress</option>{" "}
                        {Object.keys(Process).map((processId) => (
                          <option key={processId} value={processId}>
                            {Process[processId]}
                          </option>
                        ))}
                      </select>
                    </Grid>
                  </Grid>
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

export default CreateTicketTask;
