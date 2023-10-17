import Skeleton from "react-loading-skeleton";
import React from "react";

const LoadingSkeleton = () => {
  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: "10px",
        borderRadius: "5px",
        boxShadow:
          "0px 0px 10px 0px rgba(0,0,0,0.2), 0px 0px 15px 0px rgba(0,0,0,0.14), 0px 0px 5px 0px rgba(0,0,0,0.12)",
      }}
    >
      <Skeleton height={40} width={40} />
      <Skeleton height={20} width={200} style={{ marginTop: "10px" }} />
      {/* Add more skeleton elements as needed */}
    </div>
  );
};

export default LoadingSkeleton;
