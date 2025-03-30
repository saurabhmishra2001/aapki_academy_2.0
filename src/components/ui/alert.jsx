export function Alert({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-50 text-red-800',
    success: 'bg-green-50 text-green-800'
  };

  return (
    <div
      className={`rounded-lg p-4 mb-4 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function AlertDescription({ children, className = '', ...props }) {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
}