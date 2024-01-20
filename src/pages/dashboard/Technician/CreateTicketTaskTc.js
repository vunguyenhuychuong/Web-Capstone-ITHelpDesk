import React, { useEffect, useState } from "react";
import "../../../assets/css/ticketSolution.css";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { ArrowBack, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
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
import { useSelector } from "react-redux";

const CreateTicketTaskTc = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const userId = parseInt(user.user.id, 10);
  const [data, setData] = useState({
    ticketId: 1,
    title: "",
    description: "",
    taskStatus: 1,
    technicianId: userId,
    priority: 1,
    scheduledStartTime: "",
    scheduledEndTime: "",
    progress: 1,
    attachmentUrls: [],
  });
  const [dataTeam, setDataTeam] = useState([]);
  const [dataTechnician, setDataTechnician] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledStartTime, setScheduledStartTime] = useState(moment());
  const [scheduledEndTime, setScheduledEndTime] = useState(moment());
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    description: "",
  });

  const images = imagePreviewUrl.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

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

  useEffect(() => {
    fetchDataTeam();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }

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

  const validateDate = (reviewDate, expiredDate) => {
    if (!reviewDate || !expiredDate) {
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
        toast.info("Review Date must be earlier than Expired Date.");
        return;
      }

      const formattedScheduledStartTime = moment(data.reviewDate).format(
        "YYYY-MM-DDTHH:mm:ss"
      );
      const formattedScheduledEndTime = moment(data.expiredDate).format(
        "YYYY-MM-DDTHH:mm:ss"
      );

      const updatedData = {
        ...data,
        attachmentUrls: attachmentUrls,
        scheduledStartTime: formattedScheduledStartTime,
        scheduledEndTime: formattedScheduledEndTime,
      };

      setData(updatedData);
      await createTicketTask({
        ticketId: data.ticketId,
        title: data.title,
        description: data.description,
        taskStatus: data.taskStatus,
        technicianId: data.technicianId,
        priority: parseInt(data.priority, 10),
        scheduledStartTime: data.scheduledStartTime,
        scheduledEndTime: data.scheduledEndTime,
        progress: data.progress,
        attachmentUrls: data.attachmentUrls,
      });
      navigate("/home/homeTechnician");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(`/home/homeTechnician`);
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
            <MDBCol md="8" className="mt-2">
              <div className="d-flex align-items-center">
                <Stack direction={"row"} alignItems={"center"}>
                  <Button>
                    <ArrowBack
                      onClick={handleGoBack}
                      style={{ color: "#0099FF" }}
                    />
                  </Button>
                </Stack>

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
                    New Create Task Technician
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
                        <span style={{ color: "red" }}>*</span>Title
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
                          marginBottom: "20px",
                        }}
                      >
                        TicketId
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <input
                        type="number"
                        name="ticketId"
                        className="form-control-text input-field"
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
                  id="attachmentUrl"
                  onChange={handleFileChange}
                  multiple
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
                        id="technician"
                        name="technician"
                        className="form-select-custom"
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
                          textAlign: "right",
                        }}
                      >
                        Schedule startTime
                      </h2>
                    </Grid>
                    <Grid item xs={5}>
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DateTimePicker
                          disablePast
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
                          disablePast
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
                          textAlign: "right",
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
                  onClick={handleGoBack}
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

export default CreateTicketTaskTc;
