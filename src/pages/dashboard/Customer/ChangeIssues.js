import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";

import CategoryApi from "../../../app/api/category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  editTicketByCustomer,
  getTicketByTicketId,
} from "../../../app/api/ticket";
import { FaTicketAlt } from "react-icons/fa";
import { priorityOption } from "../../helpers/tableComlumn";

const ChangeIssues = ({ onClose, ticketId }) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    priority: 0,
    categoryId: 1,
    attachmentUrl: "",
    requesterId: 1,
    id: 1,
  });

  const [dataCategories, setDataCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [ticketData, setTicketData] = useState(null);

  const fetchCategory = async () => {
    try {
      const fetchCategories = await CategoryApi.getAllCategories();
      setDataCategories(fetchCategories?.data);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    console.log(selectedFile);
  };

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const ticket = await getTicketByTicketId(ticketId);
        setTicketData(ticket);
        setData({
          title: ticket.title || "",
          description: ticket.description || "",
          priority: ticket.priority || 0,
          categoryId: ticket.categoryId || 1,
          attachmentUrl: ticket.attachmentUrl || null,
          requesterId: ticket.requesterId || 1,
          id: ticket.id || 1,
        });
        console.log(data.title);
      } catch (error) {
        console.log("Error fetching ticket data", error);
      }
    };
    fetchCategory();
    fetchTicketData();
  }, [ticketId]);

  const handleSubmitTicket = async (e, updateData) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await editTicketByCustomer(ticketId, updateData);
      onClose();
    } catch (error) {
      console.log("Error updating ticket", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  const handleInputChange = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;
    if (name === "priority") {
      const priorityValue = parseInt(value, 10);

      setData((prevData) => ({
        ...prevData,
        [name]: priorityValue,
      }));
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer onClick={onClose}>
        <MDBRow className="mb-4 custom-padding grey-row">
          <MDBCol className="text-left-corner d-flex align-items-center custom-padding">
            <div className="icon-container">
              <FaTicketAlt color="#007bff" />
            </div>
            <h2 className="ms-3" style={{ fontFamily: "Arial, sans-serif" }}>
              Request ID : #{data.requesterId}
            </h2>
          </MDBCol>
        </MDBRow>
        <form onSubmit={handleSubmitTicket} onClick={handleFormClick}>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="form3Example2" className="narrow-input">
                <span style={{ color: "red" }}>*</span> Title
              </label>
            </MDBCol>
            <MDBCol md="10">
              <input
                id="title"
                type="text"
                name="title"
                className="form-control input-small"
                value={data.title}
                onChange={handleInputChange}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="form3Example2" className="narrow-input">
                <span style={{ color: "red" }}>*</span> Priority
              </label>
            </MDBCol>
            <MDBCol md="10">
              <select
                id="priority"
                name="priority"
                className="form-select input-small"
                value={data.priority}
                onChange={handleInputChange}
              >
                {priorityOption.map((priorityItem) => (
                  <option key={priorityItem.id} value={priorityItem.id}>
                    {priorityItem.name}
                  </option>
                ))}
              </select>
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="form3Example2" className="narrow-input">
                <span style={{ color: "red" }}>*</span> Category
              </label>
            </MDBCol>
            <MDBCol md="10">
              <select
                id="categoryId"
                name="categoryId"
                className="form-select input-small"
                value={data.categoryId}
                onChange={handleInputChange}
              >
                {dataCategories
                  .filter((category) => category.id !== "") // Filter out the disabled option
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
                <FontAwesomeIcon className="me-2" />
                Attachment
              </label>
            </MDBCol>
            <MDBCol md="10">
              <div className="custom-file mb-3">
                <input
                  type="file"
                  name="file"
                  className="form-control"
                  id="attachmentUrl"
                  onChange={handleFileChange}
                />
              </div>
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
                className="form-control input-small"
                rows="4"
                value={data.description}
                onChange={handleInputChange}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="12" className="d-flex justify-content-center">
              <MDBBtn
                small="true"
                color="primary"
                type="submit"
                onClick={handleSubmitTicket}
                className="me-2"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </MDBBtn>
              <MDBBtn color="danger" onClick={onClose}>
                Cancel
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </form>
      </MDBContainer>
    </section>
  );
};

export default ChangeIssues;
