import { ConfirmationNumber, PieChart } from "@mui/icons-material";
import { Grid, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useState } from "react";
import LoadingSkeleton from "../../../components/iconify/LoadingSkeleton";
import ViewAccountant from "./ViewAccountant";
import ContractList from "../Contract/ContractList";

const HomeAccountant = () => {
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
                    <ConfirmationNumber
                      sx={{ marginRight: 1, color: "#0099FF" }}
                    />{" "}
                    List Contract
                  </div>
                }
                className="custom-tab-label"
              />
            </Tabs>

            <Box role="tabpanel" hidden={value !== 0}>
              {value === 0 ? <ViewAccountant /> : <LoadingSkeleton />}
            </Box>
            <Box role="tabpanel" hidden={value !== 1}>
              {value === 1 ? <ContractList /> : <LoadingSkeleton />}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default HomeAccountant;
