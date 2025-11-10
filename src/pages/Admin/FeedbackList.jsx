import React, { useEffect, useState } from "react";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const res = await fetch(`${API_URL}/api/feedback`);
      const data = await res.json();
      setFeedbacks(data);
    };
    fetchFeedbacks();
  }, [API_URL]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Customer Feedback</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {feedbacks.map((fb) => (
            <tr key={fb._id}>
              <td>{fb.name}</td>
              <td>{fb.email}</td>
              <td>{fb.message}</td>
              <td>{new Date(fb.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackList;
