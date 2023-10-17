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
import { createTicketByManager, getTicketByTicketId } from "../../../app/api/ticket";
import { toast } from "react-toastify";
import CategoryApi from "../../../app/api/category";
import { getAllServices } from "../../../app/api/service";
import ModeApi from "../../../app/api/mode";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const EditTicket = ({ onClose , selectedTicketData  }) => {
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
    if(selectedTicketData) {
      setData((prevData) => ({
        ...prevData,
        requesterId: selectedTicketData.requesterId,
        title: selectedTicketData.title,
        description: selectedTicketData.description,
        categoryId: selectedTicketData.categoryId,
        priority: selectedTicketData.priority,
        ticketStatus: selectedTicketData.ticketStatus,
      }))
    }
    fetchDataManager();
    
  }, [selectedTicketData]);

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
    setSelectedFile(e.target.files[0]);
    console.log(selectedFile);
  };

  const onHandleEditTicket = async () => {
    // try{
    //   const response = 
    // }catch(error){

    // }
  }

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow className="mb-4">
          <MDBCol className="text-center">
            <h2>Edit Ticket</h2>
          </MDBCol>
        </MDBRow>
        <form method="post">
          <MDBRow className="mb-4"></MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="requesterId" className="narrow-input">
                Requester Id
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
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="requestId" className="narrow-input">
                Mode Id
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
                Ticket Status
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
                Impact
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
                <option value="">Select Priority</option>
                {priorityOption.map((priorityItem) => (
                  <option key={priorityItem.id} value={parseInt(priorityItem.id, 10)}>
                    {priorityItem.name}
                  </option>
                ))}
              </select>
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="title" className="narrow-input">
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

export default EditTicket;
