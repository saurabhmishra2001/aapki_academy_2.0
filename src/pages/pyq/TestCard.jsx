import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestCard({ test }) {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate(`/pyq-tests/${test.id}`);
  };

  return (
    <div className="test-card">
      <h2>{test.title}</h2>
      <button onClick={handleStartTest}>Start Test</button>
    </div>
  );
}