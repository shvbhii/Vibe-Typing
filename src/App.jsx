

import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

import Header from './components/Header';
import Stats from './components/Stats';
import WordsContainer from './components/WordsContainer';
import Results from './components/Results';
import Footer from './components/Footer';


const GITHUB_URL = "https://github.com/shvbhii/Vibe-Typing.git";
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

    
    const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];
    const generateWords = (count = 60) => {
        let words = '';
        for (let i = 0; i < count; i++) { words += getRandomWord() + ' '; }
        return words.split('').map(char => ({ char: char, status: 'pending' }));
    };

    const resetTest = useCallback(() => {
        setIsTestActive(false);
        setTimeLeft(GAME_TIME);
        setCharIndex(0);
        setErrors(0);
        setCorrectStrokes(0);
        setWpm(0);
        setAccuracy(100);
        const newChars = generateWords();
        newChars[0].status = 'current';
        setCharArray(newChars);
        if (mainContainerRef.current) mainContainerRef.current.classList.remove('test-complete');
        if (wordsContainerRef.current) wordsContainerRef.current.style.top = '0px';
        if (musicRef.current) {
            musicRef.current.pause();
            musicRef.current.currentTime = 0;
        }
    }, []);

    const endTest = useCallback(() => {
        setIsTestActive(false);
        if (mainContainerRef.current) mainContainerRef.current.classList.add('test-complete');
        if (musicRef.current) musicRef.current.pause();
    }, []);

    useEffect(() => { resetTest(); }, [resetTest]);

    useEffect(() => {
        let timerInterval;
        if (isTestActive && timeLeft > 0) {
            timerInterval = setInterval(() => { setTimeLeft(prevTime => prevTime - 1); }, 1000);
        } else if (timeLeft === 0) {
            endTest();
        }
        return () => clearInterval(timerInterval);
    }, [isTestActive, timeLeft, endTest]);
    
    useEffect(() => {
        const elapsedTime = GAME_TIME - timeLeft;
        if (elapsedTime > 0) {
            const calculatedWpm = Math.round((correctStrokes / 5) / (elapsedTime / 60));
            setWpm(calculatedWpm);
            const totalStrokes = correctStrokes + errors;
            const calculatedAccuracy = totalStrokes === 0 ? 100 : Math.round((correctStrokes / totalStrokes) * 100);
            setAccuracy(calculatedAccuracy);
        } else {
            setWpm(0);
            setAccuracy(100);
        }
    }, [timeLeft, correctStrokes, errors]);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (timeLeft === 0) return;

            if (!isTestActive && e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey) {
                setIsTestActive(true);
                musicRef.current.play().catch(() => {});
            }

            if (!isTestActive || charIndex >= charArray.length) return;
            
            const newCharArray = [...charArray];
            const currentCharacter = newCharArray[charIndex];

            if (e.key === 'Backspace') {
                e.preventDefault();
                if (charIndex > 0) {
                    currentCharacter.status = 'pending';
                    const prevChar = newCharArray[charIndex - 1];
                    if (prevChar.status === 'incorrect') setErrors(e => e - 1);
                    prevChar.status = 'current';
                    setCharArray(newCharArray);
                    setCharIndex(i => i - 1);
                }
                return;
            }
            
            if (e.key.length !== 1) return;

            if (e.key === currentCharacter.char) {
                currentCharacter.status = 'correct';
                setCorrectStrokes(c => c + 1);
            } else {
                currentCharacter.status = 'incorrect';
                setErrors(e => e + 1);
            }

            if (charIndex < newCharArray.length - 1) newCharArray[charIndex + 1].status = 'current';
            
            setCharArray(newCharArray);
            setCharIndex(i => i + 1);

            if (wordsContainerRef.current) {
                const nextCharSpan = wordsContainerRef.current.children[charIndex + 1];
                if (nextCharSpan) {
                    const containerHeight = wordsContainerRef.current.parentElement.clientHeight;
                    if (nextCharSpan.offsetTop + LINE_HEIGHT > containerHeight + Math.abs(parseInt(wordsContainerRef.current.style.top) || 0)) {
                        wordsContainerRef.current.style.top = `${parseInt(wordsContainerRef.current.style.top || 0) - LINE_HEIGHT}px`;
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isTestActive, charIndex, charArray, timeLeft]);

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
                        <div className="main-game">
                            <WordsContainer charArray={charArray} containerRef={wordsContainerRef} />
                            { !isTestActive && (
                                <button id="reset-button" onClick={() => { document.querySelector('#words-container').focus(); }}>
                                🚀 Start Typing
                                </button>
                            )}
                        </div>
                        <Stats 
                            wpm={wpm}
                            accuracy={accuracy}
                            timeLeft={timeLeft}
                            getStatsColor={getStatsColor}
                            getTimerColor={getTimerColor}
                        />
                    </div>
                )}
                
                <audio id="chill-music" src="/chill-music.mp3" loop ref={musicRef}></audio>
            </div>
            
            <Footer githubUrl={GITHUB_URL} linkedinUrl={LINKEDIN_URL} />
        </>
    );
}

export default App;