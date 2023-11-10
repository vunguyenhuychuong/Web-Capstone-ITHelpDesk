import React from "react";
import PropTypes from "prop-types";
import { Button, Typography, Box, Card, CardMedia, CircularProgress } from "@mui/material";
import { useState } from "react";

const Step3 = ({ data, handleSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);

    await handleSubmit();

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };
  return(
    <Card style={{ backgroundColor: "#f0f0f0" }}>
      {/* <CardMedia
        component="img"
        alt="Ticket Image"
        height="140"
        image={data.avatarUrl} // Use the appropriate property from your data object
      /> */}
      <Box p={2}>
        <Typography variant="h6" gutterBottom>
          Summary Your Ticket Send
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Category:</strong> {data.categoryId}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Priority:</strong> {data.priority }
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Title:</strong> {data.title || "Not Type"}
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Description:</strong> {data.description || "Not Type"}
        </Typography>
  
        <Button
          variant="contained"
          color="primary"
          onClick={handleButtonClick }
          style={{ marginTop: 16 }}
        >
           {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit"
          )}
        </Button>
      </Box>
    </Card>
  );
} 


Step3.propTypes = {
  data: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Step3;