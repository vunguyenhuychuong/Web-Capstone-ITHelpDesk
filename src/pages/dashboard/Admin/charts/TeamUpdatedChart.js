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

const TeamUpdatedChart = ({ dataSummary }) => {
  return (
    <Table>
      <TableHead>
        <TableRow style={{ fontWeight: "bold", color: "black" }}>
        <TableCell className="boldText">Name</TableCell>
          <TableCell className="boldText">Location</TableCell>
          <TableCell className="boldText">Modified At</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {dataSummary.map((team, index) => (
          <TableRow key={index} className="hoverCell">
            <TableCell>{team.name}</TableCell>
            <TableCell>{team.location}</TableCell>
            <TableCell>{formatDate(team.modifiedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TeamUpdatedChart;
