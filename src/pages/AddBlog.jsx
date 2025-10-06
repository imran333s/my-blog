import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";

const categoryOptions = [
  { value: "Sports", label: "Sports" },
  { value: "Business", label: "Business" },
  { value: "Politics", label: "Politics" },
  { value: "Entertainment", label: "Entertainment" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categories.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Select category",
        text: "Please select at least one category",
      });
      return;
    }
    // ✅ Add this console.log before sending
    console.log("Submitting blog:", {
      title,
      image,
      content: description,
      category: categories.map((c) => c.value).join(", "),
      status: status.value,
    });
    try {
      await axios.post(`${API_URL}/api/blogs`, {
        title,
        image,
        content: description,
        category: categories.map((c) => c.value).join(", "),
         status: status ? status.value : "Active", // ✅ Use this instead of status.value
      });

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Blog has been added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      setTitle("");
      setImage("");
      setDescription("");
      setCategories([]);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Could not add blog",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add New Blog</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Title"
          style={{
            flex: 2,
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          style={{
            flex: 2,
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Select
          options={categoryOptions}
          isMulti
          value={categories}
          onChange={setCategories}
          placeholder="Select categories..."
          styles={{
            container: (base) => ({ ...base, flex: 2 }), // increase width
            multiValue: (base) => ({
              ...base,
              backgroundColor: "#007bff",
              color: "#fff",
            }),
            multiValueLabel: (base) => ({ ...base, color: "#fff" }),
          }}
        />

        {/* ✅ Status (larger width) */}
        <Select
  options={statusOptions}
  value={status} // directly use state
  onChange={setStatus}
  placeholder="Select status..."
  styles={{
    container: (base) => ({
      ...base,
      flex: "1",
      minWidth: "180px",
    }),
  }}
/>


        <textarea
          placeholder="Description"
          rows="2"
          style={{
            flex: 3,
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{
            flex: 1,
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "8px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
