import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // ✅ ADD THIS
import "./Contact.css";
import Loader from "../components/Loader"; // adjust path if needed

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          title: "Message Sent! 🚀",
          text: "Your message has been sent successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });

        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        Swal.fire({
          title: "Failed!",
          text: "Error sending message. Please try again.",
          icon: "error",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Server Error!",
        text: "Something went wrong. Please try later.",
        icon: "error",
      });
    }
  };
  if (!settings) return <Loader text="Loading About Page..." />;

  return (
    <div className="contact-page">
      {/* Hero */}
      <section
        className="contact-hero"
        style={{
          backgroundImage: `url(${settings.heroBackgroundImage || "https://images.unsplash.com/photo-1522199755839-a2bacb67c546"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{settings.heroTitle || "Get In Touch"}</h1>
          <p>
            {settings.heroSubtitle ||
              "We’d love to hear from you. Let's collaborate!"}
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="contact-intro">
        <h2>Contact & Collaboration</h2>
        <p>Have questions or want to discuss ? We'd love to hear from you.</p>
      </section>

      {/* Two-column layout */}
      <div className="contact-container">
        {/* Left: Contact Form */}
        <div className="contact-left">
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
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Send Message</button>
          </form>
        </div>

        {/* Right: Contact Info */}
        <div className="contact-right">
          <h2>Contact Information</h2>

          {/* Office */}
          <div className="contact-info-card">
            <h3>📍 Our Office</h3>
            <p>
              F-201, Sector 63,
              <br />
              Noida-201301, India
            </p>
          </div>

          {/* Phone */}
          <div className="contact-info-card">
            <h3>📞 Phone</h3>
            <p>
              +91 7362043095 (Office)
              <br />
              (Mon–Fri, 9 AM–6 PM)
            </p>
          </div>

          {/* Email */}
          <div className="contact-info-card">
            <h3>✉️ Email</h3>
            <p>hr@newsPulse.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
