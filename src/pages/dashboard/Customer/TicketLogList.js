import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Edit, ExpandMore, ListAlt } from "@mui/icons-material";
import { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Input,
  Stack,
  TableHead,
  Typography,
} from "@mui/material";
import { getTicketLog } from "../../../app/api/ticketLog";
import { useParams } from "react-router-dom";
import { formatDate } from "../../helpers/FormatDate";
import { capitalizeWord } from "../../../utils/helper";

export default function TicketLogList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { ticketId } = useParams();
  const [dataTicketLog, setDataTicketLog] = useState([]);

  const fetchDataTicketLog = async () => {
    try {
      const ticketLog = await getTicketLog(ticketId);
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
        {/* <div
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
        </div> */}
        <TableHead>
          <TableRow>
            <TableCell>Changes</TableCell>
            <TableCell align="right">Time</TableCell>
            <TableCell align="right">By</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataTicketLog && dataTicketLog.length > 0 ? (
            dataTicketLog.map((log, index) => (
              <TableRow key={log.timestamp}>
                <TableCell align="left" style={{ width: "40vw" }}>
                  {log.entries[0].message && log.entries[0].message !== "" ? (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel2-content"
                        id="panel2-header"
                      >
                        <Stack
                          direction={"row"}
                          spacing={2}
                          fontWeight={"semibold"}
                          alignItems={"center"}
                        >
                          <ListAlt />
                          <Typography>
                            {log.entries.length + " changes"}
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {log.entries.map((entry) => (
                            <Typography key={entry.id}>
                              {entry.message ? <Edit /> : <></>}{" "}
                              {entry.message ?? ""}
                            </Typography>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    <Stack
                      direction={"row"}
                      spacing={2}
                      fontWeight={"semibold"}
                      alignItems={"center"}
                      px={2}
                    >
                      <Typography>{""}</Typography>
                    </Stack>
                  )}
                </TableCell>
                <TableCell align="right" style={{ width: "20vw" }}>
                  {formatDate(log.timestamp)}
                </TableCell>
                <TableCell align="right">
                  <div style={{ color: "#555", paddingLeft: "8px" }}>
                    {capitalizeWord(log.username)}
                  </div>
                </TableCell>
                <TableCell align="right">
                  <div
                    style={{
                      fontSize: "1.2em",
                      fontWeight: "bold",
                      color: "#007bff",
                    }}
                  >
                    {log.action}
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
