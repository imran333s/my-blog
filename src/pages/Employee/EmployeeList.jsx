import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./EmployeeList.css";
import EditEmployeeModal from "./EditEmployee"; // ✅ Edit Modal
import EmployeeDetails from "./EmployeeDetails"; // ✅ Slide-In Drawer

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // ✅ For slide-in drawer
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/employees`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ Open slide-in drawer for View
  const handleView = (id) => {
    setSelectedEmployeeId(id);
    setViewDrawerOpen(true);
  };

  // ✅ Open modal for Edit
  const handleEdit = (id) => {
    setSelectedEmployee(id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/api/employees/${id}`);
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Employee has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error deleting employee:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete employee.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="employee-main-content">
      <h2 className="employee-section-title">Employee List</h2>

      {employees.length === 0 ? (
        <p style={{ textAlign: "center" }}>No employees found.</p>
      ) : (
        <table className="employee-list-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>DOB</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.slice(0, 5).map((emp, index) => (
              <tr key={emp._id}>
                <td>{index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.mobile}</td>
                <td>{emp.dob?.split("T")[0]}</td>
                <td>
                  <span
                    className={`emp-status-label ${
                      emp.role?.toLowerCase() === "admin"
                        ? "emp-status-active"
                        : "emp-status-inactive"
                    }`}
                  >
                    {emp.role}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="emp-view-btn emp-small-btn"
                    onClick={() => handleView(emp._id)}
                  >
                    👁️
                  </button>
                  <button
                    className="emp-edit-btn emp-small-btn"
                    onClick={() => handleEdit(emp._id)}
                  >
                    ✏️
                  </button>
                  <button
                    className="emp-delete-btn emp-small-btn"
                    onClick={() => handleDelete(emp._id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Edit Employee Modal */}
      {modalOpen && selectedEmployee && (
        <EditEmployeeModal
          employeeId={selectedEmployee}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onUpdate={fetchEmployees}
        />
      )}

      {/* ✅ Employee Details Slide-in Drawer */}
      <EmployeeDetails
        employeeId={selectedEmployeeId}
        isOpen={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
      />
    </div>
  );
};

export default EmployeeList;
