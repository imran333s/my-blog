import React from "react";
import "./Loader.css";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="global-loading-container">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
};

export default Loader;
