import { useState } from "react";
import { AddTeam, getCityList, getManagerList } from "../../../app/api/team";
import { MDBBtn, MDBCol, MDBContainer, MDBRow } from "mdb-react-ui-kit";
import "../../../assets/css/ticket.css";
import { useEffect } from "react";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { getAllCategories } from "../../../app/api/category";

const CreateTeam = ({ onClose, onFetchDataTeam }) => {
  const [data, setData] = useState({
    name: "",
    managerId: 1,
    location: "",
    description: "",
    categoryId: 1,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataManagers, setDataManagers] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    managerId: "",
    location: "",
    description: "",
  });

  const fetchDataCityList = async () => {
    try {
      const cities = await getCityList();
      setDataCity(cities);
      if (cities?.length > 0) {
        setData((prevData) => ({
          ...prevData,
          location: cities[0].name,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchCategory = async () => {
    try {
      const fetchCategories = await getAllCategories();
      setDataCategories(fetchCategories?.data);
      setData((prevData) => ({
        ...prevData,
        categoryId: fetchCategories.data[0]?.id,
      }));
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const fetchDataManagerList = async () => {
    try {
      const Managers = await getManagerList();
      setDataManagers(Managers);
      if (Managers?.length > 0) {
        setData((prevData) => ({
          ...prevData,
          managerId: Managers[0].id,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataManagerList();
    fetchDataCityList();
    fetchCategory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmitTeam = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!data.name) {
      errors.name = "Mode Name is required";
    }

    if (!data.description) {
      errors.description = "Description is required";
    }

    if (!data.managerId) {
      errors.managerId = "Manager is required";
    }

    if (!data.location) {
      errors.location = "Location is required";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await AddTeam(data);
      setIsSubmitting(false);
      handleClick();
      onClose();
      onFetchDataTeam();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <MDBRow className="mb-4">
          <MDBCol className="text-center">
            <h2>Create a New Team</h2>
          </MDBCol>
        </MDBRow>
        <form method="post" onSubmit={handleSubmitTeam}>
          <MDBRow className="mb-4">
            <MDBCol md="2" className="text-center mt-2">
              <label htmlFor="requesterId" className="narrow-input">
                <span style={{ color: "red" }}>*</span>Team Name
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
                style={{ marginTop: "10px" }}
              />
              {fieldErrors.name && (
                <div style={{ color: "red" }}>{fieldErrors.name}</div>
              )}
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2 mb-2">
              <label htmlFor="title" className="narrow-input">
                <span style={{ color: "red" }}>*</span>Manager
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
                  ?.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.lastName} {manager.firstName}
                    </option>
                  ))}
              </select>
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2 mb-2">
              <label htmlFor="title" className="narrow-input">
                <span style={{ color: "red" }}>*</span>Category
              </label>
            </MDBCol>
            <MDBCol md="10">
              <select
                id="categoryId"
                name="categoryId"
                className="form-select"
                value={data.categoryId}
                onChange={handleInputChange}
                style={{ marginTop: "10px" }}
              >
                {dataCategories
                  .filter((cate) => cate.id !== "")
                  ?.map((cate) => (
                    <option key={cate.id} value={cate.id}>
                      {cate.name}
                    </option>
                  ))}
              </select>
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2 mb-2">
              <label htmlFor="title" className="narrow-input">
                <span style={{ color: "red" }}>*</span>Location
              </label>
            </MDBCol>
            <MDBCol md="10">
              <select
                id="location"
                name="location"
                className="form-select"
                value={data.location}
                onChange={handleInputChange}
                style={{ marginTop: "10px" }}
              >
                {dataCity?.map((city) => (
                  <option key={city.code} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {fieldErrors.location && (
                <div style={{ color: "red" }}>{fieldErrors.location}</div>
              )}
            </MDBCol>
            <MDBCol md="2" className="text-center mt-2 mb-2">
              <label htmlFor="title" className="narrow-input">
                <span style={{ color: "red" }}>*</span>Description
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
                style={{ marginTop: "10px" }}
              />
              {fieldErrors.description && (
                <div style={{ color: "red" }}>{fieldErrors.description}</div>
              )}
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
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <MuiAlert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Team created successfully!
          </MuiAlert>
        </Snackbar>
      </MDBContainer>
    </section>
  );
};

export default CreateTeam;
