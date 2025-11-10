import React from "react";
import PublicFeedbackForm from "./PublicFeedbackForm";
import PublicFeedbackSlider from "./PublicFeedbackSlider"; // Your slider component
import "./FeedbackSection.css";

const FeedbackSection = () => {
  return (
    <div className="feedback-section-wrapper">
      <div className="feedback-slider-area">
        <PublicFeedbackSlider />
      </div>

      <div className="feedback-form-area">
        <PublicFeedbackForm />
      </div>
    </div>
  );
};

export default FeedbackSection;
