import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ListAlt } from "@mui/icons-material";
import { useState } from "react";
import { Input } from "@mui/material";
import { getTicketLog } from "../../../app/api/ticketLog";
import { useParams } from "react-router-dom";
import { formatDate } from "../../helpers/FormatDate";

export default function TicketLogList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { ticketId } = useParams();
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
            placeholder="Filter by solution operations"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: "10px", width: "400px" }}
          />
        </div>
        <TableBody>
          {dataTicketLog && dataTicketLog.length > 0 ? (
            dataTicketLog.map((entry, index) => (
              <TableRow key={index}>
                <TableCell align="right" style={{ width: "50px" }}>
                  {formatDate(entry.timestamp)}
                </TableCell>
                <TableCell align="left" style={{ width: "500px" }}>
                  <ListAlt /> {entry.entries[0].message || "none message"}
                </TableCell>
                <TableCell align="left">
                  <div
                    style={{
                      fontSize: "1.2em",
                      fontWeight: "bold",
                      color: "#007bff",
                    }}
                  >
                    {entry.username}
                  </div>
                  <div style={{ color: "#555" ,paddingLeft: "8px" }}>
                    {entry.action}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3}>No ticket log entries found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
