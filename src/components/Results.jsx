// src/components/Results.jsx

import React from 'react';

const Results = ({ wpm, accuracy, onRestart }) => {
  return (
    <div className="results-screen">
      <h3>Test Complete!</h3>
      <div className="results-stats">
        <div className="result-stat">
          <span>WPM</span>
          <span className="stat-value">{wpm}</span>
        </div>
        <div className="result-stat">
          <span>Accuracy</span>
          <span className="stat-value">{accuracy}%</span>
        </div>
      </div>
      <button id="reset-button" onClick={onRestart}>
        🔄 Try Again
      </button>
    </div>
  );
};

export default Results;