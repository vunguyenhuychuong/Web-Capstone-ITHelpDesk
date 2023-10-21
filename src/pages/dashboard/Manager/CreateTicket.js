import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import {
  ImpactOptions,
  TicketStatusOptions,
  UrgencyOptions,
  priorityOption,
} from "../Admin/tableComlumn";
import { createTicketByManager } from "../../../app/api/ticket";
import { toast } from "react-toastify";
import CategoryApi from "../../../app/api/category";
import { getAllServices } from "../../../app/api/service";
import ModeApi from "../../../app/api/mode";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const CreateTicket = ({ onClose , onTicketCreated }) => {
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
    fetchDataManager();
  }, []);

const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === "categoryId" || name === "modeId" || name === "serviceId") {
    const selectedValue = parseInt(value, 10);
    setData((prevData) => ({ ...prevData, [name]: selectedValue }));
  } else if (name === "priority" || name === "requesterId" || name === "impact" || name === "ticketStatus" || name === "urgency") {
    const numericValue = parseInt(value, 10);
    setData((prevData) => ({ ...prevData, [name]: numericValue }));
  } else {
    setData((prevData) => ({ ...prevData, [name]: value }));
  }
};

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    // if (!data.title || !data.priority || data.categoryId === 0 || data.modeId === 0 || data.serviceId === 0) {
    //   toast.warning("Please fill out all fields");
    //   return;
    // }
    setIsSubmitting(true);
    try {
      let attachmentUrl = data.attachmentUrl;
      if (selectedFile) {
        const storage = getStorage();
        const storageRef = ref(storage, "images/" + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);
        attachmentUrl = await getDownloadURL(storageRef);
      }

      const updatedData = {
        ...data,
        attachmentUrl: attachmentUrl,
      };
      console.log(updatedData);
      setData(updatedData);
      const result = await createTicketByManager({
        requesterId: data.requesterId,
        title: data.title,
        description: data.description,
        modeId: data.modeId,
        serviceId: data.serviceId,
        impactDetail: data.impactDetail,
        ticketStatus: data.ticketStatus,
        priority: data.priority,
        impact: data.impact,
        urgency: data.urgency,
        categoryId: data.categoryId,
        attachmentUrl: attachmentUrl,
      });
      toast.success("Ticket created successfully");
      onClose();
      fetchDataManager();
    } catch (error) {
      console.log("Please check data input", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow className="mb-4">
          <MDBCol className="text-center">
            <h2>Submit a New Ticket</h2>
          </MDBCol>
        </MDBRow>
        <form method="post" onSubmit={handleSubmitTicket}>
          <MDBRow className="mb-4"></MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="requesterId" className="narrow-input">
              <span style={{ color: "red" }}>*</span>Requester Id
              </label>
            </MDBCol>
            <MDBCol md="3">
              <input
                id="requesterId"
                type="number"
                name="requesterId"
                min={0}
                className="form-control"
                value={data.requesterId}
                onChange={handleInputChange}
              />
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
              <span style={{ color: "red" }}>*</span>Title
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
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="requestId" className="narrow-input">
              <span style={{ color: "red" }}>*</span>Mode Id
              </label>
            </MDBCol>
            <MDBCol md="3">
              <select
                id="modeId"
                name="modeId"
                className="form-select"
                value={data.modeId}
                onChange={handleInputChange}
              >
                {dataMode
                  .filter((mode) => mode.id !== "")
                  .map((mode) => (
                    <option key={mode.id} value={mode.id}>
                      {mode.name}
                    </option>
                  ))}
              </select>
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
              <span style={{ color: "red" }}>*</span>Service
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
                  .filter((service) => service.id !== "")
                  .map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.description}
                    </option>
                  ))}
              </select>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="requestId" className="narrow-input">
                Impact Detail
              </label>
            </MDBCol>
            <MDBCol md="3">
              <input
                id="impactDetail"
                name="impactDetail"
                className="form-control"
                value={data.impactDetail}
                onChange={handleInputChange}
              />
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
              <span style={{ color: "red" }}>*</span>Ticket Status
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
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="requestId" className="narrow-input">
              <span style={{ color: "red" }}>*</span>Impact
              </label>
            </MDBCol>
            <MDBCol md="3">
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
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
              <span style={{ color: "red" }}>*</span>Urgency
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
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="requestId" className="narrow-input">
                Priority
              </label>
            </MDBCol>
            <MDBCol md="3">
              <select
                id="priority"
                name="priority"
                className="form-select"
                onChange={handleInputChange}
              >
                {priorityOption.map((priorityItem) => (
                  <option key={priorityItem.id} value={parseInt(priorityItem.id, 10)}>
                    {priorityItem.name}
                  </option>
                ))}
              </select>
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
              <span style={{ color: "red" }}>*</span>Category
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
                  .filter((category) => category.id !== "")
                  .map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
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
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="form3Example2" className="narrow-input">
                Description
              </label>
            </MDBCol>
            <MDBCol md="10">
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

export default CreateTicket;
