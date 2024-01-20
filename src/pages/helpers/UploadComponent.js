import React from "react";
import { Upload } from "antd";
import { Paper, Typography } from "@mui/material";
import "../../assets/css/UploadComponent.css";
import { Attachment } from "@mui/icons-material";

const UploadComponent = () => {
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

  return (
    <Paper elevation={3} className="upload-container">
      <Upload {...props}>
        <div className="upload-content">
          <Typography variant="body1">
            <Attachment /> <span>Browse Files</span> or Drag files here [Max
            size: 10MB]
          </Typography>
        </div>
      </Upload>
    </Paper>
  );
};

export default UploadComponent;
