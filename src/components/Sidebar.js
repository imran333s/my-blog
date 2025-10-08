import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Sidebar = ({ isOpen, toggleSidebar, onLoginClick }) => {       



  return (
    <>
      {/* Hamburger button on extreme left */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={toggleSidebar}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/news/sports" onClick={toggleSidebar}>
              Sports
            </Link>
          </li>
          <li>
            <Link to="/news/business" onClick={toggleSidebar}>
              Business
            </Link>
          </li>
          <li>
            <Link to="/news/politics" onClick={toggleSidebar}>
              Politics
            </Link>
          </li>
          <li>
            <Link to="/news/entertainment" onClick={toggleSidebar}>
              Entertainment
            </Link>
          </li>
          {/* Admin Login button inside sidebar */}
          <li>
            <button
              onClick={() => {
                onLoginClick();
                toggleSidebar();
              }}
              className="sidebar-login-btn"
            >
              Admin Login
            </button>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Sidebar;
