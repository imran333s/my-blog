import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Slideshow.css";

const Slideshow = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Automatically pick backend URL: localhost for dev, Render URL for production
  const API_URL =
    process.env.REACT_APP_API_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://my-blog-5hs2.onrender.com");

  useEffect(() => {
 

    const fetchSlides = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        if (!res.ok) throw new Error("Failed to fetch slides");
        const data = await res.json();

          // 🔹 Only keep categories with status 'Active'
       const activeSlides = data.filter(
        (category) => category.status?.trim().toLowerCase() === "active"
      );

        setSlides(activeSlides);
      } catch (err) {
        console.error(err);
        setError("Unable to load slides");
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, [API_URL]);

  const nextSlide = () =>
    setCurrentIndex((prev) => (slides.length ? (prev + 1) % slides.length : 0));
  const prevSlide = () =>
    setCurrentIndex((prev) =>
      slides.length ? (prev - 1 + slides.length) % slides.length : 0
    );
  const goToSlide = (index) => setCurrentIndex(index);
  const handleImageClick = (category) => navigate(`/news/${category}`);

  if (loading) return <div>Loading slides...</div>;
  if (error) return <div>{error}</div>;
  if (!slides.length) return <div>No slides available</div>;

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
