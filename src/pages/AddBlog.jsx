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

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
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

    try {
      await axios.post(`${API_URL}/api/blogs`,{
        title,
        image,
        content: description,
        category: categories.map((c) => c.value).join(", "), // save as comma-separated
      });

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Blog has been added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
        <input
          type="text"
          placeholder="Enter Blog Title"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Eneter Image URL"
          className="border p-2 rounded"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <textarea
          placeholder="Write Description"
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
          className="bg-green-500 text-white py-2 rounded mt-2"
        >
          Add Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
