import React from 'react';

const TableHead = ({ children }) => {
  return (
    <thead className="bg-gray-100 text-gray-700">
      {children}
    </thead>
  );
};

export default TableHead;