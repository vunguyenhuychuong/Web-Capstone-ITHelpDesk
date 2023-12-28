import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { TypeOptions, priorityOption } from "../../../helpers/tableComlumn";
import { getAllService } from "../../../../app/api/service";
import { fetchCity, fetchDistricts, fetchWards } from "./fetchDataSelect";

const Step1 = ({ data, handleInputChange }) => {
  const [dataService, setDataServices] = useState([]);
  const [dataLocation, setDataLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [typeError, setTypeError] = useState(false);

  const fetchService = async () => {
    try {
      const response = await getAllService();
      setDataServices(response);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const handleCityChange = async (e) => {
    const { name, value } = e.target;
    handleInputChange(e);

    if (value) {
      const districtResponse = await fetchDistricts(value);
      setDistricts(districtResponse);
      setWards([]); // Reset wards when city changes
    } else {
      setDistricts([]);
      setWards([]);
    }
  };

  const validateType = (value) => {
    const isValid = value !== "";
    setTypeError(!isValid);
    return isValid;
  };

  const handleDistrictChange = async (e) => {
    const { name, value } = e.target;
    handleInputChange(e);

    if (value) {
      const wardResponse = await fetchWards(value);
      setWards(wardResponse);
    } else {
      setWards([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cityResponse = await fetchCity();
        setDataLocation(cityResponse);
      } catch (error) {
        console.log("Error while fetching data", error);
      }
    };
    fetchService();
    fetchCity();
    fetchData();
  }, []);

  return (
    <>
      <Tooltip title="Select the topic issue you have problems" arrow>
        <FormControl fullWidth variant="outlined" style={{ marginBottom: 16 }}>
          <InputLabel id="category-label">Service</InputLabel>
          <Select
            labelId="category-label"
            id="serviceId"
            name="serviceId"
            value={data.serviceId}
            onChange={handleInputChange}
            label="Service"
          >
            {dataService
              .filter((service) => service.id !== "") // Filter out the disabled option
              .map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.description}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Tooltip>

      <Tooltip
        title="Select the level issue so we have can suggest time to solve help you"
        arrow
      >
        <FormControl fullWidth variant="outlined">
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
            id="priority"
            name="priority"
            value={data.priority}
            onChange={handleInputChange}
            label="Priority"
          >
            {priorityOption
              .filter((priority) => priority.id !== "") // Filter out the disabled option
              .map((priority) => (
                <MenuItem key={priority.id} value={priority.id}>
                  {priority.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Tooltip>

      <Tooltip
        title="Select the Type support   so we have can suggest time to solve help you"
        arrow
      >
        <FormControl fullWidth variant="outlined">
          <InputLabel id="priority-label">Type</InputLabel>
          <Select
            labelId="priority-label"
            id="type"
            name="type"
            value={data.type || "Offline"}
            onChange={handleInputChange}
            label="Type"
          >
            {TypeOptions
            .filter((type) => type.id !== "")
            .map((type) => (
              <MenuItem key={type.id} value={type.name}>
                {type.name}
              </MenuItem>
            ))}
             {typeError && (
            <FormHelperText error>Select a valid Type</FormHelperText>
          )}
          </Select>
        </FormControl>
      </Tooltip>

      <div style={{ display: "flex" }}>
        <FormControl
          variant="outlined"
          fullWidth
          style={{ marginRight: "8px", flex: 1 }}
        >
          <InputLabel id="city-label">Chọn tỉnh thành</InputLabel>
          <Select
            labelId="city-label"
            id="city"
            name="city"
            value={data.city}
            onChange={handleCityChange}
            label="Chọn tỉnh thành"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {dataLocation.map((city) => (
              <MenuItem key={city.code} value={city.code}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          variant="outlined"
          fullWidth
          style={{ marginRight: "8px", flex: 1 }}
        >
          <InputLabel id="district-label">Chọn quận huyện</InputLabel>
          <Select
            labelId="district-label"
            id="district"
            name="district"
            value={data.district}
            onChange={handleDistrictChange}
            label="Chọn quận huyện"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {districts.map((district) => (
              <MenuItem key={district.code} value={district.code}>
                {district.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth style={{ flex: 1 }}>
          <InputLabel id="ward-label">Chọn phường xã</InputLabel>
          <Select
            labelId="ward-label"
            id="ward"
            name="ward"
            value={data.ward}
            onChange={handleInputChange}
            label="Chọn phường xã"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {wards.map((ward) => (
              <MenuItem key={ward.code} value={ward.code}>
                {ward.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Tooltip
        title="Writing your street to more detail location"
        arrow
        interactive={false}
      >
        <FormControl fullWidth variant="outlined" style={{ marginBottom: 10 }}>
          <TextField
            id="street"
            type="text"
            name="street"
            value={data.street}
            onChange={handleInputChange}
            label="Street"
            variant="outlined"
            error={data.street === ""}
            helperText={data.street === "" ? "Street is required" : ""}
            InputProps={{
              style: { height: "50px" },
            }}
          />
        </FormControl>
      </Tooltip>
    </>
  );
};

Step1.propTypes = {
  data: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default Step1;
