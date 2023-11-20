import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ListAlt } from "@mui/icons-material";
import { useState } from "react";
import { Button, Input } from "@mui/material";
import { getTicketLog } from "../../../../app/api/ticketLog";
import { formatTicketDate } from "../../../helpers/FormatAMPM";

const iconStyle = {
  borderRadius: "100%",
  border: "1px solid #000",
  marginRight: "20px",
};

export default function AccessibleTable({ticketId}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [dataTicketLog, setDataTicketLog] = useState([]);

  const fetchDataTicketLog = async () => {
    try {
      const ticketLog = await getTicketLog(ticketId);
      console.log(ticketLog);
      setDataTicketLog(ticketLog);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    fetchDataTicketLog();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="caption table">
        <div
          style={{
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            marginLeft: "40px",
            marginTop: "40px",
          }}
        >
          <label style={{ marginRight: "10px" }}>Filter:</label>
          <Input
            type="text"
            placeholder="FIlter by solution operations"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: "10px", width: "400px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
        {dataTicketLog && (  // Check if dataTicketLog is defined
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              marginLeft: '10px',
              cursor: 'pointer',
              color: '#000',
              backgroundColor: '#CCCCCC',
              textTransform: 'none',
            }}
          >
            {isDropdownOpen
              ? `History ▲ (${dataTicketLog.length})`
              : `History ▼ (${dataTicketLog.length})`}
          </Button>
        )}
        </div>
        <TableBody>
          {isDropdownOpen &&
            dataTicketLog.map((entry, index) => (
              <TableRow key={index}>
                <TableCell align="right" style={{ width: '50px' }}>
                  {formatTicketDate(entry.timestamp)}
                </TableCell>
                <TableCell align="left" style={{ width: '500px' }}>
                  <ListAlt style={iconStyle} /> {entry.entries[0].message}
                </TableCell>
                <TableCell align="left">
                  {entry.username}
                  <br />
                  {entry.action}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
