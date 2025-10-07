import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";

const categoryOptions = [
  { value: "Home", label: "Home" },
  { value: "Sports", label: "Sports" },
  { value: "Business", label: "Business" },
  { value: "Politics", label: "Politics" },
  { value: "Entertainment", label: "Entertainment" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${id}`);
        setTitle(res.data.title || "");
        setImage(res.data.image || "");
        setDescription(res.data.content || "");

        if (res.data.category) {
          const catArray = res.data.category.split(",").map((c) => ({ value: c.trim(), label: c.trim() }));
          setCategories(catArray);
        }

        if (res.data.status) {
          setStatus({ value: res.data.status, label: res.data.status });
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };
    fetchBlog();
  }, [id, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categories.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Select category",
        text: "Please select at least one category",
      });
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return Swal.fire("Error", "You are not authorized", "error");
    }
    
    try {
      await axios.put(
        `${API_URL}/api/blogs/${id}`,
        {
          title,
          image,
          content: description,
          category: categories.map((c) => c.value).join(", "),
          status: status ? status.value : "Active",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Edited!",
        text: "Blog has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Could not update blog",
      });
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "flex-start" }}
      >
        <input
          type="text"
          placeholder="Title"
          style={{ flex: "1", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          style={{ flex: "1", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
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
            container: (base) => ({ ...base, flex: "1" }),
            multiValue: (base) => ({ ...base, backgroundColor: "#007bff", color: "#fff" }),
            multiValueLabel: (base) => ({ ...base, color: "#fff" }),
          }}
        />
        <Select
          options={statusOptions}
          value={status ? statusOptions.find((s) => s.value === status.value) : null}
          onChange={setStatus}
          placeholder="Select status..."
          styles={{ container: (base) => ({ ...base, flex: "1", minWidth: "160px" }) }}
        />
        <textarea
          placeholder="Description"
          rows="2"
          style={{ flex: "1 1 100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button
          type="submit"
          style={{
            flex: "1",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "8px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
