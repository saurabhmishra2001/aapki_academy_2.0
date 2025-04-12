import React from "react";

export const RadioGroup = ({ children, className = "" }) => {
  return <div className={`flex flex-col space-y-2 ${className}`}>{children}</div>;
};

export const RadioGroupItem = ({ id, name, value, checked, onChange, label }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
};
