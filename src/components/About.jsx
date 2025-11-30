import React, { useEffect, useState } from "react";
import "./About.css";

const About = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/about-settings`)
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  if (!settings) return <p>Loading About Page...</p>;

  const services = [
    {
      title: "Category-Based News",
      description:
        "Browse the latest news sorted into multiple categories like Politics, Business, Entertainment, Sports, and Technology.",
    },
    {
      title: "Personalized Feed",
      description:
        "Get news recommendations based on your interests and reading history.",
    },
    {
      title: "Collaboration & Discussion",
      description:
        "Engage with other readers, share opinions, and participate in discussions.",
    },
    {
      title: "Breaking News Alerts",
      description:
        "Receive instant notifications for breaking news and trending stories.",
    },
    {
      title: "Multimedia News",
      description:
        "Read articles, watch videos, and view images curated for each news story.",
    },
    {
      title: "Bookmark & Save",
      description:
        "Save articles to read later and create your personal news library.",
    },
  ];

  return (
    <div className="about-page">
      {/* Hero Image */}
      <section className="about-hero">
        {settings.heroBackgroundImage && (
          <img
            src={settings.heroBackgroundImage}
            alt={settings.heroTitle || "Hero Image"}
            className="hero-img"
          />
        )}
      </section>

      {/* Hero Title & Subtitle */}
      <div className="hero-content-below">
        <h1>{settings.heroTitle || "ABOUT US"}</h1>
        <p>{settings.heroSubtitle}</p>
      </div>

      {/* Two Columns: Left = Who We Are + Mission, Right = Services */}
      <section className="about-content two-columns">
        {/* Left Column: Who We Are + Mission */}
        <div className="left-column">
          <h2>Who We Are</h2>
          <p>
            News Pulse is a modern news platform that brings you the latest
            updates from multiple categories, providing a reliable and engaging
            reading experience.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to empower people with information that matters. In
            an age filled with misinformation, News Pulse stands for truth,
            transparency, and journalistic responsibility. We work every day to
            ensure our readers stay informed, aware, and ahead.
          </p>
        </div>

        {/* Right Column: Services */}
        <div className="right-column">
          <h2>Our Services</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div className="service-card" key={index}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="green">150+</h3>
            <p>Happy Readers</p>
          </div>
          <div className="stat-card">
            <h3 className="blue">500+</h3>
            <p>News Uploaded</p>
          </div>
          <div className="stat-card">
            <h3 className="purple">50+</h3>
            <p>Team Members</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
