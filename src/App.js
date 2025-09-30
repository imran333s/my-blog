import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import Sports from "./pages/Sports";
import Business from "./pages/Business";
import Politics from "./pages/Politics";
import Entertainment from "./pages/Entertainment";
import AdminDashboard from "./pages/AdminDashboard";
import LoginModal from "./components/LoginModal";
import EditBlog from "./pages/EditBlog";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <Router>
       
      <Navbar
        onLoginClick={() => setShowLoginModal(true)}  
      />

 
      <Routes>
        <Route path="/" element={<Blogs />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/business" element={<Business />} />
        <Route path="/politics" element={<Politics />} />
        <Route path="/entertainment" element={<Entertainment />} />
        <Route
          path="/admin/dashboard"
          element={<AdminDashboard onLogout={() => setShowLoginModal(true)} />}
        />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
      </Routes>

      {}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <Footer />
    </Router>
  );
}

export default App;
