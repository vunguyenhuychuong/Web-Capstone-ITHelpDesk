import { useEffect, useState } from "react";
import { UpdateTeam, getManagerList, getTeamById } from "../../../app/api/team";
import { toast } from "react-toastify";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";

const EditTeam = ({ onClose, teamId, onFetchDataTeam }) => {
  const [data, setData] = useState({
    name: "",
    managerId: 1,
    location: "",
    description: "",
    isActive: true,
  });
  const [dataManagers, setDataManagers] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    managerId: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTeamById(teamId);
        const Managers = await getManagerList();
        setDataManagers(Managers);
        if (result) {
          setData({
            name: result.name || "",
            description: result.description || "",
            location: result.location || "",
            managerId: result.managerId || Managers[0]?.id || "",
            isActive: result.isActive,
          });
        } else {
          console.error("Error: Received undefined or null result from API");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (teamId) {
      fetchData();
    }
  }, [teamId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validate the field and update the errors
    const errors = validateField(name, value);
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errors[name] || "",
    }));
  };

  const validateField = (name, value) => {
    const errors = {};

    if (name === "name" && !value.trim()) {
      errors.name = "Team Name is required";
    }

    if (name === "description" && !value.trim()) {
      errors.description = "Description is required";
    }

    if (name === "managerId" && !value) {
      errors.managerId = "Manager is required";
    }

    if (name === "location" && !value.trim()) {
      errors.location = "Location is required";
    }

    return errors;
  };

  const handleCancelEdit = () => {
    onClose();
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onHandleEditTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await UpdateTeam(teamId, data);
      setIsSubmitting(false);
      toast.success("Update Mode successful", {
        autoClose: 1000,
        hideProgressBar: false,
      });
      onClose();
      onFetchDataTeam();
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
            <h2>Edit Team</h2>
          </MDBCol>
        </MDBRow>
        <form onSubmit={(e) => e.preventDefault()}>
          <MDBRow className="mb-4">
            <MDBRow className="mb-4">
              <MDBCol md="2" className="text-center mt-2">
                <label htmlFor="title" className="narrow-input">
                  Name
                </label>
              </MDBCol>
              <MDBCol md="10">
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-control"
                  value={data.name}
                  onChange={handleInputChange}
                />
                {fieldErrors.name && (
                  <div style={{ color: "red" }}>{fieldErrors.name}</div>
                )}
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="2" className="text-center mt-2">
                <label htmlFor="title" className="narrow-input">
                  Location
                </label>
              </MDBCol>
              <MDBCol md="10">
                <input
                  id="location"
                  type="text"
                  name="location"
                  className="form-control"
                  value={data.location}
                  onChange={handleInputChange}
                />
                {fieldErrors.location && (
                  <div style={{ color: "red" }}>{fieldErrors.location}</div>
                )}
              </MDBCol>
            </MDBRow>
            <MDBRow className="mb-4">
              <MDBCol md="2" className="text-center mt-2">
                <label htmlFor="title" className="narrow-input">
                  Manager
                </label>
              </MDBCol>
              <MDBCol md="10">
                <select
                  id="managerId"
                  name="managerId"
                  className="form-select"
                  value={data.managerId}
                  onChange={handleInputChange}
                  style={{ marginTop: "10px" }}
                >
                  {dataManagers
                    .filter((manager) => manager.id !== "")
                    .map((manager) => (
                      <option key={manager.id} value={manager.id}>
                        {manager.lastName} {manager.firstName}
                      </option>
                    ))}
                </select>
                {fieldErrors.managerId && (
                  <div style={{ color: "red" }}>{fieldErrors.managerId}</div>
                )}
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
                  onChange={handleInputChange}
                />
                {fieldErrors.description && (
                  <div style={{ color: "red" }}>{fieldErrors.description}</div>
                )}
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

export default EditTeam;
