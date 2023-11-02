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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData(
    "11:18 PM",
    "New Comment Added",
    "by administrator",
    "Comments Click here",
    "Show to Requester false"
  ),
  createData(
    "11:18 PM",
    "New Comment Added",
    "by administrator",
    "Comments Click here",
    "Show to Requester false"
  ),
  createData(
    "11:17 PM",
    "Created",
    "by administrator",
    "Comments Click here",
    "Show to Requester false"
  ),
];

const iconStyle = {
  borderRadius: "100%",
  border: "1px solid #000",
  marginRight: "20px",
};

export default function AccessibleTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          <Button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ marginLeft: "10px", cursor: "pointer", color: "#000",backgroundColor: "#CCCCCC",textTransform: "none" }}
          >
            {isDropdownOpen
              ? `History ▲ (${rows.length})`
              : `History ▼ (${rows.length})`}
          </Button>
        </div>
        <TableBody>
          {isDropdownOpen &&
            rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell align="right" style={{ width: "50px" }}>
                  {row.name}
                </TableCell>
                <TableCell align="left" style={{ width: "300px" }}>
                  <ListAlt style={iconStyle} /> {row.calories}
                </TableCell>
                <TableCell align="left">
                  {row.fat}
                  <br />
                  {row.carbs}
                  <br />
                  {row.protein}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
