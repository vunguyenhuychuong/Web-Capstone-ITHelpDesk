import React from "react";
import "../../../../assets/css/ticket.css";
import "../../../../assets/css/ServiceTicket.css";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { MDBCol } from "mdb-react-ui-kit";
import { ArrowUpward, Edit } from "@mui/icons-material";

const TicketHistory = () => {
  const navigate = useNavigate();

  function createData(name, calories, fat) {
    return { name, calories, fat };
  }

  const rows = [
    createData("06:13 PM", <Edit />, "by administrator"),
    createData("06:09 PM", <Edit />, "by administrator"),
    createData("06:08 PM", <Edit />, "by administrator"),
  ];

  return (
    <Grid container>
      <Grid item xs={9}>
        <MDBCol md="12">
          <Stack spacing={2} direction="row">
            <MDBCol md="2" className="mt-2">
              <div className="d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-link narrow-input icon-label"
                >
                  Oct 11 , 2023 <ArrowUpward />
                </button>
              </div>
            </MDBCol>
          </Stack>
        </MDBCol>
        <MDBCol md="12">
          <TableContainer>
            <Table lg={{ width: "100%" }} aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell>By Who</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.calories}</TableCell>
                    <TableCell>
                      <div>{row.fat}</div>
                      <div>{row.fat}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MDBCol>
      </Grid>
    </Grid>
  );
};

export default TicketHistory;
