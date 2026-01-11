import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./CategoryList.css";
import EditCategoryModal from "./EditCategoryModal";
import Loader from "../../components/Loader"; // ✅ your loader
import api from "../../services/api"; // ✅ use central api

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true); // show loader
      const res = await api.get("/api/categories/admin"); // ✅ api handles token
      setCategories(res.data.reverse());
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch categories", "error");
    } finally {
      setLoading(false); // hide loader
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
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

    try {
      await api.delete(`/api/categories/${id}`); // ✅ api handles token

      Swal.fire("Deleted!", "Category has been deleted.", "success");
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete category", "error");
    }
  };

  const handleEdit = (id) => {
    setSelectedCategory(id);
  };

  // Loader while fetching
  if (loading) return <Loader text="Loading Categories..." />;

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
                    <td data-label="S.No">{index + 1}</td>

                    <td data-label="Image">
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

                    <td data-label="Name">{cat.name}</td>

                    <td data-label="Caption">
                      {cat.caption?.length > 100
                        ? cat.caption.substring(0, 100) + "..."
                        : cat.caption}
                    </td>

                    <td data-label="Status">
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

                    <td data-label="Actions" className="action-buttons">
                      <button
                        onClick={() => handleEdit(cat._id)}
                        className="edit-btn small-btn"
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="delete-btn small-btn"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {selectedCategory && (
        <EditCategoryModal
          isOpen={true}
          categoryId={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onUpdated={fetchCategories}
        />
      )}
    </div>
  );
};

export default CategoryList;
