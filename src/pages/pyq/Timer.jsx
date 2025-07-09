import React, { useEffect } from 'react';

export default function Timer({ duration, onTimeUp }) {
  useEffect(() => {
    const timer = setTimeout(onTimeUp, duration * 60000); // Convert minutes to milliseconds
    return () => clearTimeout(timer);
  }, [duration, onTimeUp]);

  return <div>Time Remaining: {duration} minutes</div>;
}