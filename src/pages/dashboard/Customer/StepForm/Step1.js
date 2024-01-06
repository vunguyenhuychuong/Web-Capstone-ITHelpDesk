import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { getAllUserActiveService } from "../../../../app/api/service";
import { Close,CloudUpload } from "@mui/icons-material";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Step1 = ({ data, handleInputChange,handleFileChange,imagePreviewUrl,isImagePreviewOpen,setIsImagePreviewOpen}) => {
  const [dataService, setDataServices] = useState([]);
  const [selectedFileName, setSelectedFileNames] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(
    Array(selectedFileName.length).fill(0)
  );
  const fetchService = async () => {
    try {
      const response = await getAllUserActiveService();
      setDataServices(response);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  const images = imagePreviewUrl.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

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
              .filter((service) => service.id !== "") 
              .map((service) => (
                <MenuItem key={service.id} value={service.id}>
                  {service.description}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Tooltip>

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
              style: { height: "50px" },
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
            helperText={
              data.description === "" ? "Description is required" : ""
            }
          />
        </FormControl>
      </Tooltip>
      <Tooltip
        title="Upload more Image so we can see details issue if necessary"
        arrow
      >
        <FormControl fullWidth variant="outlined" style={{ marginBottom: 16 }}>
          <input
            id="attachmentUrl"
            type="file"
            name="file"
            onChange={(e) => {
              const files = Array.from(e.target.files);
              handleFileChange(e);
              files.forEach((file, index) => {
                const totalSize = file.size;
                let uploadedSize = 0;
                const updateProgress = () => {
                  if (uploadedSize < totalSize) {
                    uploadedSize += 1000000;
                    const progress = (uploadedSize / totalSize) * 100;
                    setUploadProgress((prevProgress) => {
                      const newProgress = [...prevProgress];
                      newProgress[index] = progress;
                      return newProgress;
                    });
                    setTimeout(updateProgress, 1);
                  }
                };
                updateProgress();
              });
              const fileNames = Array.from(files).map((file) => file.name);
              setSelectedFileNames(fileNames);
            }}
            multiple
            style={{ display: "none" }}
          />
          {imagePreviewUrl.length > 0 && (
            <div
              className="image-preview"
              onClick={() => setIsImagePreviewOpen(true)}
            >
              <p className="preview-text">Click here to view attachment</p>
            </div>
          )}
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
    
      <Dialog
        open={isImagePreviewOpen}
        onClose={() => setIsImagePreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Image Preview
          <IconButton
            edge="end"
            color="inherit"
            onClick={() => setIsImagePreviewOpen(false)}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Gallery items={images} />
        </DialogContent>
      </Dialog>
    </>
  );
};

Step1.propTypes = {
  data: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default Step1;
