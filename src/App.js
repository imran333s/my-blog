import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Blogs from "./pages/News/Blogs";
import BlogPost from "./pages/News/BlogPost";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import LoginModal from "./components/LoginModal";
import EditBlog from "./pages/Admin/EditBlog";
import News from "./pages/News/News";
import Slideshow from "./pages/News/Slideshow";
import EditCategory from "./pages/Category/EditCategory";
import EmployeeList from "./pages/Employee/EmployeeList";
import EmployeeDetails from "./pages/Employee/EmployeeDetails";
import EditEmployee from "./pages/Employee/EditEmployee";
import Trending from "./pages/News/Trending";
// This wrapper component is inside Router so we can safely use useLocation()
function AppContent() {
  const location = useLocation(); // ✅ now safe
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app">
      {/* Navbar and Sidebar only for non-admin routes */}
      {!isAdminRoute && <Navbar onLoginClick={() => setShowLoginModal(true)} />}
      {!isAdminRoute && (
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onLoginClick={() => setShowLoginModal(true)}
        />
      )}

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Slideshow />
                <Trending />
                <Blogs />
              </>
            }
          />
          {/* <Route path="/trending" element={<Trending />} /> */}
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogPost />} />
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
          <Route path="/edit-category/:id" element={<EditCategory />} />
          <Route path="/employee/edit/:id" element={<EditEmployee />} />

          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employee/:id" element={<EmployeeDetails />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

// Wrap AppContent inside Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
