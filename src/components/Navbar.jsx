import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import "./Navbar.css";
import logo from "../logo192.png";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState("admin"); // track which role is logging in

  const openLoginModal = (role) => {
    setLoginRole(role);
    setIsLoginOpen(true);
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="MyBlog Logo" className="logo-img" />
          </Link>
        </div>

        <nav className="nav-menu">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/news/sports">Sports</Link>
            </li>
            <li>
              <Link to="/news/business">Business</Link>
            </li>
            <li>
              <Link to="/news/politics">Politics</Link>
            </li>
            <li>
              <Link to="/news/entertainment">Entertainment</Link>
            </li>

            <li>
              <button
                onClick={() => openLoginModal("admin")}
                className="admin-btn"
              >
                Admin Login
              </button>
            </li>

            <li>
              <button
                onClick={() => openLoginModal("employee")}
                className="employee-btn"
              >
                Employee Login
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          role={loginRole} // Pass the dynamic role
        />
      )}
    </header>
  );
};

export default Navbar;
