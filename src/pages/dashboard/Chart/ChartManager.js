import React, { useState } from "react";
import "../../../assets/css/ticket.css";
import "../../../assets/css/ServiceTicket.css";
import { Box, Grid, MenuItem, Select, Tab, Tabs } from "@mui/material";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import {
  Feedback,
  WorkHistory,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const ChartManager = () => {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Grid
      container
      style={{
        border: "1px solid #eee",
        paddingRight: "10px",
        paddingLeft: "10px",
      }}
    >
      <Grid item xs={12} style={{ paddingRight: "12px" }}>
        <MDBCol md="12">
          <MDBRow className="border-box" style={{ backgroundColor: "#FFFFFF" }}>
            <MDBCol md="2" className="mt-2">
              <Box sx={{ width: "100%" }}>
                <Tabs
                  onChange={handleTabChange}
                  value={value}
                  aria-label="Tabs where selection follows focus"
                  selectionFollowsFocus
                  sx={{
                    "& .MuiTabs-root": {
                      color: "#007bff",
                    },
                  }}
                >
                  <Tab
                    label={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          textTransform: "none",
                        }}
                      >
                        <Feedback sx={{ marginRight: 1 }} /> Feedback
                      </div>
                    }
                    className="custom-tab-label"
                  />
                  <Tab
                    label={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          textTransform: "none",
                        }}
                      >
                        <WorkHistory sx={{ marginRight: 1 }} /> History
                      </div>
                    }
                    className="custom-tab-label"
                  />
                </Tabs>
                <Box role="tabpanel" hidden={value !== 0}>
                </Box>
                <Box role="tabpanel" hidden={value !== 1}>
                </Box>
              </Box>
            </MDBCol>
          </MDBRow>
        </MDBCol>
        <MDBRow className="mb-4"></MDBRow>
      </Grid>
    </Grid>
  );
};

export default ChartManager;
