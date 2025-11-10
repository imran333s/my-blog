import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import LoginModal from "./components/LoginModal";
import AppRoutes from "./routes/AppRoutes";

function AppLayout() {
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdminPage = location.pathname.startsWith("/admin");
  // ✅ Automatically set correct top padding based on actual navbar height
  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    const mainContent = document.querySelector(".main-content");

    if (navbar && mainContent) {
      mainContent.style.paddingTop = `${navbar.offsetHeight}px`;
    }
  }, [location.pathname]);
  return (
    <div className="app-container">
      {" "}
      {/* ✅ Wrapper added to make footer stick to bottom */}
      {!isAdminPage && (
        <>
          <Navbar onLoginClick={() => setShowLoginModal(true)} />
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onLoginClick={() => setShowLoginModal(true)}
          />
        </>
      )}
      <main className="main-content">
        <div className="page-wrapper">
          <AppRoutes onOpenLogin={() => setShowLoginModal(true)} />
        </div>
      </main>
      {!isAdminPage && <Footer />}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppLayout />
    </Router>
  );
}
