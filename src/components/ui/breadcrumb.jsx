import React from "react";
import { Link } from "react-router-dom";

export const Breadcrumb = ({ children }) => {
  return (
    <nav className="flex items-center space-x-2">
      <ol className="flex items-center space-x-2">{children}</ol>
    </nav>
  );
};

export const BreadcrumbList = ({ children }) => {
  return <ol className="flex items-center space-x-2">{children}</ol>;
};

export const BreadcrumbItem = ({ children }) => {
  return <li className="inline-flex items-center">{children}</li>;
};

export const BreadcrumbLink = ({ to, children }) => {
  return (
    <Link to={to} className="text-blue-600 hover:underline">
      {children}
    </Link>
  );
};

export const BreadcrumbSeparator = () => {
  return <span className="mx-2 text-gray-400">/</span>;
};
