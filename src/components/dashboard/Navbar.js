import Wrapper from "../../assets/wrappers/Navbar";
import { FaAlignLeft } from "react-icons/fa";
import Logo from "./Logo";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../assets/css/navbar.css"; 
import { Mail, NotificationAdd, Search, Settings } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { roleOptions } from "../../pages/dashboard/Admin/tableComlumn";

const Navbar = () => {
  const user = useSelector((state) => state.auth);
  const userAvatar = user.user.avatarUrl;
  const userName = user.user.lastName + " " + user.user.firstName;
  const userRole = roleOptions.find((role) => role.id === user.user.role)?.name;
  const navigate = useNavigate();

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
        <div>
          {" "}
          <Logo />
        </div>
        <div className="btn-container">
          <div className="icons-wrapper">
            <Paper component="form" className="search-bar">
              <InputBase className="search-input" placeholder="Search..." />
              <IconButton type="submit" aria-label="search">
                <Search />
              </IconButton>
            </Paper>
            <IconButton size="large" color="#33CCFF">
              <Badge badgeContent={4} color="error">
                <Mail />
              </Badge>
            </IconButton>
            <IconButton size="large" color="#33CCFF">
              <Badge badgeContent={17} color="error">
                <NotificationAdd />
              </Badge>
            </IconButton>
            <IconButton size="large" color="#33CCFF">
              <Badge color="error">
                <Settings />
              </Badge>
            </IconButton>
            <Box sx={{ flexGrow: 0 }}>
              <div
                className="icon-wrapper"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {userAvatar ? (
                      <Avatar alt="User Avatar" src={userAvatar} />
                    ) : (
                      <Avatar
                        alt="Remy Sharp"
                        src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                      />
                    )}
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
                    <Typography textAlign="center">{setting}</Typography>
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
