import {
  ConfirmationNumber,
  Dashboard,
  LocalActivity,
  SupervisedUserCircle,
} from "@mui/icons-material";
import { Grid, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useState } from "react";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import ChartManager from "./ChartManager";
import TicketSolutionList from "../Technician/TicketSolutionList";
import IndexTicket from "./IndexTicket";
import { useParams } from "react-router-dom";

const HomeManager = () => {

  const { tab } = useParams();
  const [value, setValue] = useState(tab ? parseInt(tab, 10) : 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid
    container
    style={{
      border: "1px solid #ccc",
      paddingRight: "10px",
      paddingLeft: "10px",
    }}
  >
    <Grid item container xs={12}>
      <Grid item xs={12}>
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="Tabs where selection follows focus"
            selectionFollowsFocus
            sx={{
              "& .MuiTabs-root": {
                color: "#007bff",
              },
              "& .MuiTab-root": {
                minHeight: "70px",
                fontSize: "1rem",
              },
              "& .MuiTab-wrapper": {
                display: "flex",
                alignItems: "center",
                textTransform: "none",
                fontSize: "1.2rem",
              },
              "& .MuiSvgIcon-root": {
                fontSize: "2.5rem",
                marginRight: "0.5rem",
              },
            }}
          >
            <Tab
              label={
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    textTransform: "none",
                  }}
                >
                  <Dashboard sx={{ marginRight: 1, color: "#0099FF" }} />
                  <span style={{ whiteSpace: "nowrap" }}>Help Desk</span>
                </div>
              }
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
                  <ConfirmationNumber sx={{ marginRight: 1, color: "#0099FF" }} />{" "}
                   Ticket
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
                  <LocalActivity sx={{ marginRight: 1, color: "#0099FF" }} />{" "}
                  Ticket Solution
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
                  <SupervisedUserCircle
                    sx={{ marginRight: 1, color: "#0099FF" }}
                  />{" "}
                Problems & Change
                </div>
              }
              className="custom-tab-label"
            />
          </Tabs>

          <Box role="tabpanel" hidden={value !== 0}>
            {value === 0 ? <ChartManager /> : <LoadingSkeleton />}
          </Box>
          <Box role="tabpanel" hidden={value !== 1}>
            {value === 1 ? <IndexTicket /> : <LoadingSkeleton />}
          </Box>
          <Box role="tabpanel" hidden={value !== 2}>
            {value === 2 ? <TicketSolutionList /> : <LoadingSkeleton />}
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Grid>
  );
};

export default HomeManager;
