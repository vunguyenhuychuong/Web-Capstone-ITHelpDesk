import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";

const chartSetting = {
    yAxis: [
    ],
    width: 700,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(10px, 0)",
      },
    },
  };

const valueFormatter = (value) => `${value}`;

export default function WeekChart(props) {
  const { dataSummary } = props;

  if(!Array.isArray(dataSummary)) {
    return null;
  }
  const dataset = dataSummary.map((dayData) => ({
    onGoingTicketsCount: dayData.onGoingTicketsCount || 0,
    closedTicketsCount: dayData.closedTicketsCount || 0,
    cancelledTicketsCount: dayData.cancelledTicketsCount || 0,
    lineName: dayData.lineName || 'Unknown',
  }));

  return (
    <BarChart
    style={{ margin: "20px", padding: "20px", border: "1px solid #ddd" }}
      dataset={dataset}
      xAxis={[{ scaleType: "band", dataKey: "lineName" }]}
      series={[
        { dataKey: "onGoingTicketsCount", label: "Ongoing Tickets", valueFormatter },
        { dataKey: "closedTicketsCount", label: "Closed Tickets", valueFormatter },
        { dataKey: "cancelledTicketsCount", label: "Cancelled Tickets", valueFormatter },
      ]}
      {...chartSetting}
    />
  );
}
