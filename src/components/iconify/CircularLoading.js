import { CircularProgress } from "@mui/material";

export default function CircularLoading() {
  return (
    <CircularProgress
      variant="indeterminate"
      disableShrink
      sx={{
        position: "relative",
        left: "37vw",
        color: "#1a90ff",
        animationDuration: "550ms",
        margin: "2rem",
      }}
      size={"3rem"}
      thickness={4}
    />
  );
}
