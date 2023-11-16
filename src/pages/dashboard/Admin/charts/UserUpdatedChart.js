import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import "../../../../assets/css/homeManager.css";
import { formatDate } from "../../../helpers/FormatDate";

const UserUpdatedChart = ({ dataSummary }) => {
  return (
    <Table>
      <TableHead>
        <TableRow style={{ fontWeight: "bold", color: "black" }}>
          <TableCell>Username</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Modified At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dataSummary.map((user, index) => (
          <TableRow key={index} className="hoverCell">
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{formatDate(user.modifiedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserUpdatedChart;
