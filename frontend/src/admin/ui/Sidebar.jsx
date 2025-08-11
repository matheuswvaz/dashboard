import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaFileAlt,
  FaListAlt,
  FaAddressCard,
  FaMapMarkedAlt,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";

// Define itens de navegação
const navItems = [
  { id: "resumo", icon: <FaHome />, label: "Resumo" },
  { id: "estatisticas", icon: <FaChartBar />, label: "Estatísticas" },
  { id: "postagens", icon: <FaFileAlt />, label: "Postagens" },
  { id: "leads", icon: <FaListAlt />, label: "Leads" },
  { id: "candidaturas", icon: <FaAddressCard />, label: "Candidaturas" },
  { id: "geolocalizacao", icon: <FaMapMarkedAlt />, label: "Geolocalização" },
  { id: "configuracoes", icon: <FaCog />, label: "Configurações" },
];

const Sidebar = ({ userData, activeSection, setActiveSection, onLogout }) => {
  const navigate = useNavigate();
  // status para colapso da sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );
  // status para mobile open/close
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Status pro dark mode
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", sidebarCollapsed);
    
    document
      .getElementById("admin-dashboard-scope")
      ?.classList.toggle("collapsed", sidebarCollapsed);
  }, [sidebarCollapsed]);

 
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document
      .getElementById("admin-dashboard-scope")
      ?.classList.toggle("dark", darkMode);
  }, [darkMode]);


  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false); 
  };

  // Toggle desktop 
  const toggleSidebar = useCallback(
    () => setSidebarCollapsed((prev) => !prev),
    []
  );

  // Toggle mobile 
  const toggleMobileMenu = useCallback(
    () => setMobileMenuOpen((prev) => !prev),
    []
  );

  // Handle logout
  const handleLogoutClick = useCallback(() => {
    onLogout(); 
    navigate("/admin-login", { replace: true });
  }, [onLogout, navigate]);

  return (
    <>
      {/* Mobile Menu Button  */}
      <button
        className="app-mobile-menu-btn"
        onClick={toggleMobileMenu}
        aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
        aria-expanded={mobileMenuOpen}
      >
        {mobileMenuOpen ? <FaTimes /> : "☰"}
      </button>

      {/* Mobile Overlay  */}
      {mobileMenuOpen && (
        <div className="app-mobile-overlay" onClick={toggleMobileMenu}></div>
      )}

      {/* Main Sidebar  */}
      <aside
        className={`app-sidebar ${sidebarCollapsed ? "collapsed" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}
        aria-label="Menu Principal"
      >
        <div className="app-sidebar-header">
          {/* Logo foi substituído por texto */}
          <div className="app-logo-link">
            {sidebarCollapsed ? (
              <h1 className="logo-icon-collapsed" style={{margin: 'auto'}}>M</h1>
            ) : (
              <h2 className="logo-full">Dashboard Matheus</h2>
            )}
          </div>
          {/* Desktop Sidebar Toggle Button */}
          <button
            className="app-sidebar-toggle desktop"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "Expandir Sidebar" : "Minimizar Sidebar"}
          >
            {sidebarCollapsed ? "»" : "«"}
          </button>
        </div>

        
        {userData && (
          <div className="app-user-profile" title={userData.email}>
            <img
              src={userData.foto_url || "/placeholder-avatar.jpg"}
              alt="Avatar"
              className="app-user-avatar-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-avatar.jpg";
              }}
            />
           
            {!sidebarCollapsed && (
              <div className="app-user-info">
                <span>{userData.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Navegação Links */}
        <nav className="app-sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`app-nav-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => handleSectionChange(item.id)}
            >
              <span>{item.icon}</span> {/* Icon */}
              {!sidebarCollapsed && item.label}{" "}
              {/* Label - escondido quando colapsado */}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer  */}
        <div className="app-sidebar-footer">
          <button
            className="app-nav-item theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title={
              darkMode ? "Alterar para Tema Claro" : "Alterar para Tema Escuro"
            }
          >
            <span>{darkMode ? <MdLightMode /> : <MdDarkMode />}</span>
            {!sidebarCollapsed && `Tema`}
          </button>
          <button
            className="app-nav-item logout-btn"
            onClick={handleLogoutClick}
            title="Sair da Dashboard"
          >
            <span>
              <FaSignOutAlt />
            </span>
            {!sidebarCollapsed && "Sair"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;