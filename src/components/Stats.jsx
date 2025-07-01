

import React from 'react';

const Stats = ({ wpm, accuracy, timeLeft, getStatsColor, getTimerColor }) => {
  return (
    <div id="game-info">
      <div id="stats" style={{ color: getStatsColor() }}>
        <div className="stat-item">
          <span>WPM</span>
          <span className="stat-value">{wpm}</span>
        </div>
        <div className="stat-item">
          <span>Acc</span>
          <span className="stat-value">{accuracy}%</span>
        </div>
      </div>
      <div 
        id="timer" 
        style={{ color: getTimerColor(), animation: timeLeft <= 10 ? 'cursor-glow 0.5s ease-in-out infinite' : 'none' }}
      >
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </div>
    </div>
  );
};

export default Stats;