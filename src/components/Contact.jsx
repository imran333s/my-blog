import React, { useState, useEffect } from "react";
import "./Contact.css";

const Contact = () => {
  const [settings, setSettings] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Fetch dynamic contact settings
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/contact-settings`)
      .then((res) => res.json())
      .then((data) => setSettings(data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Your message has been submitted. We will contact you shortly.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again later.");
    }
  };

  // Wait for settings to load
  if (!settings) return <p>Loading...</p>;

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section
  className="contact-hero"
  style={{
    backgroundImage: `url(${settings.heroBackgroundImage || "https://images.unsplash.com/photo-1522199755839-a2bacb67c546"})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>
  <div className="hero-overlay"></div>
  <div className="hero-content">
    <h1>{settings.heroTitle || "Contact Us"}</h1>
    <p>{settings.heroSubtitle || "We are always here to listen and assist."}</p>
  </div>
</section>


      <div className="contact-container">
        {/* Contact Info */}
        <section className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            We are committed to maintaining transparent and open communication.
            Whether you have a news tip, correction request, or business inquiry
            — we are here to help.
          </p>

          {/* Contact Cards */}
          <div className="contact-cards">
            <div className="contact-card">
              <h3>📰 News & Editorial</h3>
              <p>Send story tips, media, or press-related emails:</p>
              <strong>{settings.editorialEmail || "editor@example.com"}</strong>
            </div>

            <div className="contact-card">
              <h3>📣 Advertising & Partnerships</h3>
              <p>For collaborations & sponsorships:</p>
              <strong>{settings.adsEmail || "ads@example.com"}</strong>
            </div>

            <div className="contact-card">
              <h3>⚠️ Corrections</h3>
              <p>If you believe something we published is inaccurate:</p>
              <strong>
                {settings.correctionsEmail || "corrections@example.com"}
              </strong>
            </div>
          </div>

          {/* Office */}
          <div className="office-address">
            <h3>📍 Office Location</h3>
            <p>
              {settings.officeAddress || "Office address not available yet."}
            </p>
            <small>*We respond within 24–48 business hours*</small>
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <h2>Send Us a Message</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
            />

            <textarea
              name="message"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Send Message</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Contact;
