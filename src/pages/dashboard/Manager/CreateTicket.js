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
import { getAllCategories } from "../../../app/api/category";
import { getAllServices } from "../../../app/api/service";
import { getAllTeam } from "../../../app/api/team";

const CreateTicket = ({ onClose }) => {
  const [data, setData] = useState({
    requesterId: 0,
    title: "",
    description: "",
    modeId: 0,
    serviceId: 0,
    teamId: 0,
    ticketStatus: 0,
    priority: 0,
    impact: 0,
    urgency: 0,
    categoryId: 0,
    attachmentUrl: "",
  });

  const [dataCategories, setDataCategories] = useState([]);
  const [dataServices, setDataServices] = useState([]);
  const [dataTeam, setDataTeam] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDataManager = async () => {
    try {
      const response = await getAllCategories();
      const responseService = await getAllServices();
      const responseTeam = await getAllTeam();
      const categoriesArray = Object.values(response);
      setDataCategories(categoriesArray);
      setDataServices(responseService);
      setDataTeam(responseTeam);
      console.log(responseTeam);
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
    if (name === "priority" || name === "requesterId" || name === "modeId" || name === "categoryId" || name === "impact" || name === "teamId" || name === "ticketStatus" || name === "urgency") {
      const numericValue  = parseInt(value, 10);

      setData((prevData) => ({
        ...prevData,
        [name]: numericValue ,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData((prevData) => ({
      ...prevData,
      attachmentUrl: file,
    }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    // if (!data.title || !data.priority || !data.categoryId || !data.teamId || !data.ticketStatus || !data.impact || !data.urgency) {
    //   toast.warning("Please fill out all fields");
    //   return;
    // }
  
    setIsSubmitting(true);
    try {
      const result = await createTicketByManager({
        requesterId: data.requesterId,
        title: data.title,
        description: data.description,
        modeId: data.modeId,
        serviceId: data.serviceId,
        teamId: data.teamId,
        ticketStatus: data.ticketStatus,
        priority: data.priority,
        impact: data.impact,
        urgency: data.urgency,
        categoryId: data.categoryId,
        attachmentUrl: data.attachmentUrl,
      });
      console.log(result);
      toast.success("Ticket created successfully");
      fetchDataManager();
      onClose();
    } catch (error) {
      toast.error("Error");
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
              <input
                id="modeId"
                type="number"
                name="modeId"
                min={0}
                className="form-control"
                value={data.modeId}
                onChange={handleInputChange}
              />
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
                Team
              </label>
            </MDBCol>
            <MDBCol md="3">
              <select
                id="teamId"
                name="teamId"
                className="form-select"
                value={data.teamId}
                onChange={handleInputChange}
              >
                {dataTeam
                  .filter((team) => team.id !== "")
                  .map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
              </select>
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
                  <option key={priorityItem.id} value={priorityItem.name}>
                    {priorityItem.id}
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
                value={data.attachmentUrl}
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
                onClick={handleSubmitTicket}
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
