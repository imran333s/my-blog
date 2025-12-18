import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Slideshow.css";

const Slideshow = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL ;

  const goNext = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);

  const goPrev = () =>
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        const data = await res.json();

        const activeSlides = data.filter(
          (c) => c.status?.trim().toLowerCase() === "active"
        );

        setSlides(activeSlides);
      } catch (err) {
        console.error("Failed to fetch slides:", err);
      }
    };

    fetchSlides();
  }, [API_URL]);

  useEffect(() => {
    if (!slides.length || isPaused) return;

    const interval = setInterval(goNext, 2500);
    return () => clearInterval(interval);
  }, [slides, isPaused]);

  const handleImageClick = (category) =>
    navigate(`/news/${category}`);

  if (!slides.length) return null;

  return (
    <div
      className="slideshow-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide._id || index}
          className={`slide ${
            index === currentIndex ? "active-slide" : ""
          }`}
        >
          <img
            src={slide.image}
            alt={slide.caption}
            onClick={() =>
              handleImageClick(slide.name.toLowerCase())
            }
          />
          <div
            className="caption-text"
            onClick={() =>
              handleImageClick(slide.name.toLowerCase())
            }
          >
            {slide.caption}
          </div>
        </div>
      ))}

      <button className="arrow left-arrow" onClick={goPrev}>
        ❮
      </button>
      <button className="arrow right-arrow" onClick={goNext}>
        ❯
      </button>
    </div>
  );
};

export default Slideshow;
