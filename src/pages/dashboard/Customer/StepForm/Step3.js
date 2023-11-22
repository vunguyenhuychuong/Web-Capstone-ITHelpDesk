import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Typography,
  Box,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { getPriorityOption } from "../../../helpers/tableComlumn";

const Step3 = ({ data, handleSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleButtonClick = async (e) => {
    e.preventDefault();
    setLoading(true);

    await handleSubmit();

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <Card style={{ display: "flex", backgroundColor: "#f0f0f0" }}>
        <Box
          p={2}
          style={{ flex: "1", display: "flex", flexDirection: "column" }}
        >
          <div>
            <Typography variant="h6" gutterBottom>
              Summary Your Ticket Send
            </Typography>
          </div>
          <div style={{ flexGrow: 1 }}>
            <Typography variant="body1" paragraph>
              <strong>Category:</strong> {data.categoryId}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Priority:</strong> {getPriorityOption(data.priority)}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Title:</strong> {data.title || "Not Provided"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Description:</strong> {data.description || "Not Provided"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Image:</strong>{" "}
              {data.avatarUrl ? (
                <Button color="primary" onClick={handleDialogOpen}>
                  View Image
                </Button>
              ) : (
                "Not Provided"
              )}
            </Typography>
          </div>
        </Box>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Image</DialogTitle>
        <DialogContent>
          <div
            style={{
              background: `url(${data.avatarUrl})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              width: "100%",
              height: "70vh", // Adjust the height as needed
            }}
          ></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

Step3.propTypes = {
  data: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Step3;
