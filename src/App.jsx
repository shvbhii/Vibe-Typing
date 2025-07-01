// src/App.jsx (Definitive Mobile Fix - V3)

import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

import Header from './components/Header';
import Stats from './components/Stats';
import WordsContainer from './components/WordsContainer';
import Results from './components/Results';
import Footer from './components/Footer';

const GITHUB_URL = "https://github.com/shvbhii/Vibe-Typing";
const LINKEDIN_URL = "https://www.linkedin.com/in/shvbhi";

const WORDS = [ 'the', 'be', 'of', 'and', 'a', 'to', 'in', 'he', 'have', 'it', 'that', 'for', 'they', 'with', 'as', 'not', 'on', 'she', 'at', 'by', 'this', 'we', 'you', 'do', 'but', 'from', 'or', 'which', 'one', 'would', 'all', 'will', 'there', 'say', 'who', 'make', 'when', 'can', 'more', 'if', 'no', 'man', 'out', 'other', 'so', 'what', 'time', 'up', 'go', 'about', 'than', 'into', 'could', 'state', 'only', 'new', 'year', 'some', 'take', 'come', 'these', 'know', 'see', 'use', 'get', 'like', 'then', 'first', 'any', 'work', 'now', 'may', 'such', 'give', 'over', 'think', 'most', 'even', 'find', 'day', 'also', 'after', 'way', 'many', 'must', 'look', 'before', 'great', 'back', 'through', 'long', 'where', 'much', 'should', 'well', 'people', 'down', 'own', 'just', 'because', 'good', 'each', 'those', 'feel', 'seem', 'how', 'high', 'too', 'place', 'little', 'world', 'very', 'still', 'nation', 'hand', 'old', 'life', 'tell', 'write', 'become', 'here', 'show', 'house', 'both', 'between', 'need', 'mean', 'call', 'develop', 'under', 'last', 'right', 'move', 'thing', 'general', 'school', 'never', 'same', 'another', 'begin', 'while', 'number', 'part', 'turn', 'real', 'leave', 'might', 'want', 'point', 'form', 'off', 'child', 'few', 'small', 'since', 'against', 'ask', 'late', 'home', 'interest', 'large', 'person', 'end', 'open', 'public', 'follow', 'during', 'present', 'without', 'again', 'hold', 'govern', 'around', 'possible', 'head', 'consider', 'word', 'program', 'problem', 'however', 'lead', 'system', 'set', 'order', 'eye', 'plan', 'run', 'keep', 'face', 'fact', 'group', 'play', 'stand', 'increase', 'early', 'course', 'change', 'help', 'line', 'city', 'put', 'close', 'case', 'force', 'meet', 'once', 'water', 'upon', 'war', 'far', 'build', 'grow', 'walk', 'hard', 'place', 'young', 'talk', 'method', 'final' ];
const GAME_TIME = 60;
const LINE_HEIGHT = 48;

function App() {
    const [gameState, setGameState] = useState({
        timeLeft: GAME_TIME,
        isTestActive: false,
        charIndex: 0,
        errors: 0,
        correctStrokes: 0,
        charArray: [],
    });
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    const musicRef = useRef(null);
    const wordsContainerRef = useRef(null);
    const mainContainerRef = useRef(null);
    const inputRef = useRef(null);

    const generateWords = (count = 60) => {
        let words = '';
        for (let i = 0; i < count; i++) { words += WORDS[Math.floor(Math.random() * WORDS.length)] + ' '; }
        return words.split('').map(char => ({ char: char, status: 'pending' }));
    };

    const resetTest = useCallback(() => {
        const newChars = generateWords();
        if (newChars.length > 0) newChars[0].status = 'current';
        
        setGameState({
            timeLeft: GAME_TIME,
            isTestActive: false,
            charIndex: 0,
            errors: 0,
            correctStrokes: 0,
            charArray: newChars
        });

        if (mainContainerRef.current) mainContainerRef.current.classList.remove('test-complete');
        if (wordsContainerRef.current) wordsContainerRef.current.style.top = '0px';
        if (musicRef.current) {
            musicRef.current.pause();
            musicRef.current.currentTime = 0;
        }
        if (inputRef.current) inputRef.current.focus();
    }, []);

    const handleAreaFocus = () => {
        if (inputRef.current) inputRef.current.focus();
    };
    
    useEffect(() => { resetTest(); }, [resetTest]);

    useEffect(() => {
        let timerInterval;
        if (gameState.isTestActive && gameState.timeLeft > 0) {
            timerInterval = setInterval(() => {
                setGameState(prev => ({...prev, timeLeft: prev.timeLeft - 1}));
            }, 1000);
        }
        if(gameState.timeLeft === 0 && gameState.isTestActive){
            setGameState(prev => ({...prev, isTestActive: false}));
            if (mainContainerRef.current) mainContainerRef.current.classList.add('test-complete');
            if (musicRef.current) musicRef.current.pause();
        }
        return () => clearInterval(timerInterval);
    }, [gameState.isTestActive, gameState.timeLeft]);
    
    useEffect(() => {
        if (gameState.timeLeft === GAME_TIME) {
            setWpm(0);
            setAccuracy(100);
            return;
        }
        const elapsedTime = GAME_TIME - gameState.timeLeft;
        const calculatedWpm = Math.round((gameState.correctStrokes / 5) / (elapsedTime / 60));
        setWpm(calculatedWpm);
        const totalStrokes = gameState.correctStrokes + gameState.errors;
        const calculatedAccuracy = totalStrokes === 0 ? 100 : Math.round((gameState.correctStrokes / totalStrokes) * 100);
        setAccuracy(calculatedAccuracy);
    }, [gameState.timeLeft, gameState.correctStrokes, gameState.errors]);

    const handleKeyDown = (e) => {
        e.preventDefault();

        if (gameState.timeLeft === 0) return;

        const { key } = e;

        setGameState(prev => {
            let { isTestActive, charIndex, errors, correctStrokes, charArray } = prev;

            if (!isTestActive && key.length === 1 && key !== ' ') {
                isTestActive = true;
                musicRef.current.play().catch(() => {});
            }

            const newChars = [...charArray];
            
            if (key === 'Backspace') {
                if (charIndex > 0) {
                    newChars[charIndex].status = 'pending';
                    if (newChars[charIndex-1].status === 'incorrect') {
                        errors--;
                    }
                    newChars[charIndex-1].status = 'current';
                    charIndex--;
                }
            }
            
            if (key.length === 1 && charIndex < newChars.length) {
                if (key === newChars[charIndex].char) {
                    newChars[charIndex].status = 'correct';
                    correctStrokes++;
                } else {
                    newChars[charIndex].status = 'incorrect';
                    errors++;
                }
                if (charIndex < newChars.length - 1) {
                    newChars[charIndex + 1].status = 'current';
                }
                charIndex++;

                if (wordsContainerRef.current) {
                    const nextCharSpan = wordsContainerRef.current.children[charIndex];
                    if (nextCharSpan?.offsetTop > wordsContainerRef.current.offsetHeight - (LINE_HEIGHT * 2)) {
                        wordsContainerRef.current.style.top = `${parseInt(wordsContainerRef.current.style.top || 0) - LINE_HEIGHT}px`;
                    }
                }
            }

            return { ...prev, isTestActive, charIndex, errors, correctStrokes, charArray: newChars };
        });
    };

    const getTimerColor = () => (gameState.timeLeft <= 10 ? 'var(--error-color)' : 'var(--accent-pink)');
    const getStatsColor = () => {
        if (wpm > 60) return 'var(--correct-color)';
        if (wpm > 40) return 'var(--cursor-color)';
        return 'var(--text-primary)';
    };
    
    return (
        <>
            <div className="container loading" ref={mainContainerRef}>
                <Header />
                
                { gameState.timeLeft === 0 ? (
                    <Results wpm={wpm} accuracy={accuracy} onRestart={resetTest} />
                ) : (
                    <div className="game-layout">
                        <div className="main-game" onClick={handleAreaFocus}>
                            <WordsContainer charArray={gameState.charArray} containerRef={wordsContainerRef} />
                            { !gameState.isTestActive && ( <button id="reset-button">🚀 Start Typing</button> )}
                        </div>
                        <Stats wpm={wpm} accuracy={accuracy} timeLeft={gameState.timeLeft} getStatsColor={getStatsColor} getTimerColor={getTimerColor} />
                    </div>
                )}
                
                <input
                    ref={inputRef}
                    type="text"
                    className="hidden-input"
                    onKeyDown={handleKeyDown}
                    autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
                />

                <audio id="chill-music" src="/chill-music.mp3" loop ref={musicRef}></audio>
            </div>
            
            <Footer githubUrl={GITHUB_URL} linkedinUrl={LINKEDIN_URL} />
        </>
    );
}

export default App;