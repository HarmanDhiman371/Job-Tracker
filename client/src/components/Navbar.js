// Navbar.js
import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-logo">
          <i className="fas fa-chart-line"></i>
          <span>PlacementTracker</span>
        </div>
        
        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="nav-item">
            <a href="/" className="nav-link">Home</a>
          </div>
          <div className="nav-item">
            <a href="companies" className="nav-link">Companies</a>
          </div>
          <div className="nav-item">
            <a href="#progress" className="nav-link">Study Progress</a>
          </div>
          <div className="nav-item">
            <a href="#resources" className="nav-link">Resources</a>
          </div>
        </div>
        
        <div className="nav-action">
          <button className="btn-primary">Get Started</button>
        </div>
        
        <div className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;