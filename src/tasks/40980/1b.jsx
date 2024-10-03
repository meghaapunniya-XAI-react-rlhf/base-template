import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "@/components/ui/timer"; // Assume this component exists or replace with custom

const patterns = [
  { sequence: [1, 2, 3, 4, 5, 6], missing: [3], type: 'arithmetic' },
  { sequence: ['🔴', '🟡', '🟢', '🔵', '🟣'], missing: [2], type: 'colors' },
  { sequence: ['A', 'B', 'C', 'D', 'E'], missing: [1, 3], type: 'alphabet' },
  // Add more patterns here, up to at least 20
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function PatternGame() {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  useEffect(() => {
    if (timer > 0 && lives > 0) {
      const timeout = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeout);
    } else if (timer === 0) {
      handleIncorrect();
    }
  }, [timer, lives]);

  useEffect(() => {
    if (currentPattern < patterns.length) {
      const pattern = patterns[currentPattern];
      const missingItems = pattern.missing.map(index => pattern.sequence[index - 1]);
      const allOptions = [...new Set([...pattern.sequence, ...missingItems, ...shuffleArray(pattern.sequence.slice())].flat())];
      setOptions(shuffleArray(allOptions).slice(0, 4));
    }
  }, [currentPattern]);

  const handleAnswer = (answer) => {
    setSelected(answer);
    const correct = patterns[currentPattern].missing.every(i => patterns[currentPattern].sequence[i - 1] === answer);
    if (correct) {
      setScore(score + 2);
      setAnswerRevealed(true);
      setTimeout(nextPattern, 1500);
    } else {
      handleIncorrect();
    }
  };

  const handleIncorrect = () => {
    setLives(lives - 1);
    setScore(score > 0 ? score - 1 : 0);
    setAnswerRevealed(true);
    if (lives === 1) {
      setTimeout(() => alert('Game Over!'), 1500);
    } else {
      setTimeout(nextPattern, 1500);
    }
  };

  const nextPattern = () => {
    if (currentPattern + 1 < patterns.length) {
      setCurrentPattern(currentPattern + 1);
      setTimer(30 + Math.floor(currentPattern / 5) * 5); // Increase difficulty
      setSelected(null);
      setAnswerRevealed(false);
    } else {
      alert(`You've completed all patterns!`);
    }
  };

  if (lives === 0 || currentPattern >= patterns.length) return <div className="text-center mt-10">Game Over! Your score: {score}</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 sm:px-4">
      <Card className="w-full max-w-lg p-4">
        <CardHeader>
          <CardTitle>Pattern {currentPattern + 1}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-center">
            <div>Sequence: {patterns[currentPattern].sequence.map((item, idx) => 
              patterns[currentPattern].missing.includes(idx + 1) ? '❓' : item).join(' ')}</div>
            <div className="mt-2">Lives: {lives} | Score: {score}</div>
            <Timer time={timer} className="mt-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {options.map(option => (
              <Button 
                key={option} 
                onClick={() => handleAnswer(option)} 
                className={`w-full ${selected === option ? (answerRevealed ? (patterns[currentPattern].missing.some(i => patterns[currentPattern].sequence[i - 1] === option) ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-500') : ''}`}
                disabled={answerRevealed}
              >
                {option}
              </Button>
            ))}
          </div>
          {answerRevealed && (
            <div className="mt-4 text-center text-green-600">
              Correct Answer: {patterns[currentPattern].missing.map(i => patterns[currentPattern].sequence[i - 1]).join(', ')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return <PatternGame />;
}