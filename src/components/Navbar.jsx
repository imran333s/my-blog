import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import "./Navbar.css";

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <div className="logo">
          <Link to="/">
            <img src="/logo192.png" alt="MyBlog Logo" className="logo-img" />
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
                onClick={() => setIsLoginOpen(true)}
                className="admin-btn"
              >
                Admin Login
              </button>
            </li>

            {/* <li>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="register-btn"
              >
                Register
              </button>
            </li> */}
          </ul>
        </nav>
      </div>

      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
