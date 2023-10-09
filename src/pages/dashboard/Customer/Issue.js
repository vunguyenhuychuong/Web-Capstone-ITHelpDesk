import React, { useEffect, useState } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { priorityOption } from "../Admin/tableComlumn";
import { createTicketByCustomer } from "../../../app/api/ticket";
import { toast } from "react-toastify";
import { getAllCategories } from "../../../app/api/category";

const RequestIssues = ({ onClose }) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    priority: 0,
    categoryId: 0,
    attachmentUrl: "",
  });

  const [dataCategories, setDataCategories] = useState([]);

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
    try {
      const result = await createTicketByCustomer({
        title: data.title,
        description: data.description,
        priority: data.priority,
        categoryId: data.categoryId,
        attachmentUrl: data.attachmentUrl,
      });
      console.log(result);
      toast.success("Ticket created successfully");
      onClose();
    } catch (error) {
      toast.error("Error");
      console.log("Please check data input", error);
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <form method="post" onSubmit={handleSubmitTicket}>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="form3Example2" className="narrow-input">
                Title
              </label>
            </MDBCol>
            <MDBCol md="10">
              <MDBInput
                id="title"
                name="title"
                value={data.title}
                onChange={handleInputChange}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="form3Example2" className="narrow-input">
                Priority
              </label>
            </MDBCol>
            <MDBCol md="10">
              <select
                id="priority"
                name="priority"
                className="form-select"
                // value={data.priority}
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
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="form3Example2" className="narrow-input">
                Category
              </label>
            </MDBCol>
            <MDBCol md="10">
              <select
                id="categoryId"
                name="categoryId"
                className="form-select"
                value={data.categoryId}
                onChange={handleInputChange}
              >
                {dataCategories
                  .filter(category => category.id !== "") // Filter out the disabled option
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
                Submit
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
