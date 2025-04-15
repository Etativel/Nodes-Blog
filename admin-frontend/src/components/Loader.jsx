import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "../styles/Loader.css";
function Loader() {
  return (
    <>
      <div className="loader-container">
        <CircularProgress sx={{ color: "#1a8917" }} thickness={2} />
      </div>
    </>
  );
}
export default Loader;
