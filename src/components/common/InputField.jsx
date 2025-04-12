export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  required = false,
  error = "",
  placeholder = "",
  className = "",
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          error
            ? "border-red-500 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300"
        } ${className}`} />
      {error && (
        <p className="mt-1 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </div>
  );
}
