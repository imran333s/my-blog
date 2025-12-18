import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EnquiryList.css";
import Loader from "../../components/Loader";

const EnquiryList = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Environment-safe API URL
  const API_URL = process.env.REACT_APP_API_URL ;

  // Scroll to top when component loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    fetchEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEnquiries = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔒 Handle missing token
      if (!token) {
        setError("Unauthorized. Please login again.");
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_URL}/api/feedback`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEnquiries(res.data || []);
      setError("");
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load enquiries"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loader
  if (loading) {
    return <Loader text="Loading enquiries..." />;
  }

  // ❌ Error state
  if (error) {
    return (
      <div className="enquiry-list">
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="enquiry-list">
      <div className="main-content">
        <h2 className="section-title">Enquiry List</h2>

        {enquiries.length === 0 ? (
          <p style={{ textAlign: "center" }}>No enquiries found.</p>
        ) : (
          <table className="admin-enquiry-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td className="message-text">{item.message}</td>
                  <td>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EnquiryList;
