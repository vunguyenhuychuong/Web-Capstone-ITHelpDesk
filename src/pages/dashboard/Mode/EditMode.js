import React, { useState } from "react";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import "../../../assets/css/EditTicket.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "draft-js/dist/Draft.css";
import { getModeDetail, updateMode } from "../../../app/api/mode";
import { useEffect } from "react";
import { toast } from "react-toastify";

const EditMode = ({ onClose, modeId }) => {
  const [data, setData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getModeDetail(modeId);
        if (result) {
          setData({
            name: result.name || "",
            description: result.description || "",
          });
        } else {
          console.error("Error: Received undefined or null result from API");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (modeId) {
      fetchData();
    }
  }, [modeId]);

  const handleCancelEdit = () => {
    onClose();
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onHandleEditTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateMode(modeId, data);
      setIsSubmitting(false);
      toast.success("Update Mode successful", {
        autoClose: 1000,
        hideProgressBar: false,
      });
      onClose();
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <section
      style={{ backgroundColor: "#DDDDDD" }}
      className="edit-ticket-container"
    >
      <MDBContainer>
        <MDBRow className="mb-4">
          <MDBCol className="text-center">
            <h2>Edit Mode</h2>
          </MDBCol>
        </MDBRow>
        <form onSubmit={(e) => e.preventDefault()}>
          <MDBRow className="mb-4">
            <MDBRow className="mb-4">
              <MDBCol md="2" className="text-center mt-2">
                <label htmlFor="title" className="narrow-input">
                  Name Mode
                </label>
              </MDBCol>
              <MDBCol md="10">
                <input
                  id="title"
                  type="text"
                  name="title"
                  className="form-control"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="2" className="text-center mt-2">
                <label htmlFor="title" className="narrow-input">
                  Description
                </label>
              </MDBCol>
              <MDBCol md="10">
                <input
                  id="description"
                  type="text"
                  name="description"
                  className="form-control"
                  value={data.description}
                  onChange={(e) =>
                    setData({ ...data, description: e.target.value })
                  }
                />
              </MDBCol>
            </MDBRow>
          </MDBRow>

          <MDBRow className="mb-4">
            <MDBCol md="12" className="text-center">
              <MDBBtn
                small="true"
                color="primary"
                type="submit"
                onClick={onHandleEditTicket}
              >
                Edit
              </MDBBtn>
              <MDBBtn
                color="danger"
                className="ms-2"
                onClick={handleCancelEdit}
              >
                Cancel
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </form>
      </MDBContainer>
    </section>
  );
};

export default EditMode;
