import React from "react";
import PropTypes from "prop-types";
import { FormControl, TextField, Button, LinearProgress, Tooltip } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useState } from "react";

const Step2 = ({ data, handleInputChange, handleFileChange }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFileName, setSelectedFileName] = useState("");

  return (
     <>
     <Tooltip title="Writing you Reason you have problems" arrow>
        <FormControl fullWidth variant="outlined" style={{ marginBottom: 10 }}>
          <TextField
            id="title"
            type="text"
            name="title"
            value={data.title}
            onChange={handleInputChange}
            label="Title"
            variant="outlined"
            error={data.title === ""}
            helperText={data.title === "" ? "Title is required" : ""}
            InputProps={{
              style: { height: '50px' }, // Adjust the height value as needed
            }}
          />
        </FormControl>
      </Tooltip>

      <Tooltip title="Writing the details more about your problems" arrow>
        <FormControl fullWidth variant="outlined" style={{ marginBottom: 16 }}>
          <TextField
            id="description"
            name="description"
            value={data.description}
            onChange={handleInputChange}
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            error={data.description === ""}
            helperText={data.description === "" ? "Description is required" : ""}
          />
        </FormControl>
      </Tooltip>

      <Tooltip title="Upload more Image so we can see details issue if necessary" arrow>
        <FormControl fullWidth variant="outlined" style={{ marginBottom: 16 }}>
          <input
            id="attachmentUrl"
            type="file"
            name="file"
            onChange={(e) => {
              handleFileChange(e);
              const file = e.target.files[0];

              setSelectedFileName(file ? file.name : ""); // Set the selected file name

              const totalSize = 1000000;
              let uploadedSize = 0;

              const updateProgress = () => {
                if (uploadedSize < totalSize) {
                  uploadedSize += 1000000; // Simulating progress update
                  const progress = (uploadedSize / totalSize) * 100;
                  setUploadProgress(progress);
                  setTimeout(updateProgress, 1); // Update progress every 1 second
                }
              };

              updateProgress();
            }}
            style={{ display: "none" }}
          />
          <label htmlFor="attachmentUrl">
            <Button
              component="span"
              variant="contained"
              startIcon={<CloudUpload />}
              className="file-upload-button input-field file-input"
            >
              Upload file
            </Button>
          </label>
          {uploadProgress > 0 && (
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              style={{ marginTop: "8px" }}
            />
          )}
          {selectedFileName && (
            <p style={{ margin: "8px 0 0", fontSize: "14px" }}>
              File: {selectedFileName}
            </p>
          )}
        </FormControl>
      </Tooltip>
     </>
  );
};

Step2.propTypes = {
  data: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
};

export default Step2;
