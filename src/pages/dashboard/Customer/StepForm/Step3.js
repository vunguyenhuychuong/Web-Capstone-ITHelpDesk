import React, { useEffect } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Typography,
  Box,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { getPriorityOption } from "../../../helpers/tableComlumn";
import { getAllService } from "../../../../app/api/service";
import { fetchCity, fetchDistricts, fetchWards } from "./fetchDataSelect";
import { Close } from "@mui/icons-material";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const Step3 = ({
  data,
  districts,
  wards,
  handleSubmit,
  imagePreviewUrl,
  isImagePreviewOpen,
  setIsImagePreviewOpen,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [dataService, setDataServices] = useState([]);
  const [cityName, setCityName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
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

  const fetchLocationNames = async () => {
    try {
      const cityResponse = await fetchCity();
      const districtResponse = await fetchDistricts(data.city);
      const wardResponse = await fetchWards(data.district);

      setCityName(
        cityResponse.find((city) => city.code === data.city)?.name ||
          "Not Provided"
      );
      setDistrictName(
        districtResponse.find((district) => district.code === data.district)
          ?.name || "Not Provided"
      );
      setWardName(
        wardResponse.find((ward) => ward.code === data.ward)?.name ||
          "Not Provided"
      );
    } catch (error) {
      console.log("Error while fetching location names", error);
    }
  };

  useEffect(() => {
    fetchService();
    fetchLocationNames();
  }, [data.city, data.district, data.ward]);

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
              <strong>Priority Ticket:</strong>{" "}
              {getPriorityOption(data.priority)}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Title of Ticket:</strong> {data.title || "Not Provided"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Description:</strong> {data.description || "Not Provided"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Type of Ticket:</strong> {data.type || "Not Provided"}
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Location:</strong> {cityName},{districtName},{wardName},
              {data.street}
            </Typography>
            <Typography variant="body1" paragraph>
              {/* <strong>Image:</strong>{" "} */}
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

Step3.propTypes = {
  data: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Step3;
