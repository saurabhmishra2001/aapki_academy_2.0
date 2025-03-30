export default function QuestionNavigation({
  total,
  current,
  answers,
  flagged,
  onChange
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4">Question Navigation</h3>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`
              p-2 rounded-md text-center
              ${i === current ? 'ring-2 ring-indigo-500' : ''}
              ${answers[i] ? 'bg-green-100' : 'bg-gray-100'}
              ${flagged[i] ? 'border-2 border-yellow-400' : ''}
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}