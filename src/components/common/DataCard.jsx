export default DataCard = ({
  title,
  subtitle,
  content,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="text-gray-700">{content}</div>

      {actions && (
        <div className="mt-4 flex justify-end">
          {actions}
        </div>
      )}
    </div>
  );
};
