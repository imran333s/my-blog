import React, { useState, useEffect } from "react";

const AdminEditAboutSettings = () => {
  const API = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    heroBackgroundImage: "",
    heroTitle: "",
    heroSubtitle: "",
    section1Title: "",
    section1Text: "",
    section2Title: "",
    section2Text: "",
    section3Title: "",
    section3Text: "",
  });

  useEffect(() => {
    fetch(`${API}/api/about-settings`)
      .then((res) => res.json())
      .then((data) => setForm(data));
  }, [API]);

  const handleSave = async () => {
    await fetch(`${API}/api/about-settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert("✅ About Page Updated Successfully");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // List of section fields to render dynamically
  const sectionFields = Object.keys(form).filter(
    (field) =>
      !["heroBackgroundImage", "heroTitle", "heroSubtitle"].includes(field)
  );

  return (
    <div style={{ padding: 2, maxWidth: 600, margin: "auto" }}>
      <h2>Edit About Page</h2>

      {/* Hero Section Fields on top */}
      <h3>Hero Section</h3>
      <input
        type="text"
        name="heroBackgroundImage"
        placeholder="Hero Background Image URL"
        value={form.heroBackgroundImage}
        onChange={handleChange}
        style={{ width: "100%", margin: "10px 0", padding: 8 }}
      />
      <input
        type="text"
        name="heroTitle"
        placeholder="Hero Title"
        value={form.heroTitle}
        onChange={handleChange}
        style={{ width: "100%", margin: "10px 0", padding: 8 }}
      />
      <textarea
        name="heroSubtitle"
        placeholder="Hero Subtitle"
        value={form.heroSubtitle}
        onChange={handleChange}
        rows={3}
        style={{ width: "100%", margin: "10px 0", padding: 8 }}
      />

      {/* Section Fields */}
      {sectionFields.map((field) =>
        field.includes("Text") ? (
          <textarea
            key={field}
            name={field}
            rows={5}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            style={{ width: "100%", margin: "10px 0", padding: 8 }}
          />
        ) : (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
            style={{ width: "100%", margin: "10px 0", padding: 8 }}
          />
        )
      )}

      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          marginTop: 20,
          background: "#35b312ff",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Save
      </button>
    </div>
  );
};

export default AdminEditAboutSettings;
