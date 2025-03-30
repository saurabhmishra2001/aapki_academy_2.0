import { useState } from 'react';

export default function TestQuestion({ question, onAnswer, showResults, userAnswer, isCorrect }) {
  const [selectedOption, setSelectedOption] = useState(userAnswer);
  const options = JSON.parse(question.options);

  const handleOptionSelect = (option) => {
    if (!showResults) {
      setSelectedOption(option);
      onAnswer(question.id, option);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-lg font-medium mb-4">{question.question_text}</h3>
      <div className="space-y-3">
        {options?.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={`p-3 rounded-md cursor-pointer border ${
              selectedOption === option
                ? showResults
                  ? isCorrect
                    ? 'bg-green-100 border-green-500'
                    : 'bg-red-100 border-red-500'
                  : 'bg-blue-100 border-blue-500'
                : 'border-gray-200 hover:border-blue-500'
            }`}
          >
            {option}
          </div>
        ))}
      </div>
      {showResults && (
        <div className={`mt-4 p-3 rounded-md ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          {!isCorrect && (
            <p className="text-sm mt-1">
              Correct answer: <span className="font-medium">{question.correct_answer}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}