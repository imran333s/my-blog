import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import "./Navbar.css";
import logo from "../logo192.png";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState("admin");
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll to apply background blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // active after 50px scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openLoginModal = (role) => {
    setLoginRole(role);
    setIsLoginOpen(true);
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
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
          role={loginRole}
        />
      )}
    </header>
  );
};

export default Navbar;
