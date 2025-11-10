import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Slideshow.css";

const Slideshow = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // ✅ NEW: Pause state

  const goNext = () => {
  setCurrentIndex((prev) => (prev + 1) % slides.length);
};

const goPrev = () => {
  setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
};


  const API_URL =
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://my-blog-5hs2.onrender.com");

  useEffect(() => {
    const fetchSlides = async () => {
      const res = await fetch(`${API_URL}/api/categories`);
      const data = await res.json();
      const activeSlides = data.filter(
        (c) => c.status?.trim().toLowerCase() === "active"
      );
      setSlides(activeSlides);
    };
    fetchSlides();
  }, [API_URL]);

  // ✅ Auto Slide with Pause Support
  useEffect(() => {
    if (slides.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 2500); // change every 2.5s

    return () => clearInterval(interval);
  }, [slides, isPaused]);

  const handleImageClick = (category) => navigate(`/news/${category}`);

  if (!slides.length) return null;

  return (
    <div
      className="slideshow-container"
      onMouseEnter={() => setIsPaused(true)} // ✅ Pause on hover
      onMouseLeave={() => setIsPaused(false)} // ✅ Resume on leave
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`slide ${index === currentIndex ? "active-slide" : ""}`}
        >
          <img
            src={slide.image}
            alt={slide.caption}
            onClick={() => handleImageClick(slide.name.toLowerCase())}
          />
          <div
            className="caption-text"
            onClick={() => handleImageClick(slide.name.toLowerCase())}
          >
            {slide.caption}
          </div>
        </div>
      ))}
       {/* ✅ Arrow Buttons */}
  <button className="arrow left-arrow" onClick={goPrev}>❮</button>
<button className="arrow right-arrow" onClick={goNext}>❯</button>

    </div>
  );
};

export default Slideshow;
