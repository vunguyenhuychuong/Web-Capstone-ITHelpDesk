import React, { useState } from "react";
import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import { EditorState , convertToRaw} from "draft-js";
import { Editor as DraftEditor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { CategoryOptions, priorityOption } from "../Admin/tableComlumn";
import { createTicketByCustomer } from "../../../app/api/ticket";
import { toast } from "react-toastify";


const RequestIssues = ({ onClose }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [data, setData] = useState({
    title: "",
    description: "",
    priority: 0,
    categoryId: 0,
    attachmentUrl: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // if (name === 'priority' || name === 'categoryId') {
    //   const selectedOption = name === 'priority' ? priorityOption : CategoryOptions;
    //   const selectedValue = selectedOption.find(option => option.name === value);
    //   setData(prevData => ({
    //     ...prevData,
    //     [name]: selectedValue ? selectedValue.id : 1,
    //   }));
    // } else {
    //   setData(prevData => ({
    //     ...prevData,
    //     [name]: value,
    //   }));
    // }
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setData((prevData) => ({
      ...prevData,
      attachmentUrl: file,
    }));
  };

  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    // Convert the editor content to raw JSON and update the description in the state
    const contentState = newEditorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    setData((prevData) => ({
      ...prevData,
      description: JSON.stringify(rawContentState),
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
    } catch (error) {
      toast.error("Error");
      console.log("Please check data input", error);
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <form>
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
                value={data.priority}
                onChange={handleInputChange}
              >
                <option value="">Select Priority</option>
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
                <option value="">Select Category</option>
                {CategoryOptions.map((category) => (
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
              <DraftEditor
                id="description"
                name="description"
                editorState={editorState}
                value={data.description}
                onEditorStateChange={handleEditorStateChange}
                toolbar={{
                  options: [
                    "inline",
                    "blockType",
                    "list",
                    "textAlign",
                    "link",
                    "emoji",
                    "remove",
                    "history",
                  ],
                  inline: {
                    options: ["bold", "italic", "underline", "strikethrough"],
                  },
                }}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="mb-4">
            <MDBCol md="2"></MDBCol>
            <MDBCol md="10" className="text-end">
              <MDBBtn small={true} color="primary" type="submit" onClick={handleSubmitTicket}>
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
