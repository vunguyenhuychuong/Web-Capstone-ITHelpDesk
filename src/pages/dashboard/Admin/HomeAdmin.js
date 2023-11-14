import {
    ConfirmationNumber,
    Dashboard,
    Groups,
    LocalActivity,
    MedicalServices,
    SupervisedUserCircle,
    Vibration,
  } from "@mui/icons-material";
  import { Grid, Tab, Tabs } from "@mui/material";
  import { Box } from "@mui/system";
  import React from "react";
  import { useState } from "react";
  import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import ViewAdmin from "./ViewAdmin";
import Customer from "../Customer";
import ModeList from "../Mode/ModeList";
import ServiceList from "../ServicePack/ServiceList";
import Customers from "../Customers";
  
  const HomeAdmin = () => {
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
                      <Dashboard sx={{ marginRight: 1, color: "#0099FF" }} />
                      <span style={{ whiteSpace: "nowrap" }}>Home Page</span>
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
                      <SupervisedUserCircle sx={{ marginRight: 1, color: "#0099FF" }} />{" "}
                       User
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
                      <Vibration sx={{ marginRight: 1, color: "#0099FF" }} />{" "}
                      Mode
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
                      <MedicalServices
                        sx={{ marginRight: 1, color: "#0099FF" }}
                      />{" "}
                    Service
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
                      <Groups
                        sx={{ marginRight: 1, color: "#0099FF" }}
                      />{" "}
                    Team
                    </div>
                  }
                  className="custom-tab-label"
                />
              </Tabs>
  
              <Box role="tabpanel" hidden={value !== 0}>
                {value === 0 ? <ViewAdmin /> : <LoadingSkeleton />}
              </Box>
              <Box role="tabpanel" hidden={value !== 1}>
                {value === 1 ? <Customers /> : <LoadingSkeleton />}
              </Box>
              <Box role="tabpanel" hidden={value !== 2}>
                {value === 2 ? <ModeList /> : <LoadingSkeleton />}
              </Box>
              <Box role="tabpanel" hidden={value !== 3}>
                {value === 3 ? <ServiceList /> : <LoadingSkeleton />}
              </Box>
              <Box role="tabpanel" hidden={value !== 4}>
                {value === 4 ? <ModeList /> : <LoadingSkeleton />}
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
  
  export default HomeAdmin;
  