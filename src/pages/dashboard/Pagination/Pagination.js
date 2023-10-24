import React from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const Pagination = ({ pageSize, handleChangePageSize }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <label style={{ fontWeight: 'bold', marginTop: '15px' }}>Items per page: </label>
      <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
        <Select
          value={pageSize}
          onChange={handleChangePageSize}
          className="select"
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default Pagination;