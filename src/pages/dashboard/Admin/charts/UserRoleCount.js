import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function UserRoleCount(props) {
  const { dataSummary } = props;

  if (!dataSummary || !dataSummary.data) {
    return null;
  }

  const transformedData = dataSummary.data.map((item, index) => ({
    id: index,
    value: item.amount,
    label: item.row,
  }));
  return (
    <PieChart
      series={[
        {
          data: transformedData,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={200}
    />
  );
}
