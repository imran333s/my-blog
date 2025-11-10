import React, { useState, useEffect } from "react";

const AdminEditContactSettings = () => {
  const API = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({
    heroTitle: "",
    heroSubtitle: "",
    editorialEmail: "",
    adsEmail: "",
    correctionsEmail: "",
    officeAddress: "",
  });

  useEffect(() => {
    fetch(`${API}/api/contact-settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data) setForm(data);
      });
  }, [API]);

  const handleSave = async () => {
    await fetch(`${API}/api/contact-settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("✅ Contact Page Updated Successfully");
  };

  return (
    <div style={{ padding: 20, maxWidth: 500 }}>
      <h2>Edit Contact Page</h2>

      {[
        { name: "heroTitle", label: "Hero Title" },
        { name: "heroSubtitle", label: "Hero Subtitle" },
        { name: "editorialEmail", label: "Editorial Email" },
        { name: "adsEmail", label: "Advertising Email" },
        { name: "correctionsEmail", label: "Corrections Email" },
        { name: "officeAddress", label: "Office Address" },
          { name: "heroBackgroundImage", label: "Hero Background Image URL" }, 
      ].map(({ name, label }) => (
        <input
          key={name}
          placeholder={label}
          style={{ width: "100%", margin: "10px 0", padding: 8 }}
          value={form[name]}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        />
      ))}

      <button onClick={handleSave} style={{ padding: "8px 20px" }}>
        Save
      </button>
    </div>
  );
};

export default AdminEditContactSettings;
