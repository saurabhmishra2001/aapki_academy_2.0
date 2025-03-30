export function Button({ 
  children, 
  className = '', 
  variant = 'default', 
  disabled = false, 
  type = 'button', 
  ...props 
}) {
  const variants = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
  };

  return (
    <button
      type={type}
      className={`
        px-4 py-2 rounded-md font-medium transition-colors
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}