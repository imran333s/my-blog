import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./DepartmentList.css";
import Loader from "../../components/Loader";
import api from "../../services/api"; // ✅ use centralized api

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [editingDept, setEditingDept] = useState(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDepts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/departments");
      setDepartments(res.data.reverse());
    } catch (err) {
      console.error("Fetch departments error:", err);
      Swal.fire("Error", "Failed to load departments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const deleteDept = async (id, name) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This department will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/api/departments/delete/${id}`);
      Swal.fire("Deleted!", `${name} removed successfully.`, "success");
      fetchDepts();
    } catch (err) {
      console.error("Delete department error:", err);
      Swal.fire("Error", "Failed to delete department", "error");
    }
  };

  const updateDept = async () => {
    if (!editName.trim()) {
      return Swal.fire("Error", "Department name cannot be empty", "error");
    }

    try {
      await api.put(`/api/departments/update/${editingDept._id}`, {
        name: editName.trim(),
      });
      Swal.fire("Updated!", "Department updated successfully.", "success");
      setEditingDept(null);
      fetchDepts();
    } catch (err) {
      console.error("Update department error:", err);
      Swal.fire("Error", "Failed to update department", "error");
    }
  };

  if (loading) {
    return <Loader text="Loading Department List..." />;
  }

  return (
    <div className="department-list">
      <main className="main-content">
        <div className="container">
          <h2 className="section-title">Department List</h2>

          {departments.length === 0 ? (
            <p>No departments found.</p>
          ) : (
            <table className="admin-dept-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Department</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((d, index) => (
                  <tr key={d._id}>
                    <td data-label="S.No">{index + 1}</td>
                    <td data-label="Department">{d.name}</td>
                    <td data-label="Actions" className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditingDept(d);
                          setEditName(d.name);
                        }}
                        title="Edit"
                      >
                        ✏️
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => deleteDept(d._id, d.name)}
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

      {editingDept && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Edit Department</h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className="modal-btn-row">
              <button onClick={updateDept} className="update-btn">
                Update
              </button>
              <button
                onClick={() => setEditingDept(null)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentList;
