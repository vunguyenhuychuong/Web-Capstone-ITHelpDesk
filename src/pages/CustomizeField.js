import React from "react";
import { IconButton, InputAdornment, InputLabel, TextField } from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const CustomTextField = ({ label, name, value, onChange, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <TextField
        type={showPassword ? "text" : "password"}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        fullWidth
        variant="outlined"
        size="small" 
        InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        {...props}
      />
    </div>
  );
};

export default CustomTextField;
