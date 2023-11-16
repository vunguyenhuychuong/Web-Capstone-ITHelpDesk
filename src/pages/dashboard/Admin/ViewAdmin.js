import {
  BadgeRounded,
  Diversity3,
  FolderShared,
  Inventory,
  Replay,
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
import LoadingImg from "../../../assets/images/loading.gif";
import {
  getChartActiveCount,
  getChartRoleCount,
  getChartTeamActiveCount,
  getChartTeamMemberCount,
  getChartTeamRecentCreated,
  getChartTeamRecentUpdated,
  getChartUserCreated,
  getChartUserUpdated,
} from "../../../app/api/dashboard";
import UserRecentChart from "./charts/UserRecentChart";
import UserUpdatedChart from "./charts/UserUpdatedChart";
import UserActiveCount from "./charts/UserActiveCount";
import UserRoleCount from "./charts/UserRoleCount";
import TeamRecentChart from "./charts/TeamRecentChart";
import TeamUpdatedChart from "./charts/TeamUpdatedChart";
import TeamActiveCount from "./charts/TeamActiveCount";
import TeamMemberCount from "./charts/TeamMemberCount";

const ViewAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [dataUserRecentUpdated, setDataUserRecentUpdated] = useState([]);
  const [dataUserRecentCreated, setDataUserRecentCreated] = useState([]);
  const [dataUserActiveCount, setDataUserActiveCount] = useState([]);
  const [dataUserRoleCount, setDataUserRoleCount] = useState([]);
  const [dataTeamRecentCreated, setDataTeamRecentCreated] = useState([]);
  const [dataTeamRecentUpdated, setDataTeamRecentUpdated] = useState([]);
  const [dataTeamActiveCount, setDataTeamActiveCount] = useState([]);
  const [dataTeamMemberCount, setDataTeamMemberCount] = useState([]);
  const [selectedChart, setSelectedChart] = useState("1");
  const [selectedChart2, setSelectedChart2] = useState("2");
  const [selectedChart3, setSelectedChart3] = useState("1");
  const [selectedChart4, setSelectedChart4] = useState("1");
  const fetchDatListChart = async () => {
    try {
      setLoading(true);
      const userCreated = await getChartUserCreated();
      const userUpdated = await getChartUserUpdated();
      const activeCount = await getChartActiveCount();
      const roleCount = await getChartRoleCount();
      const teamCreated = await getChartTeamRecentCreated();
      const teamUpdated = await getChartTeamRecentUpdated();
      const teamActiveCount = await getChartTeamActiveCount();
      const teamMemberCount = await getChartTeamMemberCount();
      setDataUserRecentCreated(userCreated);
      setDataUserRecentUpdated(userUpdated);
      setDataUserActiveCount(activeCount);
      setDataUserRoleCount(roleCount);
      setDataTeamRecentCreated(teamCreated);
      setDataTeamRecentUpdated(teamUpdated);
      setDataTeamActiveCount(teamActiveCount);
      setDataTeamMemberCount(teamMemberCount);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatListChart();
  }, []);

  const renderSelectedChart = () => {
    switch (selectedChart) {
      case "1":
        return <UserRecentChart dataSummary={dataUserRecentCreated} />;
      case "2":
        return <UserUpdatedChart dataSummary={dataUserRecentUpdated} />;
      default:
        return null;
    }
  };

  const renderSelectedChart2 = () => {
    switch (selectedChart2) {
      case "1":
        return <UserActiveCount dataSummary={dataUserActiveCount} />;
      case "2":
        return <UserRoleCount dataSummary={dataUserRoleCount} />;
      default:
        return null;
    }
  };

  const renderSelectedChart3 = () => {
    switch (selectedChart3) {
      case "1":
        return <TeamRecentChart dataSummary={dataTeamRecentCreated} />;
      case "2":
        return <TeamUpdatedChart dataSummary={dataTeamRecentUpdated} />;
      default:
        return null;
    }
  };

  const renderSelectedChart4 = () => {
    switch (selectedChart4) {
      case "1":
        return <TeamActiveCount dataSummary={dataTeamActiveCount} />;
      case "2":
        return <TeamMemberCount dataSummary={dataTeamMemberCount} />;
      default:
        return null;
    }
  };

  const handleReloadClick = () => {
    fetchDatListChart();
  };



  const handleAdminChange = (event) => {
    setSelectedChart(event.target.value);
  };

  const handleAdminChange2 = (event) => {
    setSelectedChart2(event.target.value);
  };

  const handleAdminChange3 = (event) => {
    setSelectedChart3(event.target.value);
  };

  const handleAdminChange4 = (event) => {
    setSelectedChart4(event.target.value);
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
            <FolderShared sx={{ margin: 1, color: "#33CC66" }} />
            <FormControl sx={{ marginLeft: "8px", marginRight: "8px" }}>
              <Select
                labelId="technician-select-label"
                id="technician-select"
                value={selectedChart}
                onChange={handleAdminChange}
                style={{ height: "30px" }}
              >
                <MenuItem value="1">Users Created Recently</MenuItem>
                <MenuItem value="2">Users Updated Recently</MenuItem>
              </Select>
            </FormControl>
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
                  onClick={handleReloadClick}
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
            <Inventory sx={{ margin: 1, color: "#9966FF" }} />
            <FormControl sx={{ marginLeft: "8px", marginRight: "8px" }}>
              <Select
                labelId="technician-select-label"
                id="technician-select"
                value={selectedChart2}
                onChange={handleAdminChange2}
                style={{ height: "30px" }}
              >
                <MenuItem value="1">Users Active Count</MenuItem>
                <MenuItem value="2">Users Role Count</MenuItem>
              </Select>
            </FormControl>
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
                  onClick={handleReloadClick}
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
          {/* Card content goes here */}
          <Card style={{ height: "290px" }}>
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
                renderSelectedChart2()
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
            <Diversity3 sx={{ margin: 1, color: "#FF99CC" }} />
            <FormControl sx={{ marginLeft: "8px", marginRight: "8px" }}>
              <Select
                labelId="technician-select-label"
                id="technician-select"
                value={selectedChart3}
                onChange={handleAdminChange3}
                style={{ height: "30px" }}
              >
                <MenuItem value="1">Team Recently Created</MenuItem>
                <MenuItem value="2">Team Recently Updated</MenuItem>
              </Select>
            </FormControl>

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
                  onClick={handleReloadClick}
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
                renderSelectedChart3()
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
            <BadgeRounded sx={{ margin: 1, color: "#9999FF" }} />
            <FormControl sx={{ marginLeft: "8px", marginRight: "8px" }}>
              <Select
                labelId="technician-select-label"
                id="technician-select"
                value={selectedChart4}
                onChange={handleAdminChange4}
                style={{ height: "30px" }}
              >
                <MenuItem value="1">Team Active Counts</MenuItem>
                <MenuItem value="2">Team Member Counts</MenuItem>
              </Select>
            </FormControl>
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
                  onClick={handleReloadClick}
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
          {/* Card content goes here */}
          <Card style={{ height: "290px" }}>
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
                renderSelectedChart4()
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ViewAdmin;
