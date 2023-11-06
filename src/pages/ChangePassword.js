import React, { useEffect, useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import { Box, TextField } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input } from "antd";

import { ChangePasswordUser } from "../app/api/profile";
import CustomTextField from "./CustomizeField";

const ChangePassword = ({ onCancel }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

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
        <h2
          style={{ fontWeight: "bold", color: "#0099FF", marginTop: "-20px" }}
        >
          Change Password
        </h2>
        <Box
          sx={{
            maxWidth: "100%",
          }}
        >
          <CustomTextField
            label="Current Password"
            name="currentPassword"
            value={data.currentPassword}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <CustomTextField
            label="New Password"
            name="newPassword"
            value={data.newPassword}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
          <CustomTextField
            label="Confirm New Password"
            name="confirmNewPassword"
            value={data.confirmNewPassword}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={onHandleChangePassword}
          size="large"
          style={{ flex: 1 }}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onCancel}
          size="large"
          style={{ flex: 1 }}
        >
          Cancel
        </Button>
      </MDBContainer>
    </section>
  );
};

export default ChangePassword;
