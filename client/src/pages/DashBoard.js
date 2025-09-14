import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [companyStats, setCompanyStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    rejected: 0,
    offer: 0
  });
  const [studyProgress, setStudyProgress] = useState({});
  const [badges, setBadges] = useState([]);
  const [newBadges, setNewBadges] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);

  // Badge images mapping - using local images from public folder
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

  // Load user data and progress from localStorage
  useEffect(() => {
    // Load user name
    const userName = localStorage.getItem('userName') || 'Guest';
    setUserName(userName);

    // Load company stats
    const savedCompanies = JSON.parse(localStorage.getItem('companies')) || [];
    const companyStats = {
      total: savedCompanies.length,
      applied: savedCompanies.filter(company => company.status === 'Applied').length,
      interview: savedCompanies.filter(company => company.status === 'Interview').length,
      rejected: savedCompanies.filter(company => company.status === 'Rejected').length,
      offer: savedCompanies.filter(company => company.status === 'Offer').length
    };
    setCompanyStats(companyStats);

    // Load study progress
    const savedStudyData = JSON.parse(localStorage.getItem('studyProgress')) || {};
    setStudyProgress(savedStudyData);

    // Load earned badges and check for new ones
    const savedBadges = JSON.parse(localStorage.getItem('earnedBadges')) || [];
    const newEarnedBadges = calculateBadges(savedStudyData, companyStats, savedBadges);
    
    // Save updated badges
    localStorage.setItem('earnedBadges', JSON.stringify(newEarnedBadges));
    setBadges(newEarnedBadges);
    
    // Check for newly earned badges to show congratulations
    const newlyEarned = newEarnedBadges.filter(newBadge => 
      !savedBadges.some(savedBadge => savedBadge.name === newBadge.name)
    );
    
    if (newlyEarned.length > 0) {
      setNewBadges(newlyEarned);
      setShowCongrats(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowCongrats(false);
      }, 5000);
    }
  }, []);

  const calculateBadges = (studyData, companyStats, existingBadges = []) => {
    const earnedBadges = [...existingBadges];
    let allSubjectsCompleted = true;

    // Study completion badges
    Object.keys(studyData).forEach(category => {
      if (studyData[category] && studyData[category].length > 0) {
        const completed = studyData[category].filter(topic => topic.completed).length;
        const total = studyData[category].length;
        const percentage = Math.round((completed / total) * 100);
        const categoryName = getCategoryName(category);

        // Check if all topics in this category are completed
        if (percentage < 100) {
          allSubjectsCompleted = false;
        }

        // DSA has 4 badge levels
        if (category === 'dsa') {
          // Bronze badge (25% completion)
          if (percentage >= 25 && !earnedBadges.some(b => b.name === 'DSA Bronze')) {
            earnedBadges.push({ 
              type: 'Bronze', 
              category: 'DSA', 
              name: 'DSA Bronze'
            });
          }

          // Silver badge (50% completion)
          if (percentage >= 50 && !earnedBadges.some(b => b.name === 'DSA Silver')) {
            earnedBadges.push({ 
              type: 'Silver', 
              category: 'DSA', 
              name: 'DSA Silver'
            });
          }

          // Gold badge (75% completion)
          if (percentage >= 75 && !earnedBadges.some(b => b.name === 'DSA Gold')) {
            earnedBadges.push({ 
              type: 'Gold', 
              category: 'DSA', 
              name: 'DSA Gold'
            });
          }

          // Completion badge (100% completion)
          if (percentage === 100 && !earnedBadges.some(b => b.name === 'DSA Completion')) {
            earnedBadges.push({ 
              type: 'Completion', 
              category: 'DSA', 
              name: 'DSA Completion'
            });
          }
        } 
        // Other subjects only have completion badges
        else {
          // Completion badge (100% completion)
          if (percentage === 100 && !earnedBadges.some(b => b.name === `${categoryName} Completion`)) {
            earnedBadges.push({ 
              type: 'Completion', 
              category: categoryName, 
              name: `${categoryName} Completion`
            });
          }
        }
      }
    });

    // Overall completion badge (all subjects completed)
    if (allSubjectsCompleted && !earnedBadges.some(b => b.name === 'All Subjects Master')) {
      earnedBadges.push({ 
        type: 'Master', 
        category: 'Overall', 
        name: 'All Subjects Master'
      });
    }

    return earnedBadges;
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

  const calculateStudyProgress = () => {
    const categories = Object.keys(studyProgress);
    if (categories.length === 0) return 0;
    
    const totalProgress = categories.reduce((sum, category) => {
      const topics = studyProgress[category];
      if (!topics || topics.length === 0) return sum;
      
      const completedCount = topics.filter(topic => topic.completed).length;
      return sum + Math.round((completedCount / topics.length) * 100);
    }, 0);
    
    return Math.round(totalProgress / categories.length);
  };

  const closeCongrats = () => {
    setShowCongrats(false);
  };

  return (
    <div className="dashboard-page">
      {/* Congratulations Popup */}
      {showCongrats && newBadges.length > 0 && (
        <div className="congrats-popup">
          <div className="congrats-content">
            <button className="close-btn" onClick={closeCongrats}>×</button>
            <div className="congrats-header">
              <h2>Congratulations! 🎉</h2>
              <p>You've earned a new badge</p>
            </div>
            <div className="badges-earned">
              {newBadges.map((badge, index) => (
                <div key={index} className="earned-badge">
                  <div className="badge-circle-large">
                    <img 
                      src={badgeImages[badge.name] || '/badges/default-badge.png'} 
                      alt={badge.name}
                      className="badge-image"
                      onError={(e) => {
                        e.target.src = '/badges/default-badge.png';
                      }}
                    />
                  </div>
                  <div className="badge-details">
                    <span className="badge-name">{badge.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="welcome-section">
        <h1>Welcome back, <span className="gradient-text">{userName}</span>! 👋</h1>
        <p>Here's your placement preparation progress overview</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card main">
          <div className="stat-icon">
            <i className="fas fa-briefcase"></i>
          </div>
          <div className="stat-info">
            <span className="stat-number">{companyStats.total}</span>
            <span className="stat-label">Total Applications</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-handshake"></i>
          </div>
          <div className="stat-info">
            <span className="stat-number">{companyStats.interview}</span>
            <span className="stat-label">Interviews</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="stat-info">
            <span className="stat-number">{companyStats.offer}</span>
            <span className="stat-label">Offers</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div className="stat-info">
            <span className="stat-number">{calculateStudyProgress()}%</span>
            <span className="stat-label">Study Progress</span>
          </div>
        </div>
      </div>

      {/* Progress Sections */}
      <div className="progress-sections">
        {/* Applications Progress */}
        <div className="progress-card">
          <h2>Applications Progress</h2>
          <div className="progress-bars">
            <div className="progress-item">
              <span>Applied</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill applied" 
                  style={{ width: companyStats.total ? `${(companyStats.applied / companyStats.total) * 100}%` : '0%' }}
                ></div>
              </div>
              <span>{companyStats.applied}</span>
            </div>
            
            <div className="progress-item">
              <span>Interviews</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill interview" 
                  style={{ width: companyStats.total ? `${(companyStats.interview / companyStats.total) * 100}%` : '0%' }}
                ></div>
              </div>
              <span>{companyStats.interview}</span>
            </div>
            
            <div className="progress-item">
              <span>Offers</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill offer" 
                  style={{ width: companyStats.total ? `${(companyStats.offer / companyStats.total) * 100}%` : '0%' }}
                ></div>
              </div>
              <span>{companyStats.offer}</span>
            </div>
          </div>
        </div>

        {/* Study Progress */}
        <div className="progress-card">
          <h2>Study Progress</h2>
          <div className="study-progress-bars">
            {Object.keys(studyProgress).map(category => {
              if (!studyProgress[category] || studyProgress[category].length === 0) return null;
              
              const completed = studyProgress[category].filter(topic => topic.completed).length;
              const total = studyProgress[category].length;
              const percentage = Math.round((completed / total) * 100);
              
              return (
                <div key={category} className="study-progress-item">
                  <div className="study-category">
                    <i className={getCategoryIcon(category)}></i>
                    <span>{getCategoryName(category)}</span>
                  </div>
                  <div className="progress-info">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill study" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="percentage">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges Section - Only Circular Badges */}
      <div className="badges-section">
        <h2>Your Achievements 🏆</h2>
        {badges.length === 0 ? (
          <div className="no-badges">
            <i className="fas fa-trophy"></i>
            <p>No badges yet. Start tracking your progress to earn badges!</p>
          </div>
        ) : (
          <div className="badges-grid-circular">
            {badges.map((badge, index) => (
              <div key={index} className="badge-circle">
                <img 
                  src={badgeImages[badge.name] || '/default.png'} 
                  alt={badge.name}
                  className="badge-image"
                  onError={(e) => {
                    e.target.src = '/badges/default-badge.png';
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn">
            <i className="fas fa-plus"></i>
            Add Company
          </button>
          <button className="action-btn">
            <i className="fas fa-book"></i>
            Study Topics
          </button>
          <button className="action-btn">
            <i className="fas fa-chart-line"></i>
            View Stats
          </button>
        </div>
      </div>
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

export default Dashboard;