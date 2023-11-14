import {
  BadgeRounded,
  ConnectWithoutContact,
  FolderShared,
  Inventory,
  Replay,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import "../../../assets/css/homeManager.css";
import React, { useEffect, useState } from "react";
import LoadingImg from "../../../assets/images/loading.gif";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";

const ViewAdmin = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  const data = [
    { id: 0, value: 10, label: "series A" },
    { id: 1, value: 15, label: "series B" },
    { id: 2, value: 20, label: "series C" },
  ];

  return (
    <Grid
      item
      container
      xs={12}
      spacing={2}
      style={{ marginTop: "10px", background: "#eee", marginLeft: "-9px" }}
    >
      <Grid item xs={6}>
        <Grid item xs={12}>
          <div
            className="nav-header bordered-grid-item"
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #CCCCCC",
              padding: "8px",
              background: "#FFFFFF",
            }}
          >
            <FolderShared sx={{ margin: 1, color: "#33CC66" }} />
            <h4
              style={{
                marginLeft: "8px",
                marginTop: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Manager Users
            </h4>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Tooltip title="Refresh" arrow>
                <button
                  variant="contained"
                  color="secondary"
                  className="custom-button"
                >
                  <Replay />
                </button>
              </Tooltip>
              <button
                variant="contained"
                color="secondary"
                className="custom-button"
                style={{ marginLeft: "8px" }}
              >
                Show All
              </button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Card style={{ height: "290px", overflowY: "auto" }}>
            <CardContent>
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={LoadingImg} alt="Loading" />
                </div>
              ) : (
                <Table>
                  <TableBody>
                    {/* Table Header Row */}
                    <TableRow className="hoverCell">
                      <TableCell colSpan={3}></TableCell>
                      <TableCell className="boldText">Close</TableCell>
                      <TableCell className="boldText">Open</TableCell>
                      <TableCell className="boldText">Overdue</TableCell>
                    </TableRow>
                    <TableRow className="hoverCell">
                      <TableCell colSpan={3}>Unassigned</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>3</TableCell>
                    </TableRow>
                    <TableRow className="hoverCell">
                      <TableCell colSpan={3}>Total</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid item xs={12}>
          <div
            className="nav-header bordered-grid-item"
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #CCCCCC",
              padding: "8px",
              background: "#FFFFFF",
            }}
          >
            <Inventory sx={{ margin: 1, color: "#9966FF" }} />
            <h4
              style={{
                marginLeft: "8px",
                marginTop: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Manager Service
            </h4>
            <div style={{ marginLeft: "auto" }}>
              <button
                variant="contained"
                color="secondary"
                className="custom-button"
              >
                This Week
              </button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          {/* Card content goes here */}
          <Card style={{ height: "290px" }}>
            <CardContent>
              <BarChart
                xAxis={[
                  {
                    id: "barCategories",
                    data: ["bar A", "bar B", "bar C"],
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: [2, 5, 3],
                  },
                ]}
                width={500}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={6}>
        <Grid item xs={12}>
          <div
            className="nav-header bordered-grid-item"
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #CCCCCC",
              padding: "8px",
              background: "#FFFFFF",
            }}
          >
            <ConnectWithoutContact sx={{ margin: 1, color: "#33CC66" }} />
            <h4
              style={{
                marginLeft: "8px",
                marginTop: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Manager Mode
            </h4>
            <div style={{ marginLeft: "auto" }}>
              <Tooltip title="Refresh" arrow>
                <button
                  variant="contained"
                  color="secondary"
                  className="custom-button"
                >
                  <Replay />
                </button>
              </Tooltip>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Card style={{ height: "290px", overflowY: "auto" }}>
            <CardContent>
              <PieChart
                series={[
                  {
                    data,
                    highlightScope: { faded: "global", highlighted: "item" },
                    faded: {
                      innerRadius: 30,
                      additionalRadius: -30,
                      color: "gray",
                    },
                  },
                ]}
                height={200}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        <Grid item xs={12}>
          <div
            className="nav-header bordered-grid-item"
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #CCCCCC",
              padding: "8px",
              background: "#FFFFFF",
            }}
          >
            <BadgeRounded sx={{ margin: 1, color: "#9966FF" }} />
            <h4
              style={{
                marginLeft: "8px",
                marginTop: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Manager Team
            </h4>
            <div style={{ marginLeft: "auto" }}>
              <button
                variant="contained"
                color="secondary"
                className="custom-button"
              >
                This Week
              </button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          {/* Card content goes here */}
          <Card style={{ height: "290px" }}>
            <CardContent>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                series={[
                  {
                    data: [2, 3, 5.5, 8.5, 1.5, 5, 1, 4, 3, 8],
                    showMark: ({ index }) => index % 2 === 0,
                  },
                ]}
                width={500}
                height={300}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ViewAdmin;
