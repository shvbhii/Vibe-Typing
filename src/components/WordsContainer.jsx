// src/components/WordsContainer.jsx

import React from 'react';

const WordsContainer = ({ charArray, containerRef }) => {
  return (
    <div id="words-container">
      <div id="words" ref={containerRef}>
        {charArray.map((charObj, index) => {
          let className = '';
          if (charObj.status === 'correct') className = 'correct';
          if (charObj.status === 'incorrect') className = 'incorrect';
          if (charObj.status === 'current') {
            className = charObj.char === ' ' ? 'current space' : 'current';
          }
          return (
            <span key={index} className={className}>{charObj.char}</span>
          );
        })}
      </div>
    </div>
  );
};

export default WordsContainer;