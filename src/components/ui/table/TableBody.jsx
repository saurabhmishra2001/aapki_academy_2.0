import React from 'react';

const TableBody = ({ children }) => {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">
      {children}
    </tbody>
  );
};

export default TableBody;