// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const BlogList = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/blogs");

//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         setBlogs(data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
//   if (error) return <p style={{ textAlign: "center" }}>Error: {error}</p>;

//   return (
//     <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
//       <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
//         Latest Blogs
//       </h2>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
//           gap: "20px",
//         }}
//       >
//         {blogs.map((blog) => (
//           <div
//             key={blog._id}
//             style={{
//               background: "#fff",
//               borderRadius: "12px",
//               boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
//               padding: "15px",
//               transition: "transform 0.2s ease-in-out",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.transform = "translateY(-5px)")
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.transform = "translateY(0)")
//             }
//           >
//             {blog.image && (
//               <div style={{ marginBottom: "10px" }}>
//                 <img
//                   src={blog.image}
//                   alt={blog.title}
//                   style={{
//                     width: "100%",
//                     height: "auto", // keep aspect ratio
//                     maxHeight: "250px", // optional, prevents huge images
//                     objectFit: "contain", // show full image without cropping
//                     borderRadius: "8px",
//                   }}
//                 />
//               </div>
//             )}

//             <h3
//               style={{
//                 fontSize: "1.2rem",
//                 fontWeight: "600",
//                 color: "#333",
//                 marginBottom: "10px",
//               }}
//             >
//               {blog.title}
//             </h3>

//             <p
//               style={{
//                 fontSize: "0.95rem",
//                 color: "#555",
//                 marginBottom: "12px",
//                 display: "-webkit-box",
//                 WebkitLineClamp: 3,
//                 WebkitBoxOrient: "vertical",
//                 overflow: "hidden",
//               }}
//             >
//               {blog.content}
//             </p>

//             <Link
//               to={`/blog/${blog._id}`}
//               style={{
//                 textDecoration: "none",
//                 color: "#007bff",
//                 fontWeight: "500",
//               }}
//             >
//               Read More <i className="fas fa-arrow-right"></i>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BlogList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use environment variable for backend URL
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs`);

        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        }

        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [API_URL]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Latest Blogs
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {blogs.map((blog) => (
          <div
            key={blog._id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              padding: "15px",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {blog.image ? (
              <div style={{ marginBottom: "10px" }}>
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                  onError={(e) => {
                    e.target.src = "/fallback-image.png"; // fallback image if the URL fails
                  }}
                />
              </div>
            ) : (
              <div style={{ marginBottom: "10px" }}>
                <img
                  src="/fallback-image.png"
                  alt="No image"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}

            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              {blog.title}
            </h3>

            <p
              style={{
                fontSize: "0.95rem",
                color: "#555",
                marginBottom: "12px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {blog.content}
            </p>

            <Link
              to={`/blog/${blog._id}`}
              style={{
                textDecoration: "none",
                color: "#007bff",
                fontWeight: "500",
              }}
            >
              Read More <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
