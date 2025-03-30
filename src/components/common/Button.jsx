export default function Button({ children, type = 'button', fullWidth = false, onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${
        fullWidth ? 'w-full' : ''
      } bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors`}
    >
      {children}
    </button>
  );
}