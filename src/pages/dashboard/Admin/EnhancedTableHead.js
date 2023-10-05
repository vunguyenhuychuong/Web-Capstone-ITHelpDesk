import { TableHead, TableRow , TableCell, TableSortLabel, Box} from "@mui/material";
import React from 'react';

export default function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {/* Your header cells */}
      </TableRow>
    </TableHead>
  );
}