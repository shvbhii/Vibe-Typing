// src/components/Results.jsx

import React from 'react';

const Results = ({ wpm, accuracy, onRestart }) => {
  const mood = wpm >= 55 ? 'Mochi is flying!' : wpm >= 35 ? 'Mochi is focused!' : 'Mochi is resting.';

  return (
    <div className="results-screen">
      <h3>{mood}</h3>
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