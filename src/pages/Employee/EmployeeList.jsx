import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../services/api"; // ✅ centralized api
import EditEmployeeModal from "./EditEmployee";
import EmployeeDetails from "./EmployeeDetails";
import Loader from "../../components/Loader";
import "./EmployeeList.css";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/users");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleView = (id) => {
    setSelectedEmployeeId(id);
    setViewDrawerOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedEmployee(id);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This employee will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/users/${id}`);
        setEmployees((prev) => prev.filter((emp) => emp._id !== id));
        Swal.fire({
          title: "Deleted!",
          text: "Employee record successfully removed.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error deleting employee:", err);
        Swal.fire({
          title: "Error",
          text: "Could not delete employee",
          icon: "error",
        });
      }
    }
  };

  if (loading) return <Loader text="Loading Employees..." />;

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
            {employees.map((emp, index) => (
              <tr key={emp._id}>
                <td data-label="S.No">{index + 1}</td>
                <td data-label="Name">{emp.name}</td>
                <td data-label="Email">{emp.email}</td>
                <td data-label="Mobile">{emp.mobile}</td>
                <td data-label="DOB">{emp.dob?.split("T")[0] || "N/A"}</td>
                <td data-label="Role">
                  <span
                    className={`emp-status-label ${
                      emp.role === "admin"
                        ? "emp-status-admin"
                        : emp.role === "manager"
                        ? "emp-status-manager"
                        : "emp-status-employee"
                    }`}
                  >
                    {emp.role}
                  </span>
                </td>
                <td data-label="Actions" className="actions-cell">
                  <button className="emp-view-btn emp-small-btn" onClick={() => handleView(emp._id)}>👁️</button>
                  <button className="emp-edit-btn emp-small-btn" onClick={() => handleEdit(emp._id)}>✏️</button>
                  <button className="emp-delete-btn emp-small-btn" onClick={() => handleDelete(emp._id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && selectedEmployee && (
        <EditEmployeeModal
          employeeId={selectedEmployee}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onUpdate={fetchEmployees}
        />
      )}

      <EmployeeDetails
        employeeId={selectedEmployeeId}
        isOpen={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
      />
    </div>
  );
};

export default EmployeeList;
