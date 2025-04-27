import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./SmallLoader.css";
function SmallLoader() {
  return (
    <>
      <div className="small-loader-container">
        <CircularProgress sx={{ color: "#1a8917" }} thickness={2} />
      </div>
    </>
  );
}
export default SmallLoader;
