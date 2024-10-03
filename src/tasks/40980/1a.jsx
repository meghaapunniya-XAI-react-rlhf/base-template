import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Patterns array
const patterns = [
  { type: 'arithmetic', sequence: [2, 4, 6, 8, '?', 12], answer: 10 },
  { type: 'color', sequence: ['red', 'blue', 'green', 'red', '?', 'green'], answer: 'blue' },
  { type: 'shape', sequence: ['circle', 'square', 'triangle', 'circle', '?', 'triangle'], answer: 'square' },
  // ... Add 17 more patterns here for variety
];

function PatternGame() {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20); // 20 seconds per pattern
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0) {
      handleWrongAnswer();
    }
  }, [timeLeft, gameOver]);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === patterns[currentPattern].answer) {
      setScore(prevScore => prevScore + 2);
      if (currentPattern + 1 < patterns.length) {
        setTimeout(() => {
          setCurrentPattern(prev => prev + 1);
          setTimeLeft(20); // Reset timer for new pattern
          setSelectedAnswer(null);
        }, 1000);
      } else {
        setGameOver(true); // All patterns completed
      }
    } else {
      handleWrongAnswer();
    }
  };

  const handleWrongAnswer = () => {
    setLives(prevLives => {
      if (prevLives - 1 === 0) {
        setGameOver(true);
        return 0;
      }
      setScore(prevScore => prevScore - 1);
      return prevLives - 1;
    });
  };

  const resetGame = () => {
    setCurrentPattern(0);
    setScore(0);
    setLives(3);
    setTimeLeft(20);
    setGameOver(false);
    setSelectedAnswer(null);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Game Over</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Your Score: {score}</p>
            <Button onClick={resetGame}>Play Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <h1 className="text-2xl mb-4">Pattern Recognition Game</h1>
      <div className="mb-4">
        <span>Score: {score} | </span>
        <span>Lives: {lives} | </span>
        <span>Time: {timeLeft}</span>
      </div>
      <PatternDisplay pattern={patterns[currentPattern]} selectedAnswer={selectedAnswer} />
      <div className="grid grid-cols-2 gap-4 mt-4">
        {['A', 'B', 'C', 'D'].map(option => (
          <Button 
            key={option} 
            onClick={() => handleAnswer(option)} 
            className={`w-full ${selectedAnswer === option ? 'bg-blue-500' : ''}`}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}

function PatternDisplay({ pattern, selectedAnswer }) {
  const displaySequence = pattern.sequence.map((item, index) => 
    item === '?' ? (selectedAnswer || <span key={index} className="text-gray-400">?</span>) : item
  );

  return (
    <Card className="mb-4 w-full max-w-lg">
      <CardContent>
        <div className="flex space-x-2 justify-center">
          {displaySequence.map((item, idx) => (
            <div key={idx} className={`p-2 ${typeof item === 'string' ? 'bg-gray-200' : 'bg-blue-200'} rounded`}>
              {item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <PatternGame />
    </div>
  );
}