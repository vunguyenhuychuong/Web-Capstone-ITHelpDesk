import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Customer from '../Customer';

export default function AccessibleTabs1() {
  const [value, setValue] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        onChange={handleTabChange}
        value={value}
        aria-label="Tabs where selection follows focus"
        selectionFollowsFocus
      >
        <Tab label="Customer Manager" />
        <Tab label="Item Two" />
        <Tab label="Item Three" />
      </Tabs>
      <Box role="tabpanel" hidden={value !== 0}>
        <Customer />
      </Box>
    </Box>
  );
}