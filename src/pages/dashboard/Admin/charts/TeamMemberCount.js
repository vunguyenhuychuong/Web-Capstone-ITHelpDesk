import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import "../../../../assets/css/homeManager.css";

export default function TeamMemberCount(props) {
  const { dataSummary } = props;

  if (!dataSummary || !dataSummary.data) {
    return null;
  }

  const transformedData = dataSummary.data?.map((item, index) => ({
    id: index,
    value: item.numberOfMembers,
    label: item.name,
  }));
  return (
    <div className="pie-chart-container">
      <PieChart
        series={[
          {
            data: transformedData,
            highlightScope: { faded: "global", highlighted: "item" },
            faded: { innerRadius: 40, additionalRadius: -30, color: "gray" },
          },
        ]}
        height={200}
      />
    </div>
  );
}
