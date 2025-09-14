// Footer.js
import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <i className="fas fa-chart-line"></i>
              <span>PlacementTracker</span>
            </div>
            <p className="footer-description">
              Track your placement journey and maximize your chances of landing your dream job.
            </p>
            <div className="footer-social">
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-title">Product</h3>
              <ul className="footer-list">
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Updates</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-title">Company</h3>
              <ul className="footer-list">
                <li><a href="#">About</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3 className="footer-title">Resources</h3>
              <ul className="footer-list">
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Tutorials</a></li>
                <li><a href="#">Support</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2023 PlacementTracker. All rights reserved.</p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;