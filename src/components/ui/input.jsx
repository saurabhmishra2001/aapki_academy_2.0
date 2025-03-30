export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${className}`}
      {...props}
    />
  );
}