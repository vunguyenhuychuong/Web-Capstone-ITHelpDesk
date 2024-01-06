import {
  Assessment,
  Assignment,
  FileDownload,
  MonetizationOn,
  QueryStats,
  Replay,
  TableChart,
  Verified,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import "../../../assets/css/homeManager.css";
import React, { useEffect, useState } from "react";
import {
  getChartCategory,
  getChartDashBoardManager,
  getChartLastMonth,
  getChartLastWeek,
  getChartMode,
  getChartPriority,
  getChartService,
  getChartThisMonth,
  getChartWeek,
  getSummaryManager,
} from "../../../app/api/dashboard";
import LoadingImg from "../../../assets/images/loading.gif";
import CustomizeChart from "./charts/CustomizeChart";
import PriorityChart from "./charts/PriorityChart";
import ModeChart from "./charts/ModeChart";
import ServiceChart from "./charts/ServiceChart";
import WeekChart from "./charts/WeekChart";
import LastWeekChart from "./charts/LastWeekChart";
import LastMonthChart from "./charts/LastMonthChart";
import MonthChart from "./charts/MonthChart";
import { Chart } from "primereact/chart";
import { FaTicketAlt } from "react-icons/fa";

const ChartManager = () => {
  const [dataTotalDashBoard, setDataTotalDashBoard] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);
  const [dataPriority, setDataPriority] = useState([]);
  const [dataMode, setDataMode] = useState([]);
  const [dataService, setDataService] = useState([]);
  const [dataTotal, setDataTotal] = useState("");
  const [dataWeek, setDataWeek] = useState("");
  const [dataLastWeek, setDataLastWeek] = useState("");
  const [dataMonth, setDataMonth] = useState("");
  const [dataLastMonth, setDataLastMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedChart, setSelectedChart] = useState("Request By Category");
  const [selectedTime, setSelectedTime] = useState("1");

  const fetchDataListTicketTask = async () => {
    try {
      setLoading(true);
      const dashBoard = await getChartDashBoardManager();
      const categoryChart = await getChartCategory();
      const priorityChart = await getChartPriority();
      const modeChart = await getChartMode();
      const serviceChart = await getChartService();
      setDataTotalDashBoard(dashBoard);
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

  const fetchDataBarChart = async () => {
    try {
      setLoading(true);
      const weekChart = await getChartWeek();
      const lastWeekChart = await getChartLastWeek();
      const monthChart = await getChartThisMonth();
      const lastMonthChart = await getChartLastMonth();
      setDataLastWeek(lastWeekChart);
      setDataWeek(weekChart);
      setDataMonth(monthChart);
      setDataLastMonth(lastMonthChart);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReloadClick = () => {
    fetchDataListTicketTask();
  };

  const handleReloadBarChart = () => {
    fetchDataBarChart();
  };

  useEffect(() => {
    fetchDataListTicketTask();
    fetchDataBarChart();
  }, []);

  const data = [
    { id: 0, value: dataTotal.totalOpenTicket, label: "Total Open Ticket" },
    {
      id: 1,
      value: dataTotal.totalAssignedTicket,
      label: "Total Assigned Ticket",
    },
    {
      id: 2,
      value: dataTotal.totalInProgressTicket,
      label: "Total InProgress Ticket",
    },
    {
      id: 3,
      value: dataTotal.totalResolvedTicket,
      label: "Total Resolved Ticket",
    },
    { id: 4, value: dataTotal.totalClosedTicket, label: "Total Closed Ticket" },
    {
      id: 5,
      value: dataTotal.totalCancelledTicket,
      label: "Total Cancelled Ticket",
    },
  ];

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case "Request By Category":
        return <CustomizeChart dataSummary={dataCategory} />;
      case "Request By Priority":
        return <PriorityChart dataSummary={dataPriority} />;
      case "Request By Mode":
        return <ModeChart dataSummary={dataMode} />;
      case "Request By Service":
        return <ServiceChart dataSummary={dataService} />;
      default:
        return null;
    }
  };

  const renderSelectedTime = () => {
    switch (selectedTime) {
      case "1":
        return <WeekChart dataSummary={dataWeek} />;
      case "2":
        return <LastWeekChart dataSummary={dataLastWeek} />;
      case "3":
        return <MonthChart dataSummary={dataMonth} />;
      case "4":
        return <LastMonthChart dataSummary={dataLastMonth} />;
      default:
        return null;
    }
  };

  const handleTechnicianChange = (event) => {
    setSelectedChart(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const documentStyle = getComputedStyle(document.documentElement);

  const [chartData, setChartData] = useState({
    labels: ["Open", "Assign", "InProgress", "Resolve", "Closed", "Cancel"],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          documentStyle.getPropertyValue("--blue-500"),
          documentStyle.getPropertyValue("--yellow-500"),
          documentStyle.getPropertyValue("--orange-500"),
          documentStyle.getPropertyValue("--green-500"),
          documentStyle.getPropertyValue("--pink-500"),
          documentStyle.getPropertyValue("--grey-500"),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue("--blue-400"),
          documentStyle.getPropertyValue("--yellow-400"),
          documentStyle.getPropertyValue("--orange-400"),
          documentStyle.getPropertyValue("--green-500"),
          documentStyle.getPropertyValue("--pink-500"),
          documentStyle.getPropertyValue("--grey-500"),
        ],
      },
    ],
  });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchDataTotalChart = async () => {
      try {
        const totalChart = await getSummaryManager();
        setDataTotal(totalChart);
  
        const updatedData = {
          labels: [
            "Open",
            "Assign",
            "InProgress",
            "Resolve",
            "Closed",
            "Cancel",
          ],
          datasets: [
            {
              data: [
                totalChart?.totalOpenTicket || 0,
                totalChart?.totalAssignedTicket || 0,
                totalChart?.totalInProgressTicket || 0,
                totalChart?.totalResolvedTicket || 0,
                totalChart?.totalClosedTicket || 0,
                totalChart?.totalCancelledTicket || 0,
              ],
              backgroundColor: [
                documentStyle.getPropertyValue("--blue-500"),
                documentStyle.getPropertyValue("--yellow-500"),
                documentStyle.getPropertyValue("--orange-500"),
                documentStyle.getPropertyValue("--green-500"),
                documentStyle.getPropertyValue("--pink-500"),
                documentStyle.getPropertyValue("--grey-500"),
              ],
              hoverBackgroundColor: [
                documentStyle.getPropertyValue("--blue-400"),
                documentStyle.getPropertyValue("--yellow-400"),
                documentStyle.getPropertyValue("--orange-400"),
                documentStyle.getPropertyValue("--green-500"),
                documentStyle.getPropertyValue("--pink-500"),
                documentStyle.getPropertyValue("--grey-500"),
              ],
            },
          ],
        };
  
        setChartData(updatedData);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchDataTotalChart();
  
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            font: {
              size: 12,
            },
          },
        },
      },
    };
  
    setChartOptions(options);
  }, []);

  return (
    <Grid
      item
      container
      xs={12}
      spacing={2}
      style={{ marginTop: "10px", background: "#eee", marginLeft: "-9px" }}
    >
      <Grid item xs={9}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card style={{ display: "flex" }}>
              <Card style={{ flex: 1, height: "300px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Typography variant="h6" style={{ margin: "10px",fontWeight: "bold",color: "#333",fontSize: "30px" }}>
                    Today Ticket
                  </Typography>
                  <div style={{ marginLeft: "auto", marginTop: "10px", marginRight: "10px" }}>
                    <button
                      variant="contained"
                      color="secondary"
                      className="custom-button"
                    >
                     <FileDownload /> Export
                    </button>
                  </div>
                </div>
                <Typography
                  variant="body2"
                  style={{ color: "rgba(0, 0, 0, 0.5)", marginLeft: "10px",fontWeight: "bold",color: "#3399FF" }}
                >
                  Ticket Summary
                </Typography>
                <div style={{ display: "flex", marginTop: "40px" }}>
                  <Card
                    style={{
                      flex: 1,
                      height: "150px",
                      margin: "0px 20px 10px 20px",
                      backgroundColor: "#FF99CC",
                      borderRadius: "20px",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "20px 20px 10px 20px",
                        top: "50%",
                        left: "50%",
                        width: "50px",
                        height: "50px",
                        background: "#FF3399",
                        borderRadius: "50%",
                        border: "2px solid #333",
                      }}
                    >
                      <FaTicketAlt
                        style={{ fontSize: 40, color: "#FFFFFF" }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "5px",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography
                        variant="h5"
                        style={{ fontWeight: "bold", color: "#222222" }}
                      >
                        {dataTotalDashBoard.totalTicketOfDay} 
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{
                          textAlign: "left",
                          color: "#EEEEEE",
                          fontSize: "16px",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Total Ticket
                      </Typography>
                    </div>
                  </Card>
                  <Card
                    style={{
                      flex: 1,
                      height: "150px",
                      margin: "0px 20px 10px 20px",
                      backgroundColor: "#99CCFF",
                      borderRadius: "20px",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "20px 20px 10px 20px",
                        top: "50%",
                        left: "50%",
                        width: "50px",
                        height: "50px",
                        background: "#3399FF",
                        borderRadius: "50%",
                        border: "2px solid #333",
                      }}
                    >
                      <Assignment style={{ fontSize: 40, color: "#FFFFFF" }} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "5px",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography
                        variant="h5"
                        style={{ fontWeight: "bold", color: "#222222" }}
                      >
                       {dataTotalDashBoard.totalContractOfDay} 
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{
                          textAlign: "left",
                          color: "#EEEEEE",
                          fontSize: "16px",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Total Contract
                      </Typography>
                    </div>
                  </Card>
                  <Card
                    style={{
                      flex: 1,
                      height: "150px",
                      margin: "0px 20px 10px 20px",
                      backgroundColor: "#99FFCC",
                      borderRadius: "20px",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "20px 20px 10px 20px",
                        top: "50%",
                        left: "50%",
                        width: "50px",
                        height: "50px",
                        background: "#99FF99",
                        borderRadius: "50%",
                        border: "2px solid #333",
                      }}
                    >
                      <Verified style={{ fontSize: 40, color: "#FFFFFF" }} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "5px",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography
                        variant="h5"
                        style={{ fontWeight: "bold", color: "#222222" }}
                      >
                         {dataTotalDashBoard.totalSolutionOfDay} 
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{
                          textAlign: "left",
                          color: "#EEEEEE",
                          fontSize: "16px",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Total Solution
                      </Typography>
                    </div>
                  </Card>
                  <Card
                    style={{
                      flex: 1,
                      height: "150px",
                      margin: "0px 20px 10px 20px",
                      backgroundColor: "#FFCC99",
                      borderRadius: "20px",
                      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "20px 20px 10px 20px",
                        top: "50%",
                        left: "50%",
                        width: "50px",
                        height: "50px",
                        background: "#FFCC66",
                        borderRadius: "50%",
                        border: "2px solid #333",
                      }}
                    >
                      <MonetizationOn style={{ fontSize: 40, color: "#FFFFFF" }} />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: "5px",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography
                        variant="h5"
                        style={{ fontWeight: "bold", color: "#222222" }}
                      >
                        {dataTotalDashBoard.totalPaymentOfDay} 
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginLeft: "20px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{
                          textAlign: "left",
                          color: "#EEEEEE",
                          fontSize: "16px",
                          fontWeight: "bold",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Total Payment
                      </Typography>
                    </div>
                  </Card>
                </div>
              </Card>
            </Card>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid item xs={12}>
          <Card style={{ height: "300px" }}>
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Chart
                type="pie"
                data={chartData}
                options={chartOptions}
                style={{ width: "250px", height: "250px" }}
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
            <TableChart sx={{ margin: 1, color: "#33CC66" }} />
            <FormControl sx={{ marginLeft: "8px", marginRight: "8px" }}>
              <Select
                labelId="technician-select-label"
                id="technician-select"
                value={selectedChart}
                onChange={handleTechnicianChange}
                style={{ height: "30px" }}
              >
                <MenuItem value="Request By Category">
                  Request By Technician
                </MenuItem>
                <MenuItem value="Request By Priority">
                  Request By Priority
                </MenuItem>
                <MenuItem value="Request By Mode">Request By Mode</MenuItem>
                <MenuItem value="Request By Service">
                  Request By Service
                </MenuItem>
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
            <FormControl sx={{ marginLeft: "8px", marginRight: "8px" }}>
              <Select
                labelId="technician-select-label"
                id="technician-select"
                value={selectedTime}
                onChange={handleTimeChange}
                style={{ height: "30px" }}
              >
                <MenuItem value="1">This Week</MenuItem>
                <MenuItem value="2">Last Week</MenuItem>
                <MenuItem value="3">This Month</MenuItem>
                <MenuItem value="4">Last Month</MenuItem>
              </Select>
            </FormControl>
            <div style={{ marginLeft: "auto" }}>
              <Tooltip title="Refresh" arrow>
                <button
                  variant="contained"
                  color="secondary"
                  className="custom-button"
                  onClick={handleReloadBarChart}
                >
                  <Replay />
                </button>
              </Tooltip>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Card style={{ height: "290px" }}>
            <CardContent style={{ marginLeft: "auto", marginRight: "20px" }}>
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
                renderSelectedTime()
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChartManager;
