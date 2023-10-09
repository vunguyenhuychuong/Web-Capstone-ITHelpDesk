import React, { useEffect, useState } from "react";
import { MDBContainer } from "mdb-react-ui-kit";
import { toast } from "react-toastify";
import { Box, TextField } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

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

  const onHandleChangePassword = async (id) => {
    try {
      const res = ChangePassword(id, data);
      console.log(res);
      toast.success("Change password successful");
      //navigate("/login");
    } catch (error) {
      toast.error("Change password not successful check correct input");
      console.log(error);
    }
  };

  return (
    <section style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5">
          <Box
            sx={{
              width: 500,
              maxWidth: "100%",
            }}
          >
            <TextField fullWidth label="currentPassword" id="currentPassword" name="currentPassword" onChange={handleChange}  value={data.currentPassword} />
            <hr />
            <TextField fullWidth label="newPassword" id="newPassword" name="newPassword" onChange={handleChange} value={data.newPassword} />
            <hr />
            <TextField fullWidth label="confirmNewPassword" id="confirmNewPassword" name="confirmNewPassword" onChange={handleChange} value={data.confirmNewPassword} />
          </Box>

          <button
            type="submit"
            class="btn btn-primary"
            onClick={onHandleChangePassword}
          >
            Submit
          </button>
      </MDBContainer>
    </section>
  );
};

export default ChangePassword;
