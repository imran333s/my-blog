import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./DepartmentList.css"; // ✅ Import CSS

const DepartmentList = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [departments, setDepartments] = useState([]);

  const [editingDept, setEditingDept] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchDepts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/departments`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDepartments(res.data.reverse());
    } catch (err) {
      Swal.fire("Error", "Failed to load departments", "error");
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  const deleteDept = async (id) => {
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
      await axios.delete(`${API_URL}/api/departments/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      Swal.fire("Deleted!", "Department removed successfully.", "success");
      fetchDepts();
    } catch (err) {
      Swal.fire("Error", "Failed to delete", "error");
    }
  };

  const updateDept = async () => {
    try {
      await axios.put(
        `${API_URL}/api/departments/update/${editingDept._id}`,
        { name: editName },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      Swal.fire("Updated!", "Department updated successfully.", "success");
      setEditingDept(null);
      fetchDepts();
    } catch (err) {
      Swal.fire("Error", "Failed to update", "error");
    }
  };

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
                    <td>{index + 1}</td>
                    <td>{d.name}</td>
                    <td className="action-buttons">
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
                        onClick={() => deleteDept(d._id)}
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
