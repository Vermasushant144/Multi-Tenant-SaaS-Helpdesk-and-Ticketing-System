import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ type = "card", count = 1 }) => {
  const renderItem = (index) => {
    if (type === "table") {
      return (
        <tr key={index} className="skeleton-row">
          <td><div className="skeleton-bar skeleton-w-10"></div></td>
          <td><div className="skeleton-bar skeleton-w-50"></div></td>
          <td><div className="skeleton-bar skeleton-w-20"></div></td>
          <td><div className="skeleton-bar skeleton-w-20"></div></td>
          <td><div className="skeleton-bar skeleton-w-20"></div></td>
        </tr>
      );
    }
    
    if (type === "card") {
      return (
        <div key={index} className="skeleton-card">
          <div className="skeleton-bar skeleton-w-30 mb-2"></div>
          <div className="skeleton-bar skeleton-w-80 mb-2"></div>
          <div className="skeleton-bar skeleton-w-50"></div>
        </div>
      );
    }

    return (
      <div key={index} className="skeleton-bar skeleton-w-100 mb-2"></div>
    );
  };

  if (type === "table") {
    return (
      <tbody className="skeleton-tbody">
        {Array.from({ length: count }).map((_, i) => renderItem(i))}
      </tbody>
    );
  }

  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, i) => renderItem(i))}
    </div>
  );
};

export default LoadingSkeleton;
