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


const UserRecentChart = ({ dataSummary }) => {
  return (
    <Table>
      <TableHead>
        <TableRow style={{ fontWeight: "bold", color: "black" }}>
          <TableCell className="boldText">Username</TableCell>
          <TableCell className="boldText">Role</TableCell>
          <TableCell className="boldText">Created At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dataSummary.map((user, index) => (
          <TableRow key={index} className="hoverCell">
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>{formatDate(user.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserRecentChart;
