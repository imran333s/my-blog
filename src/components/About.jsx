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

  return (
    <div className="about-page">
      {/* Hero Image */}
      <section className="about-hero">
        {settings?.heroBackgroundImage && (
          <img
            src={settings.heroBackgroundImage}
            alt={settings.heroTitle || "Hero Image"}
            className="hero-img"
          />
        )}
      </section>

      {/* Title & Subtitle below image */}
      <div className="hero-content-below">
        <h1>{settings?.heroTitle || "About Us"}</h1>
        <p>
          {settings?.heroSubtitle || "Learn more about our mission and vision."}
        </p>
      </div>

      {/* Main Content */}
      <section className="about-content">
        {settings?.section1Title && <h2>{settings.section1Title}</h2>}
        {settings?.section1Text && <p>{settings.section1Text}</p>}

        {settings?.section2Title && <h2>{settings.section2Title}</h2>}
        {settings?.section2Text && <p>{settings.section2Text}</p>}

        {settings?.section3Title && <h2>{settings.section3Title}</h2>}
        {settings?.section3Text && <p>{settings.section3Text}</p>}
      </section>
    </div>
  );
};

export default About;
