import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-10 w-10 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-t-transparent border-blue-500 ${sizes[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
