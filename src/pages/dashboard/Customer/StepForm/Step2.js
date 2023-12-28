import React from "react";
import PropTypes from "prop-types";
import {
  FormControl,
  TextField,
  Button,
  LinearProgress,
  Tooltip,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import { useState } from "react";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Step2 = ({
  data,
  handleInputChange,
  handleFileChange,
  imagePreviewUrl,
  isImagePreviewOpen,
  setIsImagePreviewOpen,
}) => {
  const [selectedFileName, setSelectedFileNames] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(
    Array(selectedFileName.length).fill(0)
  );
  console.log("setIsImagePreviewOpen:", setIsImagePreviewOpen);

  const images = imagePreviewUrl.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

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

Step2.propTypes = {
  data: PropTypes.object.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  imagePreviewUrl: PropTypes.array.isRequired,
  isImagePreviewOpen: PropTypes.bool.isRequired,
  setIsImagePreviewOpen: PropTypes.func.isRequired,
};

export default Step2;
