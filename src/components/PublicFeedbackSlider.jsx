import React, { useEffect, useState, useRef } from "react";
import "./FeedbackSlider.css";

const PublicFeedbackSlider = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null); // ✅ holds the interval ID

  const categoryLabels = {
    website: "Website Experience",
    accuracy: "News Accuracy",
    suggestion: "Article Suggestion",
    issue: "Report an Issue",
    general: "General Feedback",
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/public-feedback`)
      .then((res) => res.json())
      .then((data) => setFeedbackList(data))
      .catch((err) => console.error(err));
  }, []);

  // Start auto slide
  const startAutoSlide = () => {
    if (feedbackList.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % feedbackList.length);
      }, 3000);
    }
  };

  // Stop auto slide
  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [feedbackList]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % feedbackList.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? feedbackList.length - 1 : prev - 1));
  };

  if (feedbackList.length === 0) return <p>No feedback yet.</p>;

  const feedback = feedbackList[current];

  return (
    <div
      className="feedback-slider-container"
      onMouseEnter={stopAutoSlide} // ✅ Pause on hover
      onMouseLeave={startAutoSlide} // ✅ Resume on leave
    >
      <button className="slider-arrow left" onClick={prevSlide}>
        &lt;
      </button>

      <div className="feedback-slide">
        <div className="feedback-top-row">
          <strong>{feedback.name || "Anonymous"}</strong>
          {feedback.email && (
            <span className="feedback-email">{feedback.email}</span>
          )}
        </div>

        {feedback.category && (
          <span className="feedback-category">
            {categoryLabels[feedback.category] || feedback.category}
          </span>
        )}

        {feedback.rating > 0 && (
          <div className="feedback-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`star ${i < feedback.rating ? "active" : ""}`}
              >
                ★
              </span>
            ))}
          </div>
        )}

        <p className="feedback-message">{feedback.message}</p>
      </div>

      <button className="slider-arrow right" onClick={nextSlide}>
        &gt;
      </button>

      {feedbackList.length > 1 && (
        <div className="feedback-dots">
          {feedbackList.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === current ? "active" : ""}`}
              onClick={() => setCurrent(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicFeedbackSlider;
