import {
  Assessment,
  DonutSmall,
  QueryStats,
  Replay,
  TableChart,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import "../../../assets/css/homeManager.css";
import React, { useEffect, useState } from "react";
import { getChartCategory, getChartMode, getChartPriority, getChartService, getSummaryManager } from "../../../app/api/dashboard";
import LoadingImg from "../../../assets/images/loading.gif";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import CustomizeChart from "./charts/CustomizeChart";
import PriorityChart from "./charts/PriorityChart";
import ModeChart from "./charts/ModeChart";
import ServiceChart from "./charts/ServiceChart";

const ChartManager = () => {
  const [dataCategory, setDataCategory] = useState([]);
  const [dataPriority, setDataPriority] = useState([]);
  const [dataMode, setDataMode] = useState([]);
  const [dataService, setDataService] = useState([]);
  const [dataTotal, setDataTotal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState('Request By Category');
  const fetchDataListTicketTask = async () => {
    try {
      setLoading(true);
      const categoryChart = await getChartCategory();
      const priorityChart = await getChartPriority();
      const modeChart = await getChartMode();
      const serviceChart = await getChartService();
      setDataCategory(categoryChart);
      setDataPriority(priorityChart);
      setDataMode(modeChart);
      setDataService(serviceChart);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataTotalChart = async () => {
    try{
      setLoading(true);
      const totalChart = await getSummaryManager();
      setDataTotal(totalChart);
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  const handleReloadClick = () => {
    fetchDataListTicketTask();
  };

  const handleReloadPieChart = () => {
    fetchDataTotalChart();
  };

  useEffect(() => {
    fetchDataTotalChart();
    fetchDataListTicketTask();
  }, []);

  const data = [
    { id: 0, value: dataTotal.totalOpenTicket, label: "Total Open Ticket" },
    { id: 1, value: dataTotal.totalAssignedTicket, label: "Total Assigned Ticket" },
    { id: 2, value: dataTotal.totalInProgressTicket, label: "Total InProgress Ticket" },
    { id: 3, value: dataTotal.totalResolvedTicket, label: "Total Resolved Ticket" },
    { id: 4, value: dataTotal.totalClosedTicket, label: "Total Closed Ticket" },
    { id: 5, value: dataTotal.totalCancelledTicket, label: "Total Cancelled Ticket" },
  ];

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case 'Request By Category':
        return <CustomizeChart dataSummary={dataCategory} />;
      case 'Request By Priority':
        return <PriorityChart dataSummary={dataPriority} />;
      case 'Request By Mode':
        return <ModeChart dataSummary={dataMode} />;
      case 'Request By Service':
        return <ServiceChart dataSummary={dataService} />;
      default:
        return null;
    }
  };

  const handleTechnicianChange = (event) => {
    setSelectedChart(event.target.value);
  };

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
            <TableChart sx={{ margin: 1, color: "#33CC66" }} />
            <FormControl sx={{ marginLeft: "8px", marginRight: "8px" }}>
              <Select
                labelId="technician-select-label"
                id="technician-select"
                value={selectedChart} 
                onChange={handleTechnicianChange}
                style={{ height: "30px"}}
              >
                <MenuItem value="Request By Category">Request By Technician</MenuItem>
                <MenuItem value="Request By Priority">Request By Priority</MenuItem>
                <MenuItem value="Request By Mode">Request By Mode</MenuItem>
                <MenuItem value="Request By Service">Request By Service</MenuItem>
              </Select>
            </FormControl>
            <div style={{ marginLeft: "auto" }}>
              <Tooltip title="Refresh" arrow>
                <button
                  variant="contained"
                  color="secondary"
                  className="custom-button"
                  onClick={handleReloadClick}
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
                renderSelectedChart()
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
            <Assessment sx={{ margin: 1, color: "#9966FF" }} />
            <h4
              style={{
                marginLeft: "8px",
                marginTop: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Request Summary
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
            <DonutSmall sx={{ margin: 1, color: "#6699FF" }} />
            <h4
              style={{
                marginLeft: "8px",
                marginTop: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Request Summary Total
            </h4>
            <div style={{ marginLeft: "auto" }}>
              <Tooltip title="Refresh" arrow>
                <button
                  variant="contained"
                  color="secondary"
                  className="custom-button"
                  onClick={handleReloadPieChart}
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
            <QueryStats sx={{ margin: 1, color: "#FF66CC" }} />
            <h4
              style={{
                marginLeft: "8px",
                marginTop: "4px",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Request Summary
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

export default ChartManager;