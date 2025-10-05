import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const isActiveLink = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeMobileMenu}>
          <i className="fas fa-chart-line"></i>
          <span>PlacementTracker</span>
        </Link>

        {/* Nav Menu */}
        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="nav-item">
            <Link to="/" className={`nav-link ${isActiveLink('/')}`} onClick={closeMobileMenu}>
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/companies" className={`nav-link ${isActiveLink('/companies')}`} onClick={closeMobileMenu}>
              <i className="fas fa-building"></i>
              <span>Companies</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/study" className={`nav-link ${isActiveLink('/study')}`} onClick={closeMobileMenu}>
              <i className="fas fa-book"></i>
              <span>Study Progress</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/plan" className={`nav-link ${isActiveLink('/resources')}`} onClick={closeMobileMenu}>
              <i className="fas fa-file-alt"></i>
              <span>Plan</span>
            </Link>
          </div>
          {/* ✅ Mobile Dashboard */}
          <div className="nav-item mobile-dashboard">
            <Link to="/dashboard" className={`nav-link ${isActiveLink('/dashboard')}`} onClick={closeMobileMenu}>
              <i className="fas fa-th-large"></i>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Desktop Dashboard */}
        <div className="nav-action">
          <Link to="/dashboard" className="dashboard-icon" title="Dashboard" onClick={closeMobileMenu}>
            <i className="fas fa-th-large"></i>
          </Link>
        </div>

        {/* Hamburger */}
        <div className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
