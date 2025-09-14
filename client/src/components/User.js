import React, { useState } from 'react';
import '../styles/user.css';

const User = () => {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setName('');
    setSubmitted(false);
  };

  return (
    <div className="user-welcome-container">
      <div className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            {!submitted ? (
              <>
                <h1 className="hero-title">
                  Welcome to <span className="gradient-text">Job Tracker</span>
                </h1>
                <p className="hero-description">
                  Please enter your name to get started with managing your job applications.
                </p>
                <form onSubmit={handleSubmit} className="name-form">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="name-input"
                    required
                  />
                  <button type="submit" className="btn-primary">
                    Get Started
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1 className="hero-title">
                  Welcome, <span className="gradient-text">{name}</span>!
                </h1>
                <p className="hero-description">
                  We're excited to help you track your job applications and career progress.
                </p>
                <div className="hero-actions">
                  <button className="btn-primary" onClick={() => console.log('Explore clicked')}>
                    Explore Features
                  </button>
                  <button className="btn-secondary" onClick={handleReset}>
                    Change Name
                  </button>
                </div>
                <div className="hero-stats">
                  <div className="stat">
                    <span className="stat-number">100+</span>
                    <span className="stat-label">Jobs Tracked Daily</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">85%</span>
                    <span className="stat-label">Success Rate</span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="hero-visual">
            <div className="main-visual-card">
              <div className="visual-content">
                <h3>Track Your Job Applications</h3>
                <p>Organize all your job searches in one place</p>
                <div className="visual-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <span>Application Progress</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;