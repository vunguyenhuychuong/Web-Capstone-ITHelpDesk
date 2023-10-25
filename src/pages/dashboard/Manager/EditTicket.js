import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "../../../assets/css/EditTicket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import {
  ImpactOptions,
  TicketStatusOptions,
  UrgencyOptions,
  priorityOption,
} from "../Admin/tableComlumn";
import CategoryApi from "../../../app/api/category";
import { getAllServices } from "../../../app/api/service";
import ModeApi from "../../../app/api/mode";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  editTicketByManager,
  getTicketByTicketId,
} from "../../../app/api/ticket";
import { toast } from "react-toastify";
import { FaTicketAlt } from "react-icons/fa";
import { ArrowBack, ChatOutlined } from "@mui/icons-material";
import { useParams } from "react-router-dom";

const EditTicket = ({ onClose }) => {
  const { ticketId } = useParams();
  const [data, setData] = useState({
    requesterId: 0,
    title: "",
    description: "",
    modeId: 1,
    serviceId: 1,
    impactDetail: "",
    ticketStatus: 0,
    priority: 0,
    impact: 0,
    urgency: 0,
    categoryId: 1,
    attachmentUrl: "",
    scheduledStartTime: "",
    scheduledEndTime: "",
    dueTime: "",
    completedTime: "",
  });

  const [dataCategories, setDataCategories] = useState([]);
  const [dataServices, setDataServices] = useState([]);
  const [dataMode, setDataMode] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const ticketData = await getTicketByTicketId(ticketId);
        console.log(ticketData);
        setData((prevData) => ({
          ...prevData,
          requesterId: ticketData.requesterId,
          title: ticketData.title,
          description: ticketData.description,
          modeId: ticketData.modeId,
          categoryId: ticketData.categoryId,
          priority: ticketData.priority,
          impactDetail: ticketData.impactDetail,
          ticketStatus: ticketData.ticketStatus,
          scheduledStartTime: ticketData.scheduledStartTime,
          scheduledEndTime: ticketData.scheduledEndTime,
          dueTime: ticketData.dueTime,
          completedTime: ticketData.completedTime
        }));
      } catch (error) {
        console.error("Error fetching ticket data: ", error);
      }
    };
    fetchTicketData();
    fetchDataManager();
  }, [ticketId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId" || name === "modeId" || name === "serviceId") {
      const selectedValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: selectedValue }));
    } else if (
      name === "priority" ||
      name === "requesterId" ||
      name === "impact" ||
      name === "ticketStatus" ||
      name === "urgency"
    ) {
      const numericValue = parseInt(value, 10);
      setData((prevData) => ({ ...prevData, [name]: numericValue }));
    } else {
      setData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(selectedFile);
  };

  const onHandleEditTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await editTicketByManager(ticketId, data);
      setIsSubmitting(false);
      console.log(res);
      if (res.isError && res.responseException?.exceptionMessage) {
        toast.info('Ticket is currently being executed and cannot be updated.');
      } else {
        toast.success("Ticket updated successfully");
        onClose();
      }
    }catch(error){
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data?.message || 'Ticket can not be updated when it is being executed';
        toast.error(errorMessage);
      } else {
        toast.info('Error updating ticket. Please try again later');
      }
    }finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      style={{ backgroundColor: "#DDDDDD" }}
      className="edit-ticket-container"
    >
      <MDBContainer>
        <MDBCol md="12" className="text-start mt-2">
          <MDBRow>
            <MDBCol md="1" className="mt-2">
              <div className="d-flex align-items-center">
                <button type="button" className="btn btn-link icon-label">
                  <ArrowBack />
                </button>
              </div>
            </MDBCol>
            <MDBCol md="1" className="mt-2">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-link narrow-input icon-label"
                >
                  Edit
                </button>
                <select className="btn btn-link narrow-input custom-select">
                  <option value="1">Assign</option>
                  <option value="2">Not Assign</option>
                  <option value="3">On Hold</option>
                </select>
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
            <div className="circular-container" style={{ marginRight: "10px" }}>
              <FaTicketAlt size="2em" color="#007bff" />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ marginBottom: "5px" }}>
                #{data.requesterId} {data.title}
              </span>
              <span style={{ fontSize: "0.8em" }}>
                by Guest <ChatOutlined color="#007bff" /> on
                {data.scheduledStartTime} | DueBy: {data.scheduledEndTime}
              </span>
            </div>
          </MDBCol>
        </MDBRow>
        <form onSubmit={(e) => e.preventDefault()}>
          <MDBRow className="mb-4">
            <MDBCol md="12" className="text-start mt-2">
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
                onChange={handleInputChange}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="requesterId" className="narrow-input">
                Category
              </label>
            </MDBCol>
            <MDBCol md="5">
              <select
                id="categoryId"
                name="categoryId"
                className="form-select"
                value={data.categoryId}
                onChange={handleInputChange}
              >
                {dataCategories
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </MDBCol>
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
                Title
              </label>
            </MDBCol>
            <MDBCol md="5">
              <input
                id="title"
                type="text"
                name="title"
                className="form-control"
                value={data.title}
                onChange={handleInputChange}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="requestId" className="narrow-input">
                Mode Id
              </label>
            </MDBCol>
            <MDBCol md="5">
              <select
                id="modeId"
                name="modeId"
                className="form-select"
                value={data.modeId}
                onChange={handleInputChange}
              >
                {dataMode
                  .map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.name}
                    </option>
                  ))}
              </select>
            </MDBCol>
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
                Service
              </label>
            </MDBCol>
            <MDBCol md="5">
              <select
                id="serviceId"
                name="serviceId"
                className="form-select"
                value={data.serviceId}
                onChange={handleInputChange}
              >
                {dataServices
                  .map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.description}
                    </option>
                  ))}
              </select>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="requestId" className="narrow-input">
                Impact Detail
              </label>
            </MDBCol>
            <MDBCol md="5">
              <input
                id="impactDetail"
                name="impactDetail"
                className="form-control"
                value={data.impactDetail}
                onChange={handleInputChange}
              />
            </MDBCol>
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
                Status
              </label>
            </MDBCol>
            <MDBCol md="5">
              <select
                id="ticketStatus"
                name="ticketStatus"
                className="form-select"
                value={data.ticketStatus}
                onChange={handleInputChange}
              >
                {TicketStatusOptions.map((ticketStatus) => (
                  <option key={ticketStatus.id} value={ticketStatus.id}>
                    {ticketStatus.name}
                  </option>
                ))}
              </select>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="requestId" className="narrow-input">
                Impact
              </label>
            </MDBCol>
            <MDBCol md="5">
              <select
                id="impact"
                name="impact"
                className="form-select"
                value={data.impact}
                onChange={handleInputChange}
              >
                {ImpactOptions.map((impact) => (
                  <option key={impact.id} value={impact.id}>
                    {impact.name}
                  </option>
                ))}
              </select>
            </MDBCol>
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
                Urgency
              </label>
            </MDBCol>
            <MDBCol md="5">
              <select
                id="urgency"
                name="urgency"
                className="form-select"
                value={data.urgency}
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
          <MDBRow className="mb-4">
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="requestId" className="narrow-input">
                ScheduledStartTime
              </label>
            </MDBCol>
            <MDBCol md="5">
              <input
                id="scheduledStartTime"
                name="scheduledStartTime"
                className="form-control"
                value={data.scheduledStartTime}
                onChange={handleInputChange}
              />
            </MDBCol>
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
                ScheduledEndTime
              </label>
            </MDBCol>
            <MDBCol md="5">
              <input
                id="scheduledEndTime"
                name="scheduledEndTime"
                className="form-control"
                value={data.scheduledEndTime}
                onChange={handleInputChange}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="requestId" className="narrow-input">
                DueTime
              </label>
            </MDBCol>
            <MDBCol md="5">
              <input
                id="dueTime"
                name="dueTime"
                className="form-control"
                value={data.dueTime}
                onChange={handleInputChange}
              />
            </MDBCol>
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
                CompletedTime
              </label>
            </MDBCol>
            <MDBCol md="5">
              <input
                id="completedTime"
                name="completedTime"
                className="form-control"
                value={data.completedTime}
                onChange={handleInputChange}
              />
            </MDBCol>
          </MDBRow>

          <MDBRow className="mb-4">
            <MDBCol md="1" className="text-center mt-2">
              <label htmlFor="attachmentFile" className="narrow-input">
                Attachment File
              </label>
            </MDBCol>
            <MDBCol md="11">
              <input
                type="file"
                name="file"
                className="form-control"
                id="attachmentUrl"
                onChange={handleFileChange}
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
                onClick={onHandleEditTicket}
              >
                Edit
              </MDBBtn>
              <MDBBtn color="danger" className="ms-2"
                onClick={onClose}>
                Cancel
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </form>
      </MDBContainer>
    </section>
  );
};

export default EditTicket;
