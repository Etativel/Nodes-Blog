import * as React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import "../styles/Loader.css";
import Navigation from "./Navbar";
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
