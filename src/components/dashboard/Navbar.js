import Wrapper from "../../assets/wrappers/Navbar";
import { FaAlignLeft } from "react-icons/fa";
import Logo from "./Logo";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../assets/css/navbar.css";
import {
  AccountBox,
  Close,
  Dashboard,
  ExitToApp,
  Help,
  Mail,
  MoreVert,
  NotificationAdd,
  RotateLeft,
  Settings,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { roleOptions } from "../../pages/helpers/tableComlumn";
import { useState } from "react";
import NotificationList from "../../pages/dashboard/Notificate/NotificationList";
import {
  ReadNotification,
  ReadNotificationAll,
  getAllNotification,
} from "../../app/api/notification";
import { toggleSidebar } from "../../features/user/authSlice";

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
export function stringAvatar(name) {
  if (!name || name.trim().length === 0) {
    return {
      sx: {
        bgcolor: "#ccc",
      },
      children: "",
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
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [readNotifications, setReadNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(
    notifications?.length || 0
  );
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(toggleSidebar());
  };
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const scrollThreshold = 50;
  const shouldRenderLogo = scrollPosition <= scrollThreshold;

  const [dataListNotification, setDataListNotification] = useState([]);
  const fetchDataListNotification = async () => {
    try {
      const response = notifications || (await getAllNotification());
      setDataListNotification(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataListNotification();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      console.log("Scroll Position:", currentScrollPosition);

      setScrollPosition(currentScrollPosition);
      setIsLogoVisible(currentScrollPosition <= 50);
      console.log("Is Logo Visible:", isLogoVisible);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    avatarUrl: "",
  });

  const handleMoreVertClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMoreVertClose = () => {
    setMenuAnchor(null);
  };

  const handleOptionSelect = async (option, notificationId) => {
    switch (option) {
      case "Mark as Read":
        try {
          await ReadNotification(notificationId);
          setReadNotifications((prevReadNotifications) => [
            ...prevReadNotifications,
            notificationId,
          ]);
          setNotificationCount((prevCount) => prevCount - 1);
        } catch (error) {
          console.log("Error marking notification as read:", error);
        }
        break;
      case "Delete":
        try {
          await ReadNotificationAll();
          setReadNotifications((prevReadNotifications) => [
            ...prevReadNotifications,
          ]);
          setNotificationCount((prevCount) => prevCount - 1);
        } catch (error) {
          console.log("Error marking notification as read:", error);
        }
        break;
      default:
        break;
    }
    handleMoreVertClose();
  };

  const handleNotificationClick = () => {
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
      const role = user.user.role;
      console.log("User Role:", role);
      if (role === 2) {
        navigate("/home/homeManager");
      } else if (role === 3) {
        navigate("/home/homeTechnician");
      } else if (role === 0) {
        navigate("/home/homeAdmin");
      } else if (role === 1) {
        navigate("/home/mains");
      } else if (role === 4) {
        navigate("/home/homeAccountant");
      }
    }
    setAnchorElUser(null);
  };

  return (
    <Wrapper>
      {shouldRenderLogo  && (
        <div className="nav-center">
          <button type="button" className="toggle-btn" onClick={toggle}>
            <FaAlignLeft />
          </button>
          <Logo />
          <div className="btn-container">
            <div className="icons-wrapper">
              <Tooltip title="Message" arrow>
                <IconButton size="large" style={{ color: "#0099FF" }}>
                  <Badge badgeContent={4} color="error">
                    <Mail />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Notifications" arrow>
                <IconButton
                  size="large"
                  style={{ color: "#0099FF" }}
                  onClick={handleNotificationClick}
                >
                  <Badge badgeContent={notificationCount} color="error">
                    <NotificationAdd />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerClose}
              >
                <div className="drawerContainer">
                  <div className="headerRow">
                    <Typography variant="h6" className="notificationsHeader">
                      Notifications
                    </Typography>
                    <div className="headerButtons">
                      <IconButton onClick={handleMoreVertClick}>
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={handleMoreVertClose}
                      >
                        <MenuItem
                          onClick={() => handleOptionSelect("Mark as Read")}
                        >
                          Mark as Read
                        </MenuItem>
                        <MenuItem onClick={() => handleOptionSelect("Delete")}>
                          Mark as Delete
                        </MenuItem>
                      </Menu>
                      <IconButton onClick={handleDrawerClose}>
                        <Close />
                      </IconButton>
                    </div>
                  </div>
                  <NotificationList
                    fetchDataListNotification={fetchDataListNotification}
                    notifications={dataListNotification}
                    readNotifications={readNotifications}
                    onOptionSelect={handleOptionSelect}
                  />
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
                <NotificationList
                  fetchDataListNotification={fetchDataListNotification}
                  readNotifications={readNotifications}
                  onOptionSelect={handleOptionSelect}
                  notificationCount={notificationCount}
                />
              </Popover>
              <Tooltip title="Open Setting" arrow>
                <IconButton size="large" style={{ color: "#0099FF" }}>
                  <Badge color="error">
                    <Settings />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Reload" arrow>
                <IconButton size="large" style={{ color: "#0099FF" }}>
                  <Badge color="error">
                    <RotateLeft />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Information" arrow>
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
                  <Tooltip title="Profile User" arrow>
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      {data ? (
                        <Avatar alt="User Avatar" {...stringAvatar(userName)} />
                      ) : (
                        <Avatar
                          alt="Remy Sharp"
                          src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                        />
                      )}
                      <div className="online-dot" />
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
      )}
    </Wrapper>
  );
};
export default Navbar;
