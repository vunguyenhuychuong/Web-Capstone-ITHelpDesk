import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@mui/material";
import "../../../../assets/css/homeManager.css";

const ServiceChart = ({ dataSummary }) => {
  return (
    <Table>
      <TableBody>
        {dataSummary && dataSummary.rows && dataSummary.rows.length > 0 && (
          <>
            <TableRow className="hoverCell">
              <TableCell colSpan={3}></TableCell>
              <TableCell className="boldText" style={{ fontWeight: 'bold', color: 'black' }}>Close</TableCell>
              <TableCell className="boldText" style={{ fontWeight: 'bold', color: 'black' }}>Open</TableCell>
              <TableCell className="boldText" style={{ fontWeight: 'bold', color: 'black' }}>Overdue</TableCell>
            </TableRow>
            <TableRow className="hoverCell">
              <TableCell colSpan={3}>{dataSummary.rows[0].lineName}</TableCell>
              <TableCell >{dataSummary.rows[0].closedTicketsCount}</TableCell>
              <TableCell>{dataSummary.rows[0].onGoingTicketsCount}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.rows[0].cancelledTicketsCount}</TableCell>
            </TableRow>
            <TableRow className="hoverCell">
              <TableCell colSpan={3}>{dataSummary.rows[1].lineName}</TableCell>
              <TableCell>{dataSummary.rows[1].closedTicketsCount}</TableCell>
              <TableCell>{dataSummary.rows[1].onGoingTicketsCount}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.rows[1].cancelledTicketsCount}</TableCell>
            </TableRow>
            <TableRow className="hoverCell">
              <TableCell colSpan={3}>{dataSummary.rows[2].lineName}</TableCell>
              <TableCell>{dataSummary.rows[2].closedTicketsCount}</TableCell>
              <TableCell>{dataSummary.rows[2].onGoingTicketsCount}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.rows[2].cancelledTicketsCount}</TableCell>
            </TableRow>
            <TableRow className="hoverCell">
              <TableCell colSpan={3}>{dataSummary.rows[2].lineName}</TableCell>
              <TableCell>{dataSummary.rows[2].closedTicketsCount}</TableCell>
              <TableCell>{dataSummary.rows[2].onGoingTicketsCount}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.rows[3].cancelledTicketsCount}</TableCell>
            </TableRow>
            <TableRow className="hoverCell">
              <TableCell colSpan={3}>{dataSummary.rows[2].lineName}</TableCell>
              <TableCell>{dataSummary.rows[2].closedTicketsCount}</TableCell>
              <TableCell>{dataSummary.rows[2].onGoingTicketsCount}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.rows[4].cancelledTicketsCount}</TableCell>
            </TableRow>
            <TableRow className="hoverCell">
              <TableCell colSpan={3}>{dataSummary.rows[2].lineName}</TableCell>
              <TableCell>{dataSummary.rows[2].closedTicketsCount}</TableCell>
              <TableCell>{dataSummary.rows[2].onGoingTicketsCount}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.rows[5].cancelledTicketsCount}</TableCell>
            </TableRow>
            <TableRow className="hoverCell">
              <TableCell colSpan={3}>{dataSummary.rows[2].lineName}</TableCell>
              <TableCell>{dataSummary.rows[2].closedTicketsCount}</TableCell>
              <TableCell>{dataSummary.rows[2].onGoingTicketsCount}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.rows[6].cancelledTicketsCount}</TableCell>
            </TableRow>
            <TableRow className="hoverCell">
              <TableCell colSpan={3}>{dataSummary.rows[2].lineName}</TableCell>
              <TableCell>{dataSummary.rows[2].closedTicketsCount}</TableCell>
              <TableCell>{dataSummary.rows[2].onGoingTicketsCount}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.rows[7].cancelledTicketsCount}</TableCell>
            </TableRow>
            <TableRow className="hoverCell">
              <TableCell colSpan={3} style={{ fontWeight: 'bold', color: 'black' }}>Total</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.total.totalClosedTicketsCount}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.total.totalOnGoingTickets}</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: 'red' }}>{dataSummary.total.totalCancelledTicketsCount}</TableCell>
            </TableRow>
            
          </>
        )}
      </TableBody>
    </Table>
  );
};

export default ServiceChart;
