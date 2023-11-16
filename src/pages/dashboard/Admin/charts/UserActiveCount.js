import * as React from "react";
import { PieChart } from '@mui/x-charts/PieChart';

export default function UserActiveCount(props) {

  const { dataSummary } = props;

   const data = [
    { label: 'Active Users', value: dataSummary.activeUserCount },
    { label: 'Inactive Users', value: dataSummary.inactiveUserCount },
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
