// src/App.jsx (Definitive Mobile Fix)

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
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [isTestActive, setIsTestActive] = useState(false);
    const [charIndex, setCharIndex] = useState(0);
    const [errors, setErrors] = useState(0);
    const [correctStrokes, setCorrectStrokes] = useState(0);
    const [charArray, setCharArray] = useState([]);
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
        setIsTestActive(false);
        setTimeLeft(GAME_TIME);
        setCharIndex(0);
        setErrors(0);
        setCorrectStrokes(0);
        const newChars = generateWords();
        if (newChars.length > 0) newChars[0].status = 'current';
        setCharArray(newChars);
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
        if (isTestActive && timeLeft > 0) {
            timerInterval = setInterval(() => { setTimeLeft(prevTime => prevTime - 1); }, 1000);
        }
        return () => clearInterval(timerInterval);
    }, [isTestActive, timeLeft]);
    
    useEffect(() => {
        if (timeLeft === GAME_TIME) {
            setWpm(0);
            setAccuracy(100);
            return;
        }
        const elapsedTime = GAME_TIME - timeLeft;
        const calculatedWpm = Math.round((correctStrokes / 5) / (elapsedTime / 60));
        setWpm(calculatedWpm);
        const totalStrokes = correctStrokes + errors;
        const calculatedAccuracy = totalStrokes === 0 ? 100 : Math.round((correctStrokes / totalStrokes) * 100);
        setAccuracy(calculatedAccuracy);
    }, [timeLeft, correctStrokes, errors]);

    // This is the new, correct way to handle keyboard input
    const handleKeyDown = (e) => {
        // Stop the event from doing anything else (like typing in the input)
        e.preventDefault();

        if (timeLeft === 0) return;

        const { key } = e;

        // Start the test on the first valid keypress
        if (!isTestActive && key.length === 1 && key !== ' ') {
            setIsTestActive(true);
            musicRef.current.play().catch(() => {});
        }

        if (key === 'Backspace') {
            setCharArray(currentChars => {
                const newChars = [...currentChars];
                if (charIndex > 0) {
                    newChars[charIndex].status = 'pending';
                    if (newChars[charIndex-1].status === 'incorrect') {
                        setErrors(err => err - 1);
                    }
                    newChars[charIndex-1].status = 'current';
                }
                return newChars;
            });
            setCharIndex(i => Math.max(0, i - 1));
            return;
        }
        
        if (key.length === 1) {
            setCharArray(currentChars => {
                const newChars = [...currentChars];
                if (charIndex < newChars.length) {
                    if (key === newChars[charIndex].char) {
                        newChars[charIndex].status = 'correct';
                        setCorrectStrokes(s => s + 1);
                    } else {
                        newChars[charIndex].status = 'incorrect';
                        setErrors(err => err + 1);
                    }
                    if (charIndex < newChars.length - 1) {
                        newChars[charIndex + 1].status = 'current';
                    }
                }
                return newChars;
            });

            setCharIndex(i => i + 1);

            // Scroll logic
            if (wordsContainerRef.current) {
                const nextCharSpan = wordsContainerRef.current.children[charIndex + 1];
                if (nextCharSpan?.offsetTop > wordsContainerRef.current.offsetHeight - (LINE_HEIGHT * 2)) {
                    wordsContainerRef.current.style.top = `${parseInt(wordsContainerRef.current.style.top || 0) - LINE_HEIGHT}px`;
                }
            }
        }
    };

    const getTimerColor = () => (timeLeft <= 10 ? 'var(--error-color)' : 'var(--accent-pink)');
    const getStatsColor = () => {
        if (wpm > 60) return 'var(--correct-color)';
        if (wpm > 40) return 'var(--cursor-color)';
        return 'var(--text-primary)';
    };
    
    return (
        <>
            <div className="container loading" ref={mainContainerRef}>
                <Header />
                
                { timeLeft === 0 ? (
                    <Results wpm={wpm} accuracy={accuracy} onRestart={resetTest} />
                ) : (
                    <div className="game-layout">
                        <div className="main-game" onClick={handleAreaFocus}>
                            <WordsContainer charArray={charArray} containerRef={wordsContainerRef} />
                            { !isTestActive && ( <button id="reset-button">🚀 Start Typing</button> )}
                        </div>
                        <Stats wpm={wpm} accuracy={accuracy} timeLeft={timeLeft} getStatsColor={getStatsColor} getTimerColor={getTimerColor} />
                    </div>
                )}
                
                {/* We now pass the event handler directly to the input element */}
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