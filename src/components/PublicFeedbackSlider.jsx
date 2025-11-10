import React, { useEffect, useState } from "react";
import "./FeedbackSlider.css";

const PublicFeedbackSlider = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [current, setCurrent] = useState(0);

  // ✅ Add this here
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

  useEffect(() => {
    if (feedbackList.length > 1) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % feedbackList.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [feedbackList]);

  if (feedbackList.length === 0) return <p>No feedback yet.</p>;

  const feedback = feedbackList[current];

  return (
    <div className="feedback-slider-container">
      <div className="feedback-slide">
        <div className="feedback-top-row">
          <strong className="feedback-name">
            {feedback.name || "Anonymous"}
          </strong>
          {feedback.email && (
            <span className="feedback-email">{feedback.email}</span>
          )}
        </div>

        {/* ✅ Updated Category Display */}
        {feedback.category && (
          <span className="feedback-category">
            {categoryLabels[feedback.category] || feedback.category}
          </span>
        )}

        {/* ⭐ Rating */}
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
