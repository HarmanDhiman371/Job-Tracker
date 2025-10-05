import React, { useState, useEffect } from 'react';
import '../styles/Plan.css';

const PlanTracker = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editingWeek, setEditingWeek] = useState(null);
  const [newPlan, setNewPlan] = useState({
    title: '',
    topics: [],
    startDate: '',
    endDate: '',
    dailyTasks: []
  });

  // Available topics and their task templates
  const topicTemplates = {
    dsa: {
      name: 'DSA',
      dailyTasks: [
        'Revise concept + solve ~10 problems',
        'LeetCode practice problems',
        'Algorithm implementation',
        'Problem solving techniques',
        'Data structure implementation'
      ]
    },
    web: {
      name: 'Web Development',
      dailyTasks: [
        'Revise topic + implement small task/project',
        'Frontend framework practice',
        'Backend API development',
        'Database integration',
        'Project building'
      ]
    },
    sd: {
      name: 'System Design',
      dailyTasks: [
        'Design pattern study',
        'System architecture design',
        'Scalability concepts',
        'Database design',
        'Case studies'
      ]
    },
    os: {
      name: 'Operating Systems',
      dailyTasks: [
        'OS concepts revision',
        'Process management',
        'Memory management',
        'File systems',
        'Scheduling algorithms'
      ]
    },
    oops: {
      name: 'OOPS',
      dailyTasks: [
        'OOP principles practice',
        'Design patterns',
        'Class design',
        'Inheritance & polymorphism',
        'Real-world examples'
      ]
    }
  };

  const sideTopics = ['Git', 'Testing', 'Networking', 'Security', 'DevOps'];

  // Load plans from localStorage
  useEffect(() => {
    const savedPlans = localStorage.getItem('studyPlans');
    if (savedPlans) {
      try {
        const parsedPlans = JSON.parse(savedPlans);
        setPlans(parsedPlans);
        findCurrentPlan(parsedPlans);
        checkUpcomingWeekReminders(parsedPlans);
      } catch (error) {
        console.error('Error loading plans from localStorage:', error);
        setPlans([]);
      }
    }
  }, []);

  // Find current plan and check reminders
  const findCurrentPlan = (plansList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const current = plansList.find(plan => {
      if (!plan.startDate || !plan.endDate) return false;
      
      const startDate = new Date(plan.startDate);
      const endDate = new Date(plan.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return today >= startDate && today <= endDate;
    });
    setCurrentPlan(current || null);
  };

  // Check if any plans need week task reminders
  const checkUpcomingWeekReminders = (plansList) => {
    const today = new Date();
    plansList.forEach(plan => {
      if (!plan.dailyTasks || !plan.startDate) return;
      
      const weeks = Math.ceil(plan.dailyTasks.length / 7);
      for (let week = 2; week <= weeks; week++) {
        const weekStartDate = new Date(plan.startDate);
        weekStartDate.setDate(weekStartDate.getDate() + (week - 1) * 7);
        const daysUntilWeek = Math.ceil((weekStartDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntilWeek <= 2 && daysUntilWeek >= 0) {
          const weekTasks = plan.dailyTasks.slice((week - 1) * 7, week * 7);
          const hasEmptyTasks = weekTasks.some(task => !task?.task?.trim());
          
          if (hasEmptyTasks) {
            alert(`Reminder: Week ${week} of "${plan.title}" starts in ${daysUntilWeek} days. Please add tasks for the upcoming week!`);
          }
        }
      }
    });
  };

  // Handle topic selection
  const handleTopicChange = (topic) => {
    setNewPlan(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  // Generate daily tasks based on selected topics and duration
  const generateDailyTasks = (startDate, endDate, topics) => {
    const tasks = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    for (let day = 0; day < totalDays; day++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + day);
      
      const isSunday = currentDate.getDay() === 0;
      
      if (isSunday) {
        // Sunday mock day
        tasks.push({
          day: day + 1,
          date: currentDate.toDateString(),
          task: '📊 Mock Day: Coding test + Communication practice + Mini project work',
          completed: false,
          isMockDay: true
        });
      } else {
        // Regular study day
        let dailyTask = '';
        
        (topics || []).forEach((topic, index) => {
          const template = topicTemplates[topic];
          if (template) {
            const taskIndex = day % template.dailyTasks.length;
            dailyTask += `• ${template.name}: ${template.dailyTasks[taskIndex]}\n`;
          }
        });
        
        // Add side topic (rotating)
        const sideTopic = sideTopics[day % sideTopics.length];
        dailyTask += `• Side Topic (30min): ${sideTopic}\n`;
        dailyTask += `• Communication Practice (30min): Read tech article + explain concepts`;
        
        tasks.push({
          day: day + 1,
          date: currentDate.toDateString(),
          task: dailyTask,
          completed: false,
          isMockDay: false
        });
      }
    }
    
    return tasks;
  };

  // Handle date changes and auto-generate tasks
  const handleDateChange = (field, value) => {
    const updatedPlan = {
      ...newPlan,
      [field]: value
    };
    
    // Auto-generate tasks when both dates are set and topics are selected
    if (updatedPlan.startDate && updatedPlan.endDate && updatedPlan.topics.length > 0) {
      const start = new Date(updatedPlan.startDate);
      const end = new Date(updatedPlan.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 40) {
        updatedPlan.dailyTasks = generateDailyTasks(
          updatedPlan.startDate,
          updatedPlan.endDate,
          updatedPlan.topics
        );
      }
    }
    
    setNewPlan(updatedPlan);
  };

  // Add new plan
  const addPlan = () => {
    if (!newPlan.title || !newPlan.startDate || !newPlan.endDate || newPlan.topics.length === 0) {
      alert('Please fill in all required fields and select at least one topic');
      return;
    }

    const start = new Date(newPlan.startDate);
    const end = new Date(newPlan.endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 40) {
      alert('Plan duration cannot exceed 40 days');
      return;
    }

    if (!newPlan.dailyTasks || newPlan.dailyTasks.length === 0) {
      alert('Please generate tasks by selecting dates and topics');
      return;
    }

    const planToAdd = {
      ...newPlan,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      duration: diffDays + 1
    };

    const updatedPlans = [...plans, planToAdd];
    setPlans(updatedPlans);
    localStorage.setItem('studyPlans', JSON.stringify(updatedPlans));
    setShowForm(false);
    setNewPlan({
      title: '',
      topics: [],
      startDate: '',
      endDate: '',
      dailyTasks: []
    });
    findCurrentPlan(updatedPlans);
  };

  // Delete plan
  const deletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      const updatedPlans = plans.filter(plan => plan.id !== planId);
      setPlans(updatedPlans);
      localStorage.setItem('studyPlans', JSON.stringify(updatedPlans));
      
      // Clear current plan if it was deleted
      if (currentPlan && currentPlan.id === planId) {
        setCurrentPlan(null);
      }
      
      // Close details modal if the selected plan was deleted
      if (selectedPlan && selectedPlan.id === planId) {
        setSelectedPlan(null);
      }
    }
  };

  // Mark task as completed/incomplete
  const toggleTaskCompletion = (planId, taskIndex) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        const updatedTasks = [...plan.dailyTasks];
        if (updatedTasks[taskIndex]) {
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            completed: !updatedTasks[taskIndex].completed
          };
        }
        return { ...plan, dailyTasks: updatedTasks };
      }
      return plan;
    });

    setPlans(updatedPlans);
    localStorage.setItem('studyPlans', JSON.stringify(updatedPlans));
    
    if (currentPlan && currentPlan.id === planId) {
      setCurrentPlan(updatedPlans.find(plan => plan.id === planId));
    }
    if (selectedPlan && selectedPlan.id === planId) {
      setSelectedPlan(updatedPlans.find(plan => plan.id === planId));
    }
  };

  // Calculate completion percentage
  const calculateCompletion = (tasks) => {
    if (!tasks || !Array.isArray(tasks)) return 0;
    const completed = tasks.filter(task => task?.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Get today's task
  const getTodayTask = () => {
    if (!currentPlan || !currentPlan.dailyTasks) return null;
    
    const today = new Date().toDateString();
    return currentPlan.dailyTasks.find(task => task?.date === today);
  };

  // Update week tasks
  const updateWeekTasks = (planId, weekNumber, updatedTasks) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        const startIndex = (weekNumber - 1) * 7;
        const newDailyTasks = [...plan.dailyTasks];
        
        updatedTasks.forEach((task, index) => {
          if (startIndex + index < newDailyTasks.length && newDailyTasks[startIndex + index]) {
            newDailyTasks[startIndex + index] = {
              ...newDailyTasks[startIndex + index],
              task: task.task || newDailyTasks[startIndex + index].task
            };
          }
        });
        
        return { ...plan, dailyTasks: newDailyTasks };
      }
      return plan;
    });

    setPlans(updatedPlans);
    localStorage.setItem('studyPlans', JSON.stringify(updatedPlans));
    setEditingWeek(null);
    
    if (selectedPlan && selectedPlan.id === planId) {
      setSelectedPlan(updatedPlans.find(plan => plan.id === planId));
    }
  };

  const todayTask = getTodayTask();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Safe rendering functions
  const renderTopicTags = (topics) => {
    if (!topics || !Array.isArray(topics)) return null;
    
    return (
      <div className="topic-tags">
        {topics.map(topic => (
          <span key={topic} className="topic-tag">
            {topicTemplates[topic]?.name || topic}
          </span>
        ))}
      </div>
    );
  };

  const renderTaskContent = (task) => {
    if (!task || !task.task) return null;
    
    return (
      <div className="task-content">
        {task.task.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="plan-tracker">
      {/* Header Section */}
      <div className="plan-header">
        <h1 className="plan-title">
          Study <span className="gradient-text">Plans</span>
        </h1>
        <p className="plan-subtitle">Track your daily study goals and progress</p>
      </div>

      {/* Current Day Task */}
      <div className="current-task-section">
        <div className="section-header">
          <h2>Today's Task - {currentDate}</h2>
        </div>
        {currentPlan && todayTask ? (
          <div className="today-task-card">
            <div className="task-header">
              <h3>{currentPlan.title || 'Untitled Plan'}</h3>
              {renderTopicTags(currentPlan.topics)}
            </div>
            <div className="task-content">
              {renderTaskContent(todayTask)}
              <div className="task-actions">
                <button
                  className={`btn-action ${todayTask.completed ? 'btn-completed' : 'btn-complete'}`}
                  onClick={() => toggleTaskCompletion(currentPlan.id, currentPlan.dailyTasks.indexOf(todayTask))}
                >
                  {todayTask.completed ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
            <div className="progress-section">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${calculateCompletion(currentPlan.dailyTasks)}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {calculateCompletion(currentPlan.dailyTasks)}% Complete
              </span>
            </div>
          </div>
        ) : (
          <div className="no-task-card">
            <p>No active plan for today. Create a new plan to get started!</p>
          </div>
        )}
      </div>

      {/* Plan Management */}
      <div className="plan-management">
        <div className="section-header">
          <h2>Your Study Plans</h2>
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            + New Plan
          </button>
        </div>

        {/* Plans List */}
        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.id} className="plan-card">
              <div className="plan-card-header">
                <h3>{plan.title || 'Untitled Plan'}</h3>
                <span className="plan-duration">{plan.duration || 0} days</span>
              </div>
              {renderTopicTags(plan.topics)}
              <div className="plan-dates">
                <span>📅 {plan.startDate ? new Date(plan.startDate).toLocaleDateString() : 'No start date'} - {plan.endDate ? new Date(plan.endDate).toLocaleDateString() : 'No end date'}</span>
              </div>
              <div className="plan-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${calculateCompletion(plan.dailyTasks)}%` }}
                  ></div>
                </div>
                <span>{calculateCompletion(plan.dailyTasks)}%</span>
              </div>
              <div className="plan-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setSelectedPlan(plan)}
                >
                  View Details
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => deletePlan(plan.id)}
                  title="Delete Plan"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="empty-state">
            <p>No study plans yet. Create your first plan to start tracking!</p>
          </div>
        )}
      </div>

      {/* Add Plan Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Study Plan</h2>
              <button 
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            
            <div className="form-group">
              <label>Plan Title *</label>
              <input
                type="text"
                name="title"
                value={newPlan.title}
                onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., October 2025 Study Plan"
              />
            </div>

            <div className="form-group">
              <label>Select Topics *</label>
              <div className="topics-grid">
                {Object.keys(topicTemplates).map(topic => (
                  <div key={topic} className="topic-option">
                    <input
                      type="checkbox"
                      id={topic}
                      checked={newPlan.topics.includes(topic)}
                      onChange={() => handleTopicChange(topic)}
                    />
                    <label htmlFor={topic}>{topicTemplates[topic].name}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="date-fields">
              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={newPlan.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>End Date *</label>
                <input
                  type="date"
                  value={newPlan.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                />
              </div>
            </div>

            {newPlan.startDate && newPlan.endDate && newPlan.topics.length > 0 && newPlan.dailyTasks.length > 0 && (
              <div className="plan-preview">
                <h3>Week 1 Tasks (Mandatory)</h3>
                <div className="tasks-preview">
                  {newPlan.dailyTasks.slice(0, 7).map((task, index) => (
                    <div key={index} className="task-preview-item">
                      <strong>Day {index + 1}:</strong>
                      {renderTaskContent(task)}
                    </div>
                  ))}
                </div>
                <p className="info-text">
                  💡 Weeks 2+ tasks will be auto-generated. You can edit them later!
                </p>
              </div>
            )}

            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={addPlan}
                disabled={!newPlan.title || !newPlan.startDate || !newPlan.endDate || newPlan.topics.length === 0 || newPlan.dailyTasks.length === 0}
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Details Modal */}
      {selectedPlan && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h2>{selectedPlan.title || 'Untitled Plan'}</h2>
              <div className="modal-header-actions">
                
                <button 
                  className="close-btn"
                  onClick={() => setSelectedPlan(null)}
                >
                  ×
                </button>
              </div>
            </div>

            <div className="plan-summary">
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Duration</span>
                  <span className="summary-value">{selectedPlan.duration || 0} days</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Progress</span>
                  <span className="summary-value">{calculateCompletion(selectedPlan.dailyTasks)}%</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Start Date</span>
                  <span className="summary-value">{selectedPlan.startDate ? new Date(selectedPlan.startDate).toLocaleDateString() : 'Not set'}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">End Date</span>
                  <span className="summary-value">{selectedPlan.endDate ? new Date(selectedPlan.endDate).toLocaleDateString() : 'Not set'}</span>
                </div>
              </div>

              <div className="topics-summary">
                <h4>Topics Covered:</h4>
                {renderTopicTags(selectedPlan.topics)}
              </div>
            </div>

            <div className="weekly-breakdown">
              <h3>Weekly Breakdown</h3>
              {selectedPlan.dailyTasks && Array.from({ length: Math.ceil(selectedPlan.dailyTasks.length / 7) }, (_, weekIndex) => {
                const weekNumber = weekIndex + 1;
                const weekTasks = selectedPlan.dailyTasks.slice(weekIndex * 7, (weekIndex + 1) * 7);
                const weekCompletion = calculateCompletion(weekTasks);
                
                return (
                  <div key={weekIndex} className="week-section">
                    <div className="week-header">
                      <h4>Week {weekNumber}</h4>
                      <div className="week-actions">
                        <span className="completion-badge">{weekCompletion}% complete</span>
                        {weekNumber > 1 && (
                          <button 
                            className="btn-secondary small-btn"
                            onClick={() => setEditingWeek(editingWeek === weekNumber ? null : weekNumber)}
                          >
                            {editingWeek === weekNumber ? 'Cancel Edit' : 'Edit Tasks'}
                          </button>
                        )}
                      </div>
                    </div>

                    {editingWeek === weekNumber ? (
                      <div className="week-edit-mode">
                        {weekTasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="task-edit-item">
                            <label>Day {(weekIndex * 7) + taskIndex + 1}</label>
                            <textarea
                              value={task?.task || ''}
                              onChange={(e) => {
                                const updatedTasks = [...weekTasks];
                                updatedTasks[taskIndex] = {
                                  ...updatedTasks[taskIndex],
                                  task: e.target.value
                                };
                                // Update local state for preview
                                const globalTaskIndex = (weekIndex * 7) + taskIndex;
                                const updatedPlan = { ...selectedPlan };
                                updatedPlan.dailyTasks[globalTaskIndex] = updatedTasks[taskIndex];
                                setSelectedPlan(updatedPlan);
                              }}
                              rows="3"
                            />
                          </div>
                        ))}
                        <div className="edit-actions">
                          <button 
                            className="btn-primary"
                            onClick={() => updateWeekTasks(selectedPlan.id, weekNumber, weekTasks)}
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="week-tasks">
                        {weekTasks.map((task, taskIndex) => (
                          <div key={taskIndex} className={`task-item ${task?.completed ? 'completed' : ''}`}>
                            <div className="task-checkbox">
                              <input
                                type="checkbox"
                                checked={task?.completed || false}
                                onChange={() => toggleTaskCompletion(selectedPlan.id, (weekIndex * 7) + taskIndex)}
                              />
                            </div>
                            <div className="task-details">
                              <div className="task-date">
                                <strong>Day {(weekIndex * 7) + taskIndex + 1}</strong> - {task?.date || 'No date'}
                              </div>
                              {renderTaskContent(task)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTracker;