 

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./CategoryList.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data.reverse());
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
        confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "You are not authorized", "error");

    try {
      await axios.delete(`${API_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Deleted!", "Category has been deleted.", "success");
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete category", "error");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-category/${id}`);
  };

  return (
    <div className="category-list">
      <main className="main-content">
        <div className="container">
          <h2 className="section-title">Category List</h2>

          {categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            <table className="admin-category-table">
              <thead>
                <tr>
                  <th>S.No</th> 
                  <th>Image</th>
                  <th>Name</th>
                  <th>Caption</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat._id}>
                    <td>{index + 1}</td> 
                    <td>
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="category-img"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{cat.name}</td>
                    <td>
                      {cat.caption?.length > 100
                        ? cat.caption.substring(0, 100) + "..."
                        : cat.caption}
                    </td>
                    <td>
                      <span
                        className={
                          cat.status?.trim().toLowerCase() === "active"
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {cat.status}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <div className="top-row">
                        <button
                          onClick={() => handleEdit(cat._id)}
                          className="edit-btn small-btn"
                          title="Edit"
                        >
                          ✏️
                        </button>
                      </div>
                      <div className="bottom-row">
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="delete-btn small-btn"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default CategoryList;
