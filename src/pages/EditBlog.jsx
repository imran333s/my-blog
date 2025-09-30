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

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setTitle(res.data.title);
        setImage(res.data.image);
        setDescription(res.data.content);

        // Pre-fill categories (convert comma-separated to array of objects)
        if (res.data.category) {
          const catArray = res.data.category.split(",").map((c) => ({
            value: c.trim(),
            label: c.trim(),
          }));
          setCategories(catArray);
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

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

    try {
      await axios.put(`http://localhost:5000/api/blogs/${id}`, {
        title,
        image,
        content: description,
        category: categories.map((c) => c.value).join(", "),
      });

      Swal.fire({
        icon: "success",
        title: "Edited!",
        text: "Blog has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/admin-blogs");
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
    <div className="container">
      <h2 className="text-xl font-bold mb-4">Edit Blog</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input
          type="text"
          placeholder="Blog Title"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          className="border p-2 rounded"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="border p-2 rounded"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        {/* Drag & Drop Category Selector */}
        <Select
          options={categoryOptions}
          isMulti
          value={categories}
          onChange={setCategories}
          placeholder="Select categories..."
          className="text-left"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded mt-2"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
