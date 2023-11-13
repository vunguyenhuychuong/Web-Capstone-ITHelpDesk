import {
  ConfirmationNumber,
  LocalActivity,
  PieChart,
  SupervisedUserCircle,
} from "@mui/icons-material";
import { Grid, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useState } from "react";
import MyView from "./MyView";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import ManagersTabs from "../Manager/ManagerTabs";
import TicketSolutionList from "./TicketSolutionList";

const HomeTechnician = () => {
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
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
              onChange={handleTabChange}
              value={value}
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
                  fontSize: "2  .5rem",
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
                    <PieChart sx={{ marginRight: 1, color: "#0099FF" }} />
                    <span style={{ whiteSpace: "nowrap" }}>My View</span>
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
                    List Ticket
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
                    Resource Management
                  </div>
                }
                className="custom-tab-label"
              />
            </Tabs>

            <Box role="tabpanel" hidden={value !== 0}>
              {value === 0 ? <MyView /> : <LoadingSkeleton />}
            </Box>
            <Box role="tabpanel" hidden={value !== 1}>
              {value === 1 ? <ManagersTabs /> : <LoadingSkeleton />}
            </Box>
            <Box role="tabpanel" hidden={value !== 2}>
              {value === 2 ? <TicketSolutionList /> : <LoadingSkeleton />}
            </Box>
          </Box>
        </Grid>
        {/* <Grid item xs={1}>
        <FormControl fullWidth sx={{ m: 1, minWidth: 120 }}>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={age}
            label="Age"
            onChange={handleChange}
            startAdornment={
              <InputAdornment position="start">
                <IconButton>
                  <Settings />
                </IconButton>
                Customize
              </InputAdornment>
            }
            inputProps={{
              style: { border: "1px solid white" }, // White fade border
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid> */}
      </Grid>
    </Grid>
  );
};

export default HomeTechnician;
