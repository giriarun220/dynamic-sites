import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'text', count = 1, className = '' }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`skeleton skeleton-card ${className}`}>
            <div className="skeleton-img"></div>
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-line"></div>
            <div className="skeleton-text skeleton-line short"></div>
          </div>
        );
      case 'hero':
        return (
          <div className={`skeleton skeleton-hero ${className}`}>
            <div className="skeleton-text skeleton-hero-title"></div>
            <div className="skeleton-text skeleton-line hero-line"></div>
            <div className="skeleton-text skeleton-line hero-line short"></div>
            <div className="skeleton-btn"></div>
          </div>
        );
      case 'profile':
        return (
          <div className={`skeleton skeleton-profile ${className}`}>
            <div className="skeleton-avatar"></div>
            <div className="skeleton-text skeleton-title"></div>
            <div className="skeleton-text skeleton-line short"></div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="skeleton-dashboard">
            <div className="skeleton-sidebar">
              <div className="skeleton-text skeleton-title"></div>
              <div className="skeleton-nav-item"></div>
              <div className="skeleton-nav-item"></div>
              <div className="skeleton-nav-item"></div>
              <div className="skeleton-nav-item"></div>
            </div>
            <div className="skeleton-content">
              <div className="skeleton-panel">
                 <div className="skeleton-text skeleton-title" style={{width: '30%', marginBottom: '30px'}}></div>
                 <div className="skeleton-field"></div>
                 <div className="skeleton-field"></div>
                 <div className="skeleton-field"></div>
              </div>
            </div>
          </div>
        );
      case 'text':
      default:
        return <div className={`skeleton skeleton-text skeleton-line ${className}`}></div>;
    }
  };

  return (
    <div className="skeleton-wrapper">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <React.Fragment key={i}>{renderSkeleton()}</React.Fragment>
        ))}
    </div>
  );
};

export default SkeletonLoader;
