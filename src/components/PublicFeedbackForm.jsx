import React, { useState } from "react";
import "./FeedbackForm.css";

const PublicFeedbackForm = () => {
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    category: "",
    rating: 0,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleRating = (value) => {
    setFeedback({ ...feedback, rating: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/public-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback),
      });

      if (res.ok) {
        setSubmitted(true);
        setFeedback({ name: "", email: "", category: "", rating: 0, message: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (submitted) return <p>✅ Thank you for your valuable feedback!</p>;

  return (
    <div className="public-feedback-container">
      <h2>Share Your Feedback</h2>

      <form onSubmit={handleSubmit}>
        
        <input
          type="text"
          name="name"
          placeholder="Your Name (optional)"
          value={feedback.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email (optional)"
          value={feedback.email}
          onChange={handleChange}
        />

        <select
          name="category"
          value={feedback.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Feedback Type</option>
          <option value="website">Website Experience</option>
          <option value="accuracy">News Accuracy</option>
          <option value="suggestion">Article Suggestion</option>
          <option value="issue">Report an Issue</option>
          <option value="general">General Feedback</option>
        </select>

        {/* ⭐ Rating Stars */}
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRating(star)}
              className={star <= feedback.rating ? "star active" : "star"}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          name="message"
          placeholder="Write your feedback..."
          value={feedback.message}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default PublicFeedbackForm;
