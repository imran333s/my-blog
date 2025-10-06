import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ import navigation hook

const Slideshow = () => {
  const navigate = useNavigate(); // ✅ initialize navigation

  const slides = [
    {
      image:
        "https://australiansportscamps.com.au/cdn/shop/articles/Choosing-the-Best-Sports-for-Your-Kids-Development.jpg?v=1715912712",
      caption: "Sports",
    },
    {
      image:
        "https://d35y6w71vgvcg1.cloudfront.net/media/2019/05/share-market-today-share-bazar-sensex-nifty-bse-nse-stock-market-equity-market-sgx-nifty9_730X365.jpg",
      caption: "Business",
    },
    {
      image: "https://static.toiimg.com/photo/124336561.cms",
      caption: "Politics",
    },
    {
      image:
        "https://img.freepik.com/free-photo/group-diverse-friends-holding-movie-emoticons_53876-65393.jpg?semt=ais_hybrid&w=740&q=80",
      caption: "Entertainment",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // ✅ Navigate to corresponding category when image clicked
  const handleImageClick = (category) => {
    navigate(`/news/${category}`);
  };

  const styles = {
    slideshowContainer: {
      width: "100%",
      height: "100vh",
      position: "relative",
      margin: "auto",
      overflow: "hidden",
    },
    slide: {
      display: "none",
      animationName: "fade",
      animationDuration: "1.5s",
      position: "relative",
    },
    activeSlide: {
      display: "block",
      animationName: "fade",
      animationDuration: "1.5s",
      position: "relative",
    },
    numberText: {
      color: "#f2f2f2",
      fontSize: "12px",
      padding: "8px 12px",
      position: "absolute",
      top: 0,
    },
    captionText: {
      color: "#fff",
      fontSize: "20px",
      padding: "8px 12px",
      position: "absolute",
      bottom: "20px",
      width: "100%",
      textAlign: "center",
      backgroundColor: "rgba(0,0,0,0.4)",
      cursor: "pointer", // make caption clickable too
    },
    prevNext: {
      cursor: "pointer",
      position: "absolute",
      top: "50%",
      width: "auto",
      padding: "16px",
      marginTop: "-22px",
      color: "white",
      fontWeight: "bold",
      fontSize: "18px",
      transition: "0.6s ease",
      borderRadius: "0 3px 3px 0",
      userSelect: "none",
    },
    next: { right: 0, borderRadius: "3px 0 0 3px" },
    dot: {
      cursor: "pointer",
      height: "12px",
      width: "12px",
      margin: "0 2px",
      backgroundColor: "#bbb",
      borderRadius: "50%",
      display: "inline-block",
      transition: "background-color 0.6s ease",
    },
    activeDot: { backgroundColor: "#717171" },
    img: {
      width: "100%",
      height: "100vh",
      objectFit: "cover",
      cursor: "pointer", // ✅ make the image clickable
    },
  };

  return (
    <div>
      <div style={{ ...styles.slideshowContainer }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={index === currentIndex ? styles.activeSlide : styles.slide}
          >
            <div style={styles.numberText}>
              {index + 1} / {slides.length}
            </div>

            {/* ✅ Clickable image */}
            <img
              src={slide.image}
              alt={slide.caption}
              style={styles.img}
              onClick={() => handleImageClick(slide.caption)}
            />

            {/* ✅ Clickable caption */}
            <div
              style={styles.captionText}
              onClick={() => handleImageClick(slide.caption)}
            >
              {slide.caption}
            </div>
          </div>
        ))}

        <a style={styles.prevNext} onClick={prevSlide}>
          ❮
        </a>
        <a style={{ ...styles.prevNext, ...styles.next }} onClick={nextSlide}>
          ❯
        </a>
      </div>

      <br />

      <div style={{ textAlign: "center" }}>
        {slides.map((_, index) => (
          <span
            key={index}
            style={
              index === currentIndex
                ? { ...styles.dot, ...styles.activeDot }
                : styles.dot
            }
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>

      <style>{`@keyframes fade { from {opacity: 0.4} to {opacity: 1} }`}</style>
    </div>
  );
};



export default Slideshow;
