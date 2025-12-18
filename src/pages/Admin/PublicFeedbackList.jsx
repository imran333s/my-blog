import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PublicFeedbackList.css";
import Loader from "../../components/Loader";

const PublicFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL ;
  const token = localStorage.getItem("token");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchFeedbacks = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/public-feedback`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setFeedbacks(data);
        }
      } catch (err) {
        console.error("Failed to fetch feedback:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFeedbacks();

    return () => {
      isMounted = false;
    };
  }, [API_URL, token]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <Loader />
      </div>
    );
  }

  return (
    <div className="feedback-list">
      <h2 className="section-title">Public Feedback List</h2>

      {feedbacks.length === 0 ? (
        <p className="empty-state">No feedback found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="admin-feedback-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>User</th>
                <th>Category</th>
                <th>Rating</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb, index) => (
                <tr key={fb._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="user-name">{fb.name}</div>
                    <div className="user-email">{fb.email}</div>
                  </td>
                  <td>
                    <span className="category-badge">{fb.category}</span>
                  </td>
                  <td>
                    <span className="rating-badge">⭐ {fb.rating}</span>
                  </td>
                  <td className="message-text">{fb.message}</td>
                  <td>
                    {fb.createdAt
                      ? new Date(fb.createdAt).toLocaleString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PublicFeedbackList;
