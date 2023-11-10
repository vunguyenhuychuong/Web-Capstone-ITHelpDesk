import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { getAllCategories } from "../../../../app/api/category";
import { useState } from "react";
import { useEffect } from "react";
import { priorityOption } from "../../../helpers/tableComlumn";

const Step1 = ({ data, handleInputChange }) => {
  const [dataCategories, setDataCategories] = useState([]);
  const fetchCategory = async () => {
    try {
      const response = await getAllCategories();
      console.log(dataCategories);
      setDataCategories(response);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <>
      <Tooltip title="Select the topic issue you have problems" arrow>
        <FormControl fullWidth variant="outlined" style={{ marginBottom: 16 }}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="categoryId"
            name="categoryId"
            value={data.categoryId}
            onChange={handleInputChange}
            label="Category"
          >
            {dataCategories
              .filter((category) => category.id !== "") // Filter out the disabled option
              .map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Tooltip>

      <Tooltip title="Select the level issue so we have can suggest time to solve help you" arrow>
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
    </>
  );
};

Step1.propTypes = {
  data: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default Step1;
