import React from "react";
import { Upload } from "antd";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import "../../../../assets/css/UploadComponent.css";
import { Attachment, Close } from "@mui/icons-material";
import { useState } from "react";
import { data } from "autoprefixer";

const UploadComponent = ({ attachmentURL }) => {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const openImagePreview = () => {
    setIsImagePreviewOpen(true);
  };

  const closeImagePreview = () => {
    setIsImagePreviewOpen(false);
  };

  const props = {
    name: "file",
    multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    customRequest: ({ onSuccess, onError, file }) => {
      const timer = setInterval(() => {
        const percent = (file.percent || 0) + 10; // Increment the percent value
        if (percent >= 100) {
          clearInterval(timer);
        }
        onSuccess({ percent }, file);
      }, 1000); // Delay of 1 second

      setTimeout(() => {
        onSuccess({}, file);
      }, 5000);

      setTimeout(() => {
        onError(new Error("Upload failed"), file);
      }, 8000);
    },
    onChange(info) {},
    onDrop(e) {},
  };

  console.log(attachmentURL);
  return (
    <div>
      <Paper elevation={3} className="upload-container">
        <Upload {...props}>
          <div className="upload-content">
            <Typography variant="h6">
              <Attachment /> <span>Browse Files</span> or Drag files here [Max
              size: 10MB]
            </Typography>
          </div>
        </Upload>
        {attachmentURL ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={openImagePreview}
            style={{ marginTop: "10px", textTransform: "none" }}
          >
            View Attachment Image
          </Button>
        ) : (
          <div>No image currently</div>
        )}
      </Paper>

      <Dialog
        open={isImagePreviewOpen}
        onClose={closeImagePreview}
        maxWidth="md"
      >
        <DialogContent>
          <div style={{ position: "relative" }}>
            <img
              src={attachmentURL}
              alt="Attachment Preview"
              style={{ width: "100%", height: "auto" }}
            />
            <IconButton
              edge="end"
              color="inherit"
              onClick={closeImagePreview}
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              <Close />
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadComponent;
