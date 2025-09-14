import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState({
    dsa: 0,
    fullstack: 0,
    os: 0,
    cn: 0,
    cloud: 0
  });

  const [companyStats, setCompanyStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    rejected: 0,
    offer: 0
  });

  const [activeBadges, setActiveBadges] = useState([]);

  // Load company stats and study progress from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        // Load company stats
        const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
        
        const stats = {
          total: savedCompanies.length,
          applied: savedCompanies.filter(company => company.status === 'Applied').length,
          interview: savedCompanies.filter(company => company.status === 'Interview').length,
          rejected: savedCompanies.filter(company => company.status === 'Rejected').length,
          offer: savedCompanies.filter(company => company.status === 'Offer').length
        };
        
        setCompanyStats(stats);

        // Load study progress
        const savedStudyData = JSON.parse(localStorage.getItem('studyProgress')) || {};
        
        // Calculate progress percentages for each category
        const newProgress = {};
        Object.keys(savedStudyData).forEach(category => {
          if (savedStudyData[category] && savedStudyData[category].length > 0) {
            const completed = savedStudyData[category].filter(topic => topic.completed).length;
            const total = savedStudyData[category].length;
            newProgress[category] = Math.round((completed / total) * 100);
          } else {
            newProgress[category] = 0;
          }
        });
        
        setProgress(newProgress);

        // Load active badges (only show completion badges except for DSA which has multiple levels)
        const savedBadges = JSON.parse(localStorage.getItem('earnedBadges')) || [];
        
        // Filter to show only relevant badges (completion badges for all subjects, plus DSA progression badges)
        const relevantBadges = savedBadges.filter(badge => {
          // Keep all DSA badges
          if (badge.category === 'DSA') return true;
          
          // For other subjects, only keep completion badges
          if (badge.name.includes('Completion')) return true;
          
          // Keep the "All Subjects Master" badge
          if (badge.name === 'All Subjects Master') return true;
          
          return false;
        });
        
        setActiveBadges(relevantBadges.slice(-3)); // Show only 3 most recent relevant badges

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    // Load data initially
    loadData();

    // Listen for updates
    const handleDataUpdate = () => {
      loadData();
    };
    
    window.addEventListener('companiesUpdated', handleDataUpdate);
    window.addEventListener('studyProgressUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('companiesUpdated', handleDataUpdate);
      window.removeEventListener('studyProgressUpdated', handleDataUpdate);
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/companies');
  };

  const handleViewProgress = () => {
    navigate('/study');
  };

  // Badge images mapping - Only DSA has multiple levels, others only have completion badges
   const badgeImages = {
    // DSA badges (4 levels)
    'DSA Bronze': '/dsa-bronze.png',
    'DSA Silver': '/ds-silver.png',
    'DSA Gold': '/dsa-gold.png',
    'DSA Completion': '/ds.png',
    
    // Other subjects - only completion badges
    'Full Stack Completion': '/fs.png',
    'OS Completion': '/full-stack.png',
    'Networking Completion': '/cn.png',
    'Cloud Completion': '/full-stack.png',
    
    // Overall completion badge
    'All Subjects Master': '/full-stack.png'
  };

  // Function to get the appropriate badge name based on progress
  const getBadgeForProgress = (category, progressValue) => {
    if (category === 'dsa') {
      if (progressValue >= 100) return 'DSA Completion';
      if (progressValue >= 75) return 'DSA Gold';
      if (progressValue >= 50) return 'DSA Silver';
      if (progressValue >= 25) return 'DSA Bronze';
      return null;
    } else {
      // Other subjects only show completion badge at 100%
      if (progressValue >= 100) {
        const categoryName = getCategoryName(category);
        return `${categoryName} Completion`;
      }
      return null;
    }
  };

  const getCategoryName = (category) => {
    switch(category) {
      case 'dsa': return 'DSA';
      case 'fullstack': return 'Full Stack';
      case 'os': return 'OS';
      case 'cn': return 'Networking';
      case 'cloud': return 'Cloud';
      default: return category;
    }
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
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
              <button className="btn-primary" onClick={handleGetStarted}>Get Started</button>
              <button className="btn-secondary" onClick={handleViewProgress}>View Progress</button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">{companyStats.total}</span>
                <span className="stat-label">Total Applications</span>
              </div>
              <div className="stat">
                <span className="stat-number">{companyStats.interview}</span>
                <span className="stat-label">Interviews</span>
              </div>
              <div className="stat">
                <span className="stat-number">{companyStats.offer}</span>
                <span className="stat-label">Offers Received</span>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="main-visual-card">
              <div className="card-header">
                <div className="card-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <h3>Application Status</h3>
              </div>
              <div className="progress-item">
                <span>Applied</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: companyStats.total ? `${(companyStats.applied / companyStats.total) * 100}%` : '0%'}}
                  ></div>
                </div>
                <span>{companyStats.applied}</span>
              </div>
              <div className="progress-item">
                <span>Interview</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill interview" 
                    style={{width: companyStats.total ? `${(companyStats.interview / companyStats.total) * 100}%` : '0%'}}
                  ></div>
                </div>
                <span>{companyStats.interview}</span>
              </div>
              <div className="progress-item">
                <span>Offer</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill offer" 
                    style={{width: companyStats.total ? `${(companyStats.offer / companyStats.total) * 100}%` : '0%'}}
                  ></div>
                </div>
                <span>{companyStats.offer}</span>
              </div>
              <div className="progress-item">
                <span>Rejected</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill rejected" 
                    style={{width: companyStats.total ? `${(companyStats.rejected / companyStats.total) * 100}%` : '0%'}}
                  ></div>
                </div>
                <span>{companyStats.rejected}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Tracking Section */}
      <section className="progress-section">
        <h2 className="section-title">Your Learning Progress</h2>
        <p className="section-subtitle">Track your preparation across key domains</p>
        
        <div className="progress-cards">
          {Object.keys(progress).map(category => {
            const progressValue = progress[category];
            const badgeName = getBadgeForProgress(category, progressValue);
            const categoryName = getCategoryName(category);
            
            return (
              <div key={category} className="progress-card">
                <div className="progress-header">
                  <i className={getCategoryIcon(category)}></i>
                  <h3>{categoryName}</h3>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${category}`} 
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
                <div className="progress-info">
                  <span className="percentage">{progressValue}%</span>
                  <span className="status">Completed</span>
                </div>
                {badgeName && (
                  <div className="progress-badge">
                    <img 
                      src={badgeImages[badgeName] || '/badges/default-badge.png'} 
                      alt={badgeName}
                      className="badge-mini"
                      onError={(e) => {
                        e.target.src = '/badges/default-badge.png';
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
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
              <span className="stat-number">{companyStats.applied}</span>
              <span className="stat-label">Applications Sent</span>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-data">
              <span className="stat-number">{companyStats.applied - companyStats.interview - companyStats.rejected - companyStats.offer}</span>
              <span className="stat-label">Pending Responses</span>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="stat-data">
              <span className="stat-number">{companyStats.interview}</span>
              <span className="stat-label">Interviews Scheduled</span>
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="stat-data">
              <span className="stat-number">{companyStats.offer}</span>
              <span className="stat-label">Offers Received</span>
            </div>
          </div>
        </div>
      </section>

      {/* Active Badges Section */}
      {activeBadges.length > 0 && (
        <section className="badges-section">
          <h2 className="section-title">Your Recent Achievements</h2>
          <p className="section-subtitle">Badges earned through your progress</p>
          
          <div className="badges-grid">
            {activeBadges.map((badge, index) => (
              <div key={index} className="badge-item">
                <div className="badge-circle">
                  <img 
                    src={badgeImages[badge.name] || '/default.png'} 
                    alt={badge.name}
                    className="badge-image"
                    onError={(e) => {
                      e.target.src = '/default.png';
                    }}
                  />
                </div>
                <span className="badge-name">{badge.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// Helper function to get category icon
const getCategoryIcon = (category) => {
  switch(category) {
    case 'dsa': return 'fas fa-code';
    case 'fullstack': return 'fas fa-laptop-code';
    case 'os': return 'fas fa-desktop';
    case 'cn': return 'fas fa-network-wired';
    case 'cloud': return 'fas fa-cloud';
    default: return 'fas fa-book';
  }
};

export default HomePage;