import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTable,
  MDBTableBody,
} from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "../../../assets/css/EditTicket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import CategoryApi from "../../../app/api/category";
import { getAllServices } from "../../../app/api/service";
import ModeApi from "../../../app/api/mode";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FaEdit, FaPlus, FaTicketAlt } from "react-icons/fa";
import {
  ArrowBack,
  ArrowRight,
  ChatOutlined,
  MessageRounded,
  MessageSharp,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import useTicketData from "./useTicketData";
import AssignTicketModal from "./AssignTicketModal";
import EditTicket from "./EditTicket";
import { Dialog, Grid } from "@mui/material";
import {
  ImpactOptions,
  TicketStatusOptions,
  UrgencyOptions,
  priorityOption,
} from "../../helpers/tableComlumn";

const DetailTicket = () => {
  const { ticketId } = useParams();
  const { data, loading, setData } = useTicketData(ticketId);
  const [dataCategories, setDataCategories] = useState([]);
  const [dataServices, setDataServices] = useState([]);
  const [dataMode, setDataMode] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();
  const fetchDataManager = async () => {
    try {
      const fetchCategories = await CategoryApi.getAllCategories();
      const fetchModes = await ModeApi.getMode();
      const responseService = await getAllServices();
      setDataCategories(fetchCategories);
      setDataServices(responseService);
      setDataMode(fetchModes);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const handleOpenEditTicket = () => {
    setEditDialogOpen(true);
  };

  const handleCloseEditTicket = () => {
    setEditDialogOpen(false);
  };

  const handleOpenAssignTicket = () => {
    setDialogOpen(true);
  };

  const handleCloseAssignTicket = () => {
    setDialogOpen(false);
  };

  const handleGoBack = () => {
    navigate(`/home/listTicket`);
  };

  useEffect(() => {
    fetchDataManager();
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(selectedFile);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section
      style={{ backgroundColor: "#fff" }}
    >
      <Grid
        container
        style={{
          border: "1px solid #ccc",
          paddingRight: "10px",
          paddingLeft: "10px",
        }}
      >
        <Grid item xs={3}>
          <MDBRow md="12">
            <MDBRow className="border-box">
              <MDBCol md="12">
                  <h2 className="heading-padding">All Request(2)</h2>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="12" className="description-label">
                <div className="row">
                  <div className="col-md-2">
                    <div className="icon-container">
                      <FaTicketAlt color="#007bff" />
                    </div>
                  </div>
                  <div className="col-md-10">
                    <div>
                      <p>#3 Tests</p>
                      <h5>DueBy Date: -</h5>
                      <h5>Requester: Guest</h5>
                      <p>
                        <small className="text-muted">
                          <MessageRounded /> <FaPlus />{" "}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBRow>
        </Grid>
        <Grid item style={{ flex: 1 }}>
          <MDBCol md="12">
            <MDBRow className="border-box">
              <MDBCol md="1" className="mt-2">
                <div className="d-flex align-items-center">
                  <button type="button" className="btn btn-link icon-label">
                    <ArrowBack onClick={handleGoBack} />
                  </button>
                </div>
              </MDBCol>
              <MDBCol md="2" className="mt-2">
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-link narrow-input icon-label"
                    onClick={handleOpenEditTicket}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-link narrow-input icon-label"
                    onClick={handleOpenAssignTicket}
                  >
                    Assign
                  </button>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBCol>
          <MDBRow className="mb-4">
            <MDBCol
              md="6"
              className="mt-2"
              style={{ display: "flex", alignItems: "center" }}
            >
              <div
                className="circular-container"
                style={{ marginRight: "10px" }}
              >
                <FaTicketAlt size="2em" color="#007bff" />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ marginBottom: "5px", fontSize: "1.5em" }}>
                  #{data.requesterId} {data.title}
                </span>
                <span style={{ fontSize: "0.8em" }}>
                  by <span className="bold-text">Guest</span>{" "}
                  <ChatOutlined color="#007bff" /> on:
                  {data.scheduledStartTime} |
                  <span className="bold-text">DueBy:</span>{" "}
                  {data.scheduledEndTime}
                </span>
              </div>
            </MDBCol>
          </MDBRow>
          <form onSubmit={(e) => e.preventDefault()}>
            <MDBRow className="mb-4">
              <MDBCol
                md="12"
                className="d-flex justify-content-between align-items-center mt-2"
              >
                <label
                  htmlFor="form3Example2"
                  className="narrow-input description-label"
                >
                  Description
                </label>
              </MDBCol>
              <MDBCol md="12">
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  className="form-control"
                  value={data.description}
                  rows="4"
                  disabled
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="2" className="text-center mt-2">
                <label htmlFor="attachmentFile" className="narrow-input">
                  Attachment File
                </label>
              </MDBCol>
              <MDBCol md="10">
                <input
                  type="file"
                  name="file"
                  className="form-control"
                  id="attachmentUrl"
                  onChange={handleFileChange}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="d-flex mb-4">
              <MDBCol md="auto" className=" mt-2">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  data-mdb-ripple-color="dark"
                >
                  Reply All
                </button>
              </MDBCol>
              <MDBCol md="auto" className=" mt-2">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  data-mdb-ripple-color="dark"
                >
                  Reply
                </button>
              </MDBCol>
              <MDBCol md="auto" className=" mt-2">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  data-mdb-ripple-color="dark"
                >
                  Forward
                </button>
              </MDBCol>
              <MDBCol md="auto" className=" mt-2">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  data-mdb-ripple-color="dark"
                >
                  Recommended Template
                </button>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="12" className=" mt-2">
                <label className="narrow-input description-label">
                  Properties{" "}
                  <FaEdit
                    style={{
                      color: "#3399FF",
                      marginLeft: 10,
                      marginBottom: 5,
                    }}
                  />
                </label>
              </MDBCol>
            </MDBRow>
            <MDBTable bordered>
              <MDBTableBody>
                <tr>
                  <th className="gray-background align-right">Requester</th>
                  <th className="align-left">
                    {" "}
                    {data.requester.lastName} {data.requester.firstName}
                  </th>
                  <th className="gray-background align-right">Impact</th>
                  <th className="align-left">
                    {ImpactOptions[data.impact]?.name || "-"}
                  </th>
                </tr>
                <tr>
                  <th className="gray-background align-right">Status </th>
                  <th className="align-left">
                    {TicketStatusOptions[data.ticketStatus]?.name || "-"}
                  </th>
                  <th className="gray-background align-right">Impact Detail</th>
                  <th className="align-left">{data.impactDetail || "-"}</th>
                </tr>
                <tr>
                  <td className="gray-background align-right">Mode </td>
                  <td className="align-left">
                    {dataMode[data.modeId]?.name || "-"}
                  </td>
                  <td className="gray-background align-right">Urgency</td>
                  <td className="align-left">
                    {UrgencyOptions[data.urgency]?.name || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="gray-background align-right">Service Type</td>
                  <td className="align-left">{data.service.type}</td>
                  <td className="gray-background align-right">Priority </td>
                  <td className="align-left">
                    {priorityOption[data.priority]?.name || "-"}
                  </td>
                </tr>
                <tr>
                  <td className="gray-background align-right">
                    E-mail Id(To Notify){" "}
                  </td>
                  <td className="align-left">{data.requester.email || "-"}</td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td className="gray-background align-right">
                    Assign Technician{" "}
                  </td>
                  <td className="align-left">
                    {data.category.assignedTechnical || "-"}
                  </td>
                  <td className="gray-background align-right">Create Date</td>
                  <td className="align-left">{data.dueTime}</td>
                </tr>
                <tr>
                  <td className="gray-background align-right">
                    ScheduledStartTime{" "}
                  </td>
                  <td className="align-left">
                    {data.scheduledStartTime || "-"}
                  </td>
                  <td className="gray-background align-right">
                    ScheduledEndTime{" "}
                  </td>
                  <td className="align-left">{data.scheduledEndTime || "-"}</td>
                </tr>
                <tr>
                  <td className="gray-background align-right">Due Time </td>
                  <td className="align-left">{data.dueTime || "-"}</td>
                  <td className="gray-background align-right">
                    Completed Time{" "}
                  </td>
                  <td className="align-left">{data.completedTime || "-"}</td>
                </tr>
              </MDBTableBody>
            </MDBTable>
          </form>
        </Grid>
        <Grid item xs={3}>
          <MDBRow className="border-box">
            <MDBCol md="12">
              <div className="d-flex">
                <h2 className="heading-padding">More</h2>
              </div>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBRow className="mb-4">
              <MDBCol md="12" className="mt-2 text-box">
                <div className="status-container">
                  <label>Status</label>
                  <div
                    className={`status-badge ${
                      TicketStatusOptions[data.ticketStatus]?.colorClass ||
                      "bg-secondary"
                    }`}
                  ></div>
                  {TicketStatusOptions[data.ticketStatus]?.name ||
                    "Unknown Status"}
                </div>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="12" className="text-box">
                <label htmlFor="title" className="narrow-input">
                  Priority:
                  <div>
                    {priorityOption.find(
                      (priority) => priority.id === data.priority
                    )?.name || "Unknown Priority"}
                  </div>
                </label>
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              {/* <MDBCol md="12" className="mt-2">
              <label htmlFor="title" className="narrow-input">
                Category :
                {dataCategories.find(
                  (category) => category.id === data.categoryId
                )?.name || "Unknown Category"}
              </label>
            </MDBCol> */}
            </MDBRow>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="12" className=" mt-2">
              <label className="narrow-input description-label">
                <FaPlus
                  style={{ color: "#3399FF", marginLeft: 10, marginBottom: 5 }}
                />
                Share Request
              </label>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="12" className=" mt-2">
              <label className="narrow-input">
                <ArrowRight /> Associate Problems
              </label>
            </MDBCol>
            <MDBCol md="12" className=" mt-2">
              <label className="narrow-input">
                <ArrowRight /> Associate Change
              </label>
            </MDBCol>
            <MDBCol md="12" className=" mt-2">
              <label className="narrow-input">
                <ArrowRight /> Associate Project
              </label>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="12" className=" mt-2 description-label">
              <label className="narrow-input">Tags</label>
              <label className="narrow-input">No tag added</label>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol
              md="12"
              className="d-flex align-items-center mt-2 description-label"
            >
              <img
                src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                alt=""
                className="img-avatar"
              />
              <div className="ms-3">
                <p className="fw-bold mb-1">
                  Guest <MessageSharp style={{ color: "#3399FF" }} />{" "}
                </p>
                <p className="text-muted mb-0">Requests(2) | Assets</p>
              </div>
            </MDBCol>
            <MDBTable bordered>
              <MDBTableBody>
                <tr>
                  <th>Employee ID</th>
                  <th>{data.requester.id || "-"}</th>
                </tr>
                <tr>
                  <th>Department Name</th>
                  <th>{data.requester.id || "-"}</th>
                </tr>
                <tr>
                  <th>Phone</th>
                  <th>{data.requester.id || "-"}</th>
                </tr>
                <tr>
                  <th>Job Title</th>
                  <th>{data.requester.id || "-"}</th>
                </tr>
                <tr>
                  <th>Business Impact</th>
                  <th>{data.requester.id || "-"}</th>
                </tr>
                <tr>
                  <th>Reporting To</th>
                  <th>{data.requester.id || "-"}</th>
                </tr>
              </MDBTableBody>
            </MDBTable>
          </MDBRow>
        </Grid>
      </Grid>

      <AssignTicketModal
        open={dialogOpen}
        onClose={handleCloseAssignTicket}
        ticketId={ticketId}
      />

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditTicket}
        maxWidth="lg"
        fullWidth
      >
        <EditTicket onClose={handleCloseEditTicket} />
      </Dialog>
    </section>
  );
};

export default DetailTicket;
