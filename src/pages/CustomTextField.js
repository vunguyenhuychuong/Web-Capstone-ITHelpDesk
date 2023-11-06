import React from "react";
import { TextField } from "@mui/material";

const CustomTextField = ({ label, name, value, onChange, ...props }) => {
  return (
    <div>
      <label htmlFor={name} style={{ textAlign: 'left', marginBottom: '8px', display: 'block', color: '#3399FF' }}>{label}</label>
      <TextField
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        fullWidth
        variant="outlined"
        size="small"
        {...props}
      />
    </div>
  );
};

export default CustomTextField;
