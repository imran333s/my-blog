import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Slideshow.css"; // ✅ Import the CSS file

const Slideshow = () => {
  const navigate = useNavigate();

  const slides = [
    {
      image:
        "https://australiansportscamps.com.au/cdn/shop/articles/Choosing-the-Best-Sports-for-Your-Kids-Development.jpg?v=1715912712",
      caption: "Sports",
      category: "sports",
    },
    {
      image:
        "https://d35y6w71vgvcg1.cloudfront.net/media/2019/05/share-market-today-share-bazar-sensex-nifty-bse-nse-stock-market-equity-market-sgx-nifty9_730X365.jpg",
      caption: "Business",
      category: "business",
    },
    {
      image: "https://static.toiimg.com/photo/124336561.cms",
      caption: "Politics",
      category: "politics",
    },
    {
      image:
        "https://img.freepik.com/free-photo/group-diverse-friends-holding-movie-emoticons_53876-65393.jpg?semt=ais_hybrid&w=740&q=80",
      caption: "Entertainment",
      category: "entertainment",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

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
              onClick={() => handleImageClick(slide.category)}
            />
            <div
              className="caption-text"
              onClick={() => handleImageClick(slide.category)}
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
