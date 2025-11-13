import React from "react";
import { Routes, Route } from "react-router-dom";
import Blogs from "../pages/News/Blogs";
import BlogPost from "../pages/News/BlogPost";
import News from "../pages/News/News";
import Slideshow from "../pages/News/Slideshow";
import Trending from "../pages/News/Trending";
import Search from "../components/Search";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import EditBlog from "../pages/Admin/EditBlog";
import EditCategory from "../pages/Category/EditCategoryModal.jsx";
import EmployeeList from "../pages/Employee/EmployeeList";
import EmployeeDetails from "../pages/Employee/EmployeeDetails";
import EditEmployee from "../pages/Employee/EditEmployee";
import About from "../components/About";
import Contact from "../components/Contact";
import FeedbackList from "../pages/Admin/FeedbackList";
 import FeedbackSection from "../components/FeedbackSection";  

const AppRoutes = ({ onOpenLogin }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="page-wrapper">
            <Slideshow />
            <Trending />
            <Blogs />
            <FeedbackSection />
          </div>
        }
      />

      <Route path="/search" element={<Search />} />
      <Route path="/blog/:id" element={<BlogPost />} />
      <Route path="/news/all" element={<News category="all" />} />
      <Route path="/news/:category" element={<News />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard onLogout={onOpenLogin} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/feedback"
        element={
          <ProtectedRoute>
            <FeedbackList />
          </ProtectedRoute>
        }
      />

      <Route path="/edit-blog/:id" element={<EditBlog />} />
      <Route path="/edit-category/:id" element={<EditCategory />} />
      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/employee/:id" element={<EmployeeDetails />} />
      <Route path="/employee/edit/:id" element={<EditEmployee />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default AppRoutes;
