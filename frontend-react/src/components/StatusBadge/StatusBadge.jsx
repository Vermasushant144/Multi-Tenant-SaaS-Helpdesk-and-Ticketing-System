import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const normalized = (status || '').toUpperCase().replace('_', ' ');
  let className = 'status-badge';
  
  if (status === 'OPEN') className += ' status-open';
  else if (status === 'IN_PROGRESS') className += ' status-inprogress';
  else if (status === 'CLOSED') className += ' status-closed';

  return (
    <span className={className}>
      {normalized}
    </span>
  );
};

export default StatusBadge;
