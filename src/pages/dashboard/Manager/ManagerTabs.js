import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import IndexTicket from './IndexTicket';

export default function ManagersTabs() {
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
        <Tab label="Requests" />
        <Tab label="Problems" />
        <Tab label="Projects" />
      </Tabs>
      <Box role="tabpanel" hidden={value !== 0}>
        <IndexTicket />
      </Box>
    </Box>
  );
}