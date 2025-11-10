import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import "./Navbar.css";
import logo from "../logo192.png";

const Navbar = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginRole, setLoginRole] = useState("admin");
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);


  // Detect scroll to apply background blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSearchQuery("");
    setSuggestions([]);
  }, [location.pathname]);

  // Search handler
  const handleSearch = () => {
    if (searchQuery.trim().length === 0) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleSuggestClick = (id) => {
    navigate(`/blog/${id}`);
    setSearchQuery("");
    setSuggestions([]);
  };

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live suggestion fetch
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs/search?q=${searchQuery}`);
        const data = await res.json();
        setSuggestions(data.slice(0, 5));
      } catch (err) {
        console.log(err);
      }
    }, 300);

    return () => clearTimeout(fetchSuggestions);
  }, [searchQuery, API_URL]);

  // Login modal
  const openLoginModal = (role) => {
    setLoginRole(role);
    setIsLoginOpen(true);
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        dropdownRef.current.classList.remove("open");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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
              <div className="search-box" ref={searchRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search..."
                />
                <i
                  className="fas fa-search search-icon"
                  onClick={handleSearch}
                ></i>

                {suggestions.length > 0 && (
                  <ul className="suggestion-list">
                    {suggestions.map((item) => (
                      <li
                        key={item._id}
                        onClick={() => handleSuggestClick(item._id)}
                      >
                        {item.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>

            <li>
              <Link to="/">Home</Link>
            </li>

            {/* Dropdown */}
            <li className="dropdown" ref={dropdownRef}>
              <span
                className="dropdown-title"
                onClick={() => dropdownRef.current.classList.toggle("open")}
              >
                News ▾
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    to="/news/all"
                    onClick={() => dropdownRef.current.classList.remove("open")}
                  >
                    All
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news/sports"
                    onClick={() => dropdownRef.current.classList.remove("open")}
                  >
                    Sports
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news/business"
                    onClick={() => dropdownRef.current.classList.remove("open")}
                  >
                    Business
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news/politics"
                    onClick={() => dropdownRef.current.classList.remove("open")}
                  >
                    Politics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news/entertainment"
                    onClick={() => dropdownRef.current.classList.remove("open")}
                  >
                    Entertainment
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
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
