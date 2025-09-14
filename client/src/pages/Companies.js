// Companies.js
import React, { useState, useEffect } from 'react';
import '../styles/Companies.css';

const Companies = () => {
  const [companies, setCompanies] = useState(() => {
    // Load companies from localStorage initially
    try {
      const savedCompanies = localStorage.getItem('companies');
      return savedCompanies ? JSON.parse(savedCompanies) : [];
    } catch (error) {
      console.error('Error loading companies from localStorage:', error);
      return [];
    }
  });
  
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [location, setLocation] = useState('Remote');
  const [packageRange, setPackageRange] = useState('10-20 LPA');
  const [isAdding, setIsAdding] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Predefined status options
  const statusOptions = [
    { value: 'Applied', label: 'Applied', color: '#4cc9f0' },
    { value: 'Online Assessment', label: 'OA', color: '#7209b7' },
    { value: 'Interview', label: 'Interview', color: '#f72585' },
    { value: 'Rejected', label: 'Rejected', color: '#e63946' },
    { value: 'Offer', label: 'Offer', color: '#3a0ca3' }
  ];

  // Predefined role options
  const roleOptions = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'UX Designer'
  ];

  // Predefined location options
  const locationOptions = [
    'Remote',
    'Bangalore',
    'Hyderabad',
    'Pune',
    'Mumbai',
    'Delhi',
    'Chennai',
    'Gurgaon',
    'International'
  ];

  // Predefined package range options
  const packageOptions = [
    '0-10 LPA',
    '10-20 LPA',
    '20-30 LPA',
    '30-40 LPA',
    '40-50 LPA',
    '50+ LPA'
  ];

  // Save companies to localStorage whenever companies state changes
  useEffect(() => {
    try {
      localStorage.setItem('companies', JSON.stringify(companies));
      // Update the global count for the homepage
      window.dispatchEvent(new Event('companiesUpdated'));
    } catch (error) {
      console.error('Error saving companies to localStorage:', error);
    }
  }, [companies]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!companyName.trim()) return;
    
    // Get current date from API (fallback to local date if API fails)
    fetch('https://worldtimeapi.org/api/ip')
      .then(response => response.json())
      .then(data => {
        addCompany(data.datetime);
      })
      .catch(() => {
        // If API fails, use local date
        addCompany(new Date().toISOString());
      });
  };

  const addCompany = (dateString) => {
    const newCompany = {
      id: Date.now(),
      name: companyName.trim(),
      role: role,
      location: location,
      package: packageRange,
      status: 'Applied',
      appliedDate: dateString,
      lastUpdated: new Date().toISOString()
    };

    const updatedCompanies = [...companies, newCompany];
    setCompanies(updatedCompanies);
    
    // Reset form
    setCompanyName('');
    setRole('Software Engineer');
    setLocation('Remote');
    setPackageRange('10-20 LPA');
    setIsAdding(false);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedCompanies = companies.map(company => 
      company.id === id 
        ? {...company, status: newStatus, lastUpdated: new Date().toISOString()}
        : company
    );
    setCompanies(updatedCompanies);
  };

  const handleDelete = (id) => {
    const updatedCompanies = companies.filter(company => company.id !== id);
    setCompanies(updatedCompanies);
  };

  const getStatusCount = (status) => {
    return companies.filter(company => company.status === status).length;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Filter companies based on active filter
  const filteredCompanies = activeFilter === 'All' 
    ? companies 
    : companies.filter(company => company.status === activeFilter);

  return (
    <div className="companies-page">
      <div className="companies-header">
        <h1>Your Applications</h1>
        <p>Quickly track companies you've applied to</p>
      </div>

      {/* Stats Overview - Compact Version with Filter Buttons */}
      <div className="stats-overview compact">
        <div 
          className={`stat-card compact total ${activeFilter === 'All' ? 'active' : ''}`}
          onClick={() => setActiveFilter('All')}
        >
          <div className="stat-icon">
            <i className="fas fa-briefcase"></i>
          </div>
          <div className="stat-info">
            <span className="stat-count">{companies.length}</span>
            <span className="stat-label">All</span>
          </div>
        </div>
        
        {statusOptions.map(status => (
          <div 
            key={status.value} 
            className={`stat-card compact ${activeFilter === status.value ? 'active' : ''}`}
            onClick={() => setActiveFilter(status.value)}
            style={{ cursor: 'pointer' }}
          >
            <div className="stat-icon" style={{ backgroundColor: `${status.color}20`, color: status.color }}>
              <i className={`fas fa-${status.value === 'Offer' ? 'trophy' : status.value === 'Rejected' ? 'times' : status.value === 'Interview' ? 'handshake' : status.value === 'Online Assessment' ? 'laptop-code' : 'paper-plane'}`}></i>
            </div>
            <div className="stat-info">
              <span className="stat-count">{getStatusCount(status.value)}</span>
              <span className="stat-label">{status.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Company Button */}
      <div className="add-company-section">
        {!isAdding ? (
          <button 
            className="add-company-btn"
            onClick={() => setIsAdding(true)}
          >
            <i className="fas fa-plus"></i> Add Company
          </button>
        ) : (
          <form className="quick-add-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company name"
              autoFocus
              className="company-input"
            />
            
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
            >
              {roleOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-select"
            >
              {locationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            
            <select
              value={packageRange}
              onChange={(e) => setPackageRange(e.target.value)}
              className="form-select"
            >
              {packageOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                Add
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Companies List */}
      <div className="companies-list">
        {companies.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-briefcase"></i>
            <h3>No applications yet</h3>
            <p>Add your first application to get started!</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-filter"></i>
            <h3>No applications with {activeFilter} status</h3>
            <p>Try selecting a different filter or add new applications.</p>
          </div>
        ) : (
          <div className="companies-container">
            <div className="filter-info">
              Showing {filteredCompanies.length} of {companies.length} applications
              {activeFilter !== 'All' && ` (filtered by ${activeFilter})`}
            </div>
            
            {filteredCompanies.map(company => (
              <div key={company.id} className="company-item">
                <div className="company-main">
                  <div className="company-info">
                    <h3 className="company-name">{company.name}</h3>
                    <div className="company-details">
                      <span className="company-role">
                        <i className="fas fa-user-tie"></i> {company.role}
                      </span>
                      <span className="company-location">
                        <i className="fas fa-map-marker-alt"></i> {company.location}
                      </span>
                      <span className="company-package">
                        <i className="fas fa-money-bill-wave"></i> {company.package}
                      </span>
                    </div>
                    <p className="company-date">
                      <i className="fas fa-calendar"></i> Applied: {formatDate(company.appliedDate)}
                    </p>
                  </div>
                  
                  <div className="company-actions">
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(company.id)}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <div className="status-section">
                  <span className="status-label">Status:</span>
                  <div className="status-options">
                    {statusOptions.map(status => (
                      <button
                        key={status.value}
                        className={`status-btn ${company.status === status.value ? 'active' : ''}`}
                        style={{ 
                          backgroundColor: company.status === status.value ? status.color : 'transparent',
                          color: company.status === status.value ? 'white' : status.color,
                          borderColor: status.color
                        }}
                        onClick={() => handleStatusChange(company.id, status.value)}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;