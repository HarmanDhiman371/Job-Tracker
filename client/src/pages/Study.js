import React, { useState, useEffect } from 'react';
import '../styles/study.css';

const StudyProgress = () => {
  const [activeCategory, setActiveCategory] = useState('dsa');
  const [studyData, setStudyData] = useState({
    dsa: [],
    fullstack: [],
    os: [],
    cn: [],
    cloud: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Study categories data
  const studyCategories = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      icon: 'fas fa-code',
      color: '#4361ee',
      badge: '/dsa-bronze.png'
    },
    {
      id: 'fullstack',
      title: 'Full Stack Development',
      icon: 'fas fa-laptop-code',
      color: '#f72585',
      badge: '/full-stack.png'
    },
    {
      id: 'os',
      title: 'Operating Systems',
      icon: 'fas fa-desktop',
      color: '#7209b7',
      badge: '/badges/os-badge.png'
    },
    {
      id: 'cn',
      title: 'Computer Networks',
      icon: 'fas fa-network-wired',
      color: '#3a0ca3',
      badge: '/badges/cn-badge.png'
    },
    {
      id: 'cloud',
      title: 'Cloud Computing',
      icon: 'fas fa-cloud',
      color: '#4cc9f0',
      badge: '/badges/cloud-badge.png'
    }
  ];

  // Initial data structure
  const initialData = {
    dsa: [
      { id: 1, name: 'Arrays', completed: false },
      { id: 2, name: 'Strings', completed: false },
      { id: 3, name: 'Linked Lists', completed: false },
      { id: 4, name: 'Stacks & Queues', completed: false },
      { id: 5, name: 'Trees', completed: false },
      { id: 6, name: 'Graphs', completed: false },
      { id: 7, name: 'Hash Tables', completed: false },
      { id: 8, name: 'Recursion', completed: false },
      { id: 9, name: 'Sorting Algorithms', completed: false },
      { id: 10, name: 'Searching Algorithms', completed: false },
      { id: 11, name: 'Dynamic Programming', completed: false },
      { id: 12, name: 'Greedy Algorithms', completed: false }
    ],
    fullstack: [
      { id: 1, name: 'HTML & CSS', completed: false },
      { id: 2, name: 'JavaScript Fundamentals', completed: false },
      { id: 3, name: 'React.js', completed: false },
      { id: 4, name: 'Node.js', completed: false },
      { id: 5, name: 'Express.js', completed: false },
      { id: 6, name: 'RESTful APIs', completed: false },
      { id: 7, name: 'Database Design', completed: false },
      { id: 8, name: 'SQL', completed: false },
      { id: 9, name: 'NoSQL', completed: false },
      { id: 10, name: 'Authentication & Authorization', completed: false },
      { id: 11, name: 'Web Security', completed: false },
      { id: 12, name: 'Deployment', completed: false }
    ],
    os: [
      { id: 1, name: 'Process Management', completed: false },
      { id: 2, name: 'Threads & Concurrency', completed: false },
      { id: 3, name: 'CPU Scheduling', completed: false },
      { id: 4, name: 'Memory Management', completed: false },
      { id: 5, name: 'Virtual Memory', completed: false },
      { id: 6, name: 'File Systems', completed: false },
      { id: 7, name: 'I/O Systems', completed: false },
      { id: 8, name: 'Deadlocks', completed: false },
      { id: 9, name: 'Inter-process Communication', completed: false },
      { id: 10, name: 'OS Security', completed: false }
    ],
    cn: [
      { id: 1, name: 'Network Models', completed: false },
      { id: 2, name: 'TCP/IP Protocol', completed: false },
      { id: 3, name: 'HTTP/HTTPS', completed: false },
      { id: 4, name: 'DNS', completed: false },
      { id: 5, name: 'Routing Algorithms', completed: false },
      { id: 6, name: 'Network Security', completed: false },
      { id: 7, name: 'Socket Programming', completed: false },
      { id: 8, name: 'Wireless Networks', completed: false },
      { id: 9, name: 'Network Troubleshooting', completed: false },
      { id: 10, name: 'Cloud Networking', completed: false }
    ],
    cloud: [
      { id: 1, name: 'Cloud Service Models', completed: false },
      { id: 2, name: 'AWS Fundamentals', completed: false },
      { id: 3, name: 'Azure Fundamentals', completed: false },
      { id: 4, name: 'GCP Fundamentals', completed: false },
      { id: 5, name: 'Containerization', completed: false },
      { id: 6, name: 'Docker', completed: false },
      { id: 7, name: 'Kubernetes', completed: false },
      { id: 8, name: 'Serverless Architecture', completed: false },
      { id: 9, name: 'Cloud Security', completed: false },
      { id: 10, name: 'Cloud Deployment', completed: false }
    ]
  };

  // Initialize study data
  useEffect(() => {
    const savedStudyData = localStorage.getItem('studyProgress');
    const savedActiveCategory = localStorage.getItem('activeStudyCategory');
    
    if (savedActiveCategory) {
      setActiveCategory(savedActiveCategory);
    }
    
    if (savedStudyData) {
      try {
        const parsedData = JSON.parse(savedStudyData);
        setStudyData(parsedData);
      } catch (error) {
        console.error("Error parsing saved study data:", error);
        // If there's an error parsing, use initial data
        setStudyData(initialData);
      }
    } else {
      // If no saved data exists, use initial data
      setStudyData(initialData);
    }
    
    setIsLoading(false);
  }, []);

  // Save study progress to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('studyProgress', JSON.stringify(studyData));
      localStorage.setItem('activeStudyCategory', activeCategory);
    }
  }, [studyData, activeCategory, isLoading]);

  const markTopicCompleted = (category, topicId) => {
    setStudyData(prevData => {
      const updatedData = { ...prevData };
      const topicIndex = updatedData[category].findIndex(topic => topic.id === topicId);
      
      if (topicIndex !== -1) {
        updatedData[category][topicIndex] = {
          ...updatedData[category][topicIndex],
          completed: true
        };
      }
      
      return updatedData;
    });
  };

  const markTopicIncomplete = (category, topicId) => {
    setStudyData(prevData => {
      const updatedData = { ...prevData };
      const topicIndex = updatedData[category].findIndex(topic => topic.id === topicId);
      
      if (topicIndex !== -1) {
        updatedData[category][topicIndex] = {
          ...updatedData[category][topicIndex],
          completed: false
        };
      }
      
      return updatedData;
    });
  };

  const calculateProgress = (category) => {
    const topics = studyData[category];
    if (!topics || topics.length === 0) return 0;
    
    const completedCount = topics.filter(topic => topic.completed).length;
    return Math.round((completedCount / topics.length) * 100);
  };

  const calculateOverallProgress = () => {
    const categories = Object.keys(studyData);
    if (categories.length === 0) return 0;
    
    const totalProgress = categories.reduce((sum, category) => {
      return sum + calculateProgress(category);
    }, 0);
    
    return Math.round(totalProgress / categories.length);
  };

  const getCompletedCount = (category) => {
    const topics = studyData[category];
    if (!topics) return 0;
    return topics.filter(topic => topic.completed).length;
  };

  const isCategoryCompleted = (category) => {
    return calculateProgress(category) === 100;
  };

  // Function to reset all progress
  const resetAllProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      setStudyData(initialData);
    }
  };

  // Function to export progress data
  const exportProgress = () => {
    const dataStr = JSON.stringify(studyData);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'study-progress-backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Function to import progress data
  const importProgress = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    
    fileReader.onload = e => {
      try {
        const importedData = JSON.parse(e.target.result);
        setStudyData(importedData);
        alert('Progress imported successfully!');
      } catch (error) {
        alert('Error importing progress: Invalid file format');
      }
    };
    
    fileReader.onerror = () => {
      alert('Error reading file');
    };
    
    // Reset the file input
    event.target.value = null;
  };

  if (isLoading) {
    return <div className="loading">Loading your study progress...</div>;
  }

  return (
    <div className="study-progress-page">
      <div className="study-header">
        <h1>Study Progress Tracker</h1>
        <p>Track your learning progress across different domains</p>
        
        <div className="data-management">
          <button className="btn-secondary" onClick={exportProgress}>
            <i className="fas fa-download"></i> Export Progress
          </button>
          <label className="btn-secondary">
            <i className="fas fa-upload"></i> Import Progress
            <input 
              type="file" 
              accept=".json" 
              onChange={importProgress} 
              style={{ display: 'none' }} 
            />
          </label>
          <button className="btn-danger" onClick={resetAllProgress}>
            <i className="fas fa-trash"></i> Reset All
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="overall-progress">
        <div className="progress-card">
          <h2>Overall Progress</h2>
          <div className="progress-circle">
            <div className="circle-bg">
              <div 
                className="circle-progress" 
                style={{ 
                  background: `conic-gradient(#4361ee ${calculateOverallProgress() * 3.6}deg, #e9ecef 0deg)` 
                }}
              ></div>
              <div className="progress-text">
                <span className="percentage">{calculateOverallProgress()}%</span>
                <span className="label">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        {studyCategories.map(category => (
          <button
            key={category.id}
            className={`tab-button ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
            style={{ 
              borderBottomColor: activeCategory === category.id ? category.color : 'transparent' 
            }}
          >
            <i className={category.icon}></i>
            <span>{category.title}</span>
            {isCategoryCompleted(category.id) && (
              <span className="badge-indicator">🏆</span>
            )}
          </button>
        ))}
      </div>

      {/* Category Content */}
      <div className="category-content">
        {studyCategories.map(category => (
          <div 
            key={category.id} 
            className={`category-panel ${activeCategory === category.id ? 'active' : ''}`}
          >
            <div className="category-header">
              <div className="category-info">
                <div className="category-icon" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                  <i className={category.icon}></i>
                </div>
                <div>
                  <h2>{category.title}</h2>
                  <p>
                    {getCompletedCount(category.id)} of {studyData[category.id]?.length || 0} topics completed
                  </p>
                </div>
              </div>
              
              <div className="category-progress">
                {isCategoryCompleted(category.id) ? (
                  <div className="category-badge">
                    <img src={category.badge} alt={`${category.title} Badge`} />
                    <span>Completed! 🎉</span>
                  </div>
                ) : (
                  <>
                    <span className="progress-percentage">{calculateProgress(category.id)}%</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${calculateProgress(category.id)}%`,
                          backgroundColor: category.color
                        }}
                      ></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Topics List - Single Column */}
            <div className="topics-list-single">
              {studyData[category.id]?.map(topic => (
                <div 
                  key={topic.id} 
                  className={`topic-item ${topic.completed ? 'completed' : ''}`}
                >
                  <div className="topic-content">
                    <span className="topic-name">{topic.name}</span>
                    {topic.completed ? (
                      <button 
                        className="done-btn completed"
                        onClick={() => markTopicIncomplete(category.id, topic.id)}
                      >
                        <i className="fas fa-check"></i>
                        Completed
                      </button>
                    ) : (
                      <button 
                        className="done-btn"
                        onClick={() => markTopicCompleted(category.id, topic.id)}
                      >
                        Mark as Done
                      </button>
                    )}
                  </div>
                  
                  {topic.completed && (
                    <div className="completion-status">
                      <i className="fas fa-check-circle"></i>
                      Completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <h2>Progress Overview</h2>
        <div className="stats-grid">
          {studyCategories.map(category => (
            <div key={category.id} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                <i className={category.icon}></i>
              </div>
              <div className="stat-info">
                <span className="stat-percentage">{calculateProgress(category.id)}%</span>
                <span className="stat-label">{category.title}</span>
                {isCategoryCompleted(category.id) && (
                  <span className="stat-badge">🏆 Mastered</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyProgress;