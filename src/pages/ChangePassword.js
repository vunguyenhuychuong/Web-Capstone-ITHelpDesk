import React, {  useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import { Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

import { ChangePasswordUser } from "../app/api/profile";
import CustomTextField from "./CustomizeField";

const ChangePassword = ({ onCancel }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isSubmitting) return;
    setIsSubmitting(true);
    const { currentPassword, newPassword, confirmNewPassword } = data;

    if (newPassword !== currentPassword && newPassword === confirmNewPassword) {
      try {
        const res = await ChangePasswordUser(data);
        toast.success("Change password successful");
        logout();
      } catch (error) {
        toast.error("Change password not successful, please check your input");
        console.log(error);
      }finally{
        setIsSubmitting(false);
      }
    } else {
      setTimeout(() => {
        toast.error(
          "Passwords do not match or new password is the same as the current password"
        );
        setIsSubmitting(false);
      }, 3000);
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
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
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
