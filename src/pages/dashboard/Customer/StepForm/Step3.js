import React, { useEffect } from "react";
import {
  Box,
  Card,
} from "@mui/material";

import "react-image-gallery/styles/css/image-gallery.css";
import { useNavigate } from "react-router-dom";

const Step3 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate('/home/mains');
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [navigate]);
  return (
    <>
      <Card style={{ display: "flex", backgroundColor: "#f0f0f0" }}>
        <Box
          p={4}
          style={{ flex: "2", display: "flex", flexDirection: "column" }}
        >
        </Box>
      </Card>

    </>
  );
};

export default Step3;
