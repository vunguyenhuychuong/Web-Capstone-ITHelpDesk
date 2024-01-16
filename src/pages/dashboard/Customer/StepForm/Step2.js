import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  Typography,
  Card,
  Box,
  Button,
  Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useState } from "react";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { getAllService } from "../../../../app/api/service";
import { useNavigate } from "react-router-dom";

const Step2 = ({
  data,
  imagePreviewUrl,
  isImagePreviewOpen,
  setIsImagePreviewOpen,
  handleSubmitTicket,
  isSubmitting,
}) => {
  const [dataService, setDataServices] = useState([]);
  const navigate = useNavigate();
  const fetchService = async () => {
    try {
      const response = await getAllService();
      setDataServices(response);
    } catch (error) {
      console.log("Error while fetching data", error);
    } finally {
    }
  };

  const images = imagePreviewUrl.map((url, index) => ({
    original: url,
    thumbnail: url,
    description: `Attachment Preview ${index + 1}`,
  }));

  useEffect(() => {
    fetchService();
  }, []);

  return (
    <>
      <Card style={{ display: "flex", backgroundColor: "#f0f0f0" }}>
        <Box
          p={4}
          style={{ flex: "2", display: "flex", flexDirection: "column" }}
        >
          <div>
            <Typography variant="h6" gutterBottom>
              Summary Your Ticket Send
            </Typography>
          </div>
          <div style={{ flexGrow: 1 }}>
            <Typography variant="body1" paragraph>
              <strong>Service Ticket:</strong>{" "}
              {dataService.find((service) => service.id === data.serviceId)
                ?.description || "Not Provided"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Title of Ticket:</strong> {data.title || "Not Provided"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Description:</strong> {data.description || "Not Provided"}
            </Typography>
            <Typography variant="body1" paragraph>
              {imagePreviewUrl.length > 0 && (
                <div
                  className="image-preview"
                  onClick={() => setIsImagePreviewOpen(true)}
                >
                  <p className="preview-text">Click here to view Images</p>
                </div>
              )}
            </Typography>
          </div>
        </Box>
      </Card>

      <Stack sx={{ flexDirection: "row", justifyContent: "center" }}>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmitTicket}
          disabled={isSubmitting}
        >
          Save
        </Button>
        <Button
          color="inherit"
          variant="contained"
          style={{ marginLeft: "8px" }}
          onClick={() => navigate(`/home/requestCustomerList`)}
        >
          Cancel
        </Button>
      </Stack>

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
  handleSubmit: PropTypes.func.isRequired,
};

export default Step2;
