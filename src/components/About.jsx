import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>About NewsPulse</h1>
          <p>Reliable. Unbiased. Real-Time News Coverage.</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="about-container">

        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            NewsPulse is an independent digital news platform delivering trusted
            and timely news updates from around the world. We aim to cut through 
            the noise, misinformation, and bias that dominate today’s media environment.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to <strong>empower people with accurate information</strong>.
            We are committed to transparency, integrity, and clarity — because
            informed people make stronger societies.
          </p>
        </section>

        <section className="about-section">
          <h2>What Makes Us Different</h2>
          <div className="features-grid">
            <div className="feature-card">No clickbait or sensationalism</div>
            <div className="feature-card">Verified news from official sources</div>
            <div className="feature-card">Human-written, authentic reporting</div>
            <div className="feature-card">Independent & unbiased coverage</div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Vision</h2>
          <p>
            In a world overwhelmed with misleading narratives, we stand for truth.
            Our vision is to build a smarter, more aware media culture where facts
            always take the lead.
          </p>
        </section>

        <section className="about-section">
          <h2>Thank You for Being Here</h2>
          <p>
            We are constantly improving, expanding our network and storytelling approach.
            Thank you for choosing NewsPulse as your trusted source of news.
          </p>
          <p className="signature">— Team NewsPulse</p>
        </section>

      </div>

    </div>
  );
};

export default About;
