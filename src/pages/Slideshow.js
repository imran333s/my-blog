import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Slideshow.css"; // ✅ Import the CSS file

const Slideshow = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  // Fetch slides from your backend
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch(`${API_URL}/api/categories`); // Replace with your API endpoint
        if (!response.ok) throw new Error("Failed to fetch slides");
        const data = await response.json();
        setSlides(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSlides();
  }, []);

  // const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () =>
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  const prevSlide = () =>
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  const goToSlide = (index) => setCurrentIndex(index);
  const handleImageClick = (category) => navigate(`/news/${category}`);

  return (
    <div>
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? "active-slide" : ""}`}
          >
            <img
              src={slide.image}
              alt={slide.caption}
              onClick={() =>handleImageClick(slide.name.toLowerCase())}
            />
            <div
              className="caption-text"
              onClick={() => handleImageClick(slide.name.toLowerCase())}
            >
              {slide.caption}
            </div>
          </div>
        ))}

        <span className="prev" onClick={prevSlide}>
          ❮
        </span>
        <span className="next" onClick={nextSlide}>
          ❯
        </span>
      </div>

      <div style={{ textAlign: "center" }}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active-dot" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
