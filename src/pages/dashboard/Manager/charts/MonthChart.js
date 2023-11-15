import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";

const chartSetting = {
    yAxis: [
      {
        label: "number ",
      },
    ],
    width: 620,
    height: 300,
    sx: {
      [`.${axisClasses.left} .${axisClasses.label}`]: {
        transform: "translate(10px, 0)",
      },
    },
  };

const valueFormatter = (value) => `${value}`;

export default function MonthChart(props) {
  const { dataSummary } = props;

  if (!dataSummary || dataSummary.length === 0) {
    return <div>No data available</div>;
  }
  console.log(dataSummary)
  const dataset = dataSummary.map((dayData) => ({
    onGoingTicketsCount: dayData.onGoingTicketsCount,
    closedTicketsCount: dayData.closedTicketsCount,
    cancelledTicketsCount: dayData.cancelledTicketsCount,
    lineName: dayData.lineName,
  }));

  return (
    <BarChart
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
