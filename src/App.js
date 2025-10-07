import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
import Sidebar from "./components/Sidebar"; // <-- import Sidebar
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import LoginModal from "./components/LoginModal";
import EditBlog from "./pages/EditBlog";
import News from "./pages/News";
import Slideshow from "./pages/Slideshow";
function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  // Add these lines to manage sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app">
      <Router>
        <Navbar onLoginClick={() => setShowLoginModal(true)} />

        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onLoginClick={() => setShowLoginModal(true)}
        />
        <main className="main-content">
          <Routes>
            {/* ✅ Show slideshow only on home ("/") route */}
            <Route
              path="/"
              element={
                <>
                  <Slideshow />
                  <Blogs />
                </>
              }
            />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            {/* Generic category route */}
            <Route path="/news/:category" element={<News />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard onLogout={() => setShowLoginModal(true)} />
                </ProtectedRoute>
              }
            />
            <Route path="/edit-blog/:id" element={<EditBlog />} />
          </Routes>
        </main>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />

        <Footer />
      </Router>
    </div>
  );
}

export default App;
