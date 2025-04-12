import React from 'react';

const TableRow = ({ children, className, ...props }) => {
  return (
    <tr className={`border-b transition-colors hover:bg-muted ${className}`} {...props}>
      {children}
    </tr>
  );
};

export default TableRow;