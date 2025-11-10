import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-about">
          <h3>NewsPulse</h3>
          <p>
            Trusted source for the latest breaking news, analysis and insights
            from around the world. Stay informed with verified journalism.
          </p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/news/all">All News</Link>
            </li>
            <li>
              <Link to="/news/politics">Politics</Link>
            </li>
            <li>
              <Link to="/news/business">Business</Link>
            </li>
            <li>
              <Link to="/news/sports">Sports</Link>
            </li>
            <li>
              <Link to="/news/entertainment">Entertainment</Link>
            </li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} NewsPulse. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
