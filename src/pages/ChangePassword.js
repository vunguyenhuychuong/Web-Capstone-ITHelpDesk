import React, { useEffect, useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import { Box, TextField } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { ChangePasswordUser } from "../app/api/profile";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const logout = () => {
    localStorage.removeItem("profile");
    sessionStorage.removeItem("profile");
    localStorage.clear();
    navigate("/login");
  };

  const onHandleChangePassword = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = data;

    if (newPassword !== currentPassword && newPassword === confirmNewPassword) {
      try {
        const res = await ChangePasswordUser(data);
        console.log(res);
        toast.success("Change password successful");
        logout();
      } catch (error) {
        toast.error("Change password not successful, please check your input");
        console.log(error);
      }
    } else {
      toast.error(
        "Passwords do not match or new password is the same as the current password"
      );
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
        <h2>Change Password</h2>
        <Box
          sx={{
            maxWidth: "100%",
          }}
        >
          <TextField
            fullWidth
            label="currentPassword"
            id="currentPassword"
            name="currentPassword"
            onChange={handleChange}
            value={data.currentPassword}
            sx={{ marginTop: 2 }} 
          />
          <TextField
            fullWidth
            label="newPassword"
            id="newPassword"
            name="newPassword"
            onChange={handleChange}
            value={data.newPassword}
            sx={{ marginTop: 2 }} 
          />
          <TextField
            fullWidth
            label="confirmNewPassword"
            id="confirmNewPassword"
            name="confirmNewPassword"
            onChange={handleChange}
            value={data.confirmNewPassword}
            sx={{ marginTop: 2 }} 
          />
        </Box>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={onHandleChangePassword}
          style={{ marginTop: "16px" }} 
        >
          Agree
        </button>
      </MDBContainer>
    </section>
  );
};

export default ChangePassword;
