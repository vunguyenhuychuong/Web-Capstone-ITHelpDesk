import Wrapper from "../../assets/wrappers/Navbar";
import { FaAlignLeft } from "react-icons/fa";
import Logo from "./Logo";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../assets/css/navbar.css";
import {
  AccountBox,
  Dashboard,
  ExitToApp,
  Help,
  Mail,
  NotificationAdd,
  RotateLeft,
  Search,
  Settings,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { roleOptions } from "../../pages/helpers/tableComlumn";
import { GetDataProfileUser } from "../../app/api";
import { useState } from "react";
import NotificationList from "../../pages/dashboard/Notificate/NotificationList";

export function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

// export  function stringAvatar(name) {
//   return {
//     sx: {
//       bgcolor: stringToColor(name),
//     },
//     children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
//   };
// }

export function stringAvatar(name) {
  if (!name || name.trim().length === 0) {
    return {
      sx: {
        bgcolor: "#ccc", // Default color for empty or undefined name
      },
      children: "", // No text for empty or undefined name
    };
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const Navbar = ({ notifications }) => {
  const user = useSelector((state) => state.auth);
  const userName = user.user.lastName + " " + user.user.firstName;
  const userRole = roleOptions.find((role) => role.id === user.user.role)?.name;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    avatarUrl: "",
  });

  const handleNotificationClick = () => {
    // setAnchorEl(event.currentTarget);
    setDrawerOpen(true);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const settings = ["Profile", "Dashboard", "Logout"];

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const fetchDataProfile = async () => {
    try {
      const res = await GetDataProfileUser();
      setData(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("profile");
    sessionStorage.removeItem("profile");
    localStorage.clear();
    toast.success("Log out successful", {
      autoClose: 1000,
      hideProgressBar: false,
    });
    navigate("/");
  };

  const handleLogoutUser = (setting) => {
    if (setting === "Logout") {
      logout();
    } else if (setting === "Profile") {
      navigate("/home/profile");
    } else if (setting === "Dashboard") {
      navigate("/home/listTicket");
    }
    setAnchorElUser(null);
  };

  return (
    <Wrapper>
      <div className="nav-center">
        <button type="button" className="toggle-btn">
          <FaAlignLeft />
        </button>
        <Paper component="form" className="search-bar">
          <InputBase className="search-input" placeholder="Search..." />
          <IconButton
            type="submit"
            aria-label="search"
            style={{ color: "#0099FF" }}
          >
            <Search />
          </IconButton>
        </Paper>
        <div>
          {" "}
          <Logo />
        </div>
        <div className="btn-container">
          <div className="icons-wrapper">
            <Tooltip title="Message">
              <IconButton size="large" style={{ color: "#0099FF" }}>
                <Badge badgeContent={4} color="error">
                  <Mail />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                style={{ color: "#0099FF" }}
                onClick={handleNotificationClick}
              >
                <Badge badgeContent={17} color="error">
                  <NotificationAdd />
                </Badge>
              </IconButton>
            </Tooltip>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={handleDrawerClose}
            >
              <div
                style={{
                  width: 300,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Notifications
                </Typography>
                <NotificationList notifications={notifications} />
              </div>
            </Drawer>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <NotificationList notifications={notifications} />
            </Popover>
            <Tooltip title="Open Setting">
              <IconButton size="large" style={{ color: "#0099FF" }}>
                <Badge color="error">
                  <Settings />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Reload">
              <IconButton size="large" style={{ color: "#0099FF" }}>
                <Badge color="error">
                  <RotateLeft />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Information">
              <IconButton size="large" style={{ color: "#0099FF" }}>
                <Badge color="error">
                  <Help />
                </Badge>
              </IconButton>
            </Tooltip>
            <Box sx={{ flexGrow: 0 }}>
              <div
                className="icon-wrapper"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Tooltip title="Menu">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {data ? (
                      <Avatar alt="User Avatar" {...stringAvatar(userName)} />
                    ) : (
                      <Avatar
                        alt="Remy Sharp"
                        src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                      />
                    )}
                    <div className="online-dot" /> {/* Green dot */}
                  </IconButton>
                </Tooltip>
                <div style={{ marginLeft: "8px" }}>
                  <Typography variant="body1">{userName}</Typography>
                  <Typography variant="caption">{userRole}</Typography>
                </div>
              </div>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleLogoutUser(setting)}
                  >
                    {setting === "Profile" && (
                      <AccountBox sx={{ marginRight: 1, color: "#3399FF" }} />
                    )}
                    {setting === "Dashboard" && (
                      <Dashboard sx={{ marginRight: 1, color: "#3399FF" }} />
                    )}
                    {setting === "Logout" && (
                      <ExitToApp sx={{ marginRight: 1, color: "#3399FF" }} />
                    )}
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="primary"
                    >
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default Navbar;
