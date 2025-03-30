import PropTypes from 'prop-types';

export function Progress({ value, max, label }) {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full">
      {label && <span className="block text-sm font-medium mb-1">{label}</span>}
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="block text-sm mt-1">{`${value} / ${max}`}</span>
    </div>
  );
}

Progress.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  label: PropTypes.string,
};