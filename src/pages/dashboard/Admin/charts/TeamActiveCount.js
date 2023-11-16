import * as React from "react";
import { PieChart } from '@mui/x-charts/PieChart';

export default function TeamActiveCount(props) {

  const { dataSummary } = props;

   const data = [
    { label: 'Active Teams', value: dataSummary.activeTeamCount },
    { label: 'Inactive Teams', value: dataSummary.inactiveTeamCount },
  ];

  return (
    <PieChart
      series={[
        {
          startAngle: -90,
          endAngle: 90,
          data,
        },
      ]}
      height={300}
    />
  );
}
