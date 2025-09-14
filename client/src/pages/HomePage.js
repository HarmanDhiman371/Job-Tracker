// HomePage.js (updated hero section)
import React, { useState, useEffect } from 'react';
import '../styles/HomePage.css';

const HomePage = () => {
  const [progress, setProgress] = useState({
    dsa: 0,
    web: 0,
    systemDesign: 0
  });

  useEffect(() => {
    // Simulate progress animation on component mount
    const timer = setTimeout(() => {
      setProgress({
        dsa: 75,
        web: 45,
        systemDesign: 30
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="homepage">
      {/* Hero Section - Updated */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Track Your <span className="gradient-text">Placement Journey</span>
            </h1>
            <p className="hero-description">
              Monitor your progress, organize your applications, and master the skills needed to land your dream job. 
              Our platform helps you stay organized and motivated throughout your placement preparation.
            </p>
            <div className="hero-actions">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">View Demo</button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Students Placed</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Success Rate</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Partner Companies</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="main-visual-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <h3>Your Progress Overview</h3>
              </div>
              <div className="progress-item">
                <span>Profile Completion</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '85%'}}></div>
                </div>
                <span>85%</span>
              </div>
              <div className="progress-item">
                <span>Applications Ready</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '70%'}}></div>
                </div>
                <span>70%</span>
              </div>
              <div className="progress-item">
                <span>Skills Mastered</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '65%'}}></div>
                </div>
                <span>65%</span>
              </div>
              <button className="card-button">
                View Detailed Progress <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracking Section */}
      <section className="progress-section">
        <h2 className="section-title">Your Learning Progress</h2>
        <p className="section-subtitle">Track your preparation across key domains</p>
        
        <div className="progress-cards">
          <div className="progress-card">
            <div className="progress-header">
              <i className="fas fa-code"></i>
              <h3>Data Structures & Algorithms</h3>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill dsa" 
                style={{ width: `${progress.dsa}%` }}
              ></div>
            </div>
            <div className="progress-info">
              <span className="percentage">{progress.dsa}%</span>
              <span className="status">Completed</span>
            </div>
          </div>
          
          <div className="progress-card">
            <div className="progress-header">
              <i className="fas fa-laptop-code"></i>
              <h3>Web Development</h3>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill web" 
                style={{ width: `${progress.web}%` }}
              ></div>
            </div>
            <div className="progress-info">
              <span className="percentage">{progress.web}%</span>
              <span className="status">Completed</span>
            </div>
          </div>
          
          <div className="progress-card">
            <div className="progress-header">
              <i className="fas fa-project-diagram"></i>
              <h3>System Design</h3>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill system-design" 
                style={{ width: `${progress.systemDesign}%` }}
              ></div>
            </div>
            <div className="progress-info">
              <span className="percentage">{progress.systemDesign}%</span>
              <span className="status">Completed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <h2 className="section-title">Your Placement Stats</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-paper-plane"></i>
            </div>
            <div className="stat-data">
              <span className="stat-number">15</span>
              <span className="stat-label">Applications Sent</span>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-data">
              <span className="stat-number">7</span>
              <span className="stat-label">Pending Responses</span>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="stat-data">
              <span className="stat-number">4</span>
              <span className="stat-label">Interviews Scheduled</span>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="stat-data">
              <span className="stat-number">2</span>
              <span className="stat-label">Offers Received</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;