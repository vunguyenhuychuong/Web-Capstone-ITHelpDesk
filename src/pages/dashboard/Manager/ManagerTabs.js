import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import IndexTicket from './IndexTicket';
import AssignTicketList from './AssignTicketList';
import TicketSolution from './TicketSolution';
import CustomizedProgressBars from '../../../components/iconify/LinearProccessing';

export default function ManagersTabs() {
  const [value, setValue] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', backgroundColor: "#EEEEEE" }}>
      <Tabs
        onChange={handleTabChange}
        value={value}
        aria-label="Tabs where selection follows focus"
        selectionFollowsFocus
      >
        <Tab label="Requests" />
        <Tab label="Assigns" />
        <Tab label="Solutions" />
      </Tabs>
      <Box role="tabpanel" hidden={value !== 0}>
        {value === 0 ? <IndexTicket /> : <CustomizedProgressBars />  } 
      </Box>
      <Box role="tabpanel" hidden={value !== 1}>
        {value === 1 ? <AssignTicketList /> : <CustomizedProgressBars /> } 
      </Box>
      <Box role="tabpanel" hidden={value !== 2}>
        {value === 2 ? <TicketSolution /> : <CustomizedProgressBars /> } {/* Render AssignTicketList component */}
      </Box>
    </Box>
  );
}