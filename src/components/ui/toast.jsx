export function Toast({ message, type = 'default', duration = 3000 }) {
  const types = {
    default: 'bg-white',
    success: 'bg-green-50 border-green-500',
    error: 'bg-red-50 border-red-500',
    warning: 'bg-yellow-50 border-yellow-500',
  };

  return (
    <div className={`${types[type]} p-4 rounded-lg shadow-md border`}>
      <p className="text-sm">{message}</p>
    </div>
  );
}