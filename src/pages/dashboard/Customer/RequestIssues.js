import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { priorityOption } from "../Admin/tableComlumn";
import { createTicketByCustomer } from "../../../app/api/ticket";
import { toast } from "react-toastify";
import { getAllCategories } from "../../../app/api/category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaPaperclip } from "react-icons/fa";

const RequestIssues = ({ onClose, fetchDataTicketByUserId }) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    priority: 0,
    categoryId: 1,
    attachmentUrl: null,
  });

  const [dataCategories, setDataCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategory = async () => {
    try {
      const response = await getAllCategories();
      const categoriesArray = Object.values(response);
      setDataCategories(categoriesArray);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleInputChange = (e) => {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData((prevData) => ({
      ...prevData,
      attachmentUrl: file,
    }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
        const result = await createTicketByCustomer({
        title: data.title,
        description: data.description,
        priority: data.priority,
        categoryId: data.categoryId,
        attachmentUrl: data.attachmentUrl,
      });
      toast.success("Ticket created successfully");
      fetchDataTicketByUserId();
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
        <form method="post" onSubmit={handleSubmitTicket}>
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
                <FontAwesomeIcon icon={FaPaperclip} className="me-2" />
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
                  value={data.attachmentUrl}
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

export default RequestIssues;
