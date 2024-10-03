import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const patterns = [
    // Simple arithmetic pattern
    { type: "arithmetic", items: [2, 4, 6, 8, 10], missing: [1], options: [4, 5, 6, 7] },
    
    // Shapes pattern
    { type: "shapes", items: ["🔴", "🔵", "🟡", "🔴", "🔵"], missing: [1], options: ["🔴", "🔵", "🟡", "🟢"] },
    
    // Emoji pattern
    { type: "emoji", items: ["😀", "😃", "😄", "😁", "😆"], missing: [2], options: ["😄", "😅", "😂", "🤣"] },
    
    // Colors pattern
    { type: "color", items: ["red", "orange", "yellow", "green", "blue"], missing: [1, 3], options: ["orange", "purple", "green", "pink"] },
    
    // Number pattern (Prime numbers)
    { type: "numbers", items: [2, 3, 5, 7, "_", 13, "_"], missing: [4, 6], options: [9, 11, 17, 19] },
    
    // Shapes with blank in the middle
    { type: "shapes", items: ["🟢", "🔺", "🟢", "_", "🔺"], missing: [3], options: ["🟢", "🔺", "🔵", "🔶"] },
    
    // Fibonacci sequence
    { type: "numbers", items: [0, 1, 1, 2, 3, "_", 8], missing: [5], options: [4, 5, 6, 7] },
    
    // Mixed emoji pattern
    { type: "emoji", items: ["🐶", "🐱", "🐭", "_", "🐹"], missing: [3], options: ["🐰", "🐭", "🐶", "🐼"] },
    
    // Color shades
    { type: "color", items: ["light blue", "blue", "dark blue", "_", "black"], missing: [3], options: ["light blue", "purple", "navy", "gray"] },
    
    // Arithmetic (subtraction)
    { type: "numbers", items: [100, 90, 80, "_", 60], missing: [3], options: [65, 70, 75, 55] },
    
    // Geometric sequence
    { type: "numbers", items: [1, 2, 4, "_", 16], missing: [3], options: [6, 8, 10, 12] },
    
    // Shapes with increasing complexity
    { type: "shapes", items: ["🔺", "🔵", "_", "🔺", "🔵"], missing: [2], options: ["🔴", "🔵", "🔶", "🔺"] },
    
    // Mixed types (numbers and emojis)
    { type: "mixed", items: [1, "🙂", 2, "_", 4], missing: [3], options: ["🙂", "😀", "😃", 3] },
    
    // Multiplication pattern
    { type: "numbers", items: [2, 4, 8, 16, "_", 64], missing: [4], options: [24, 32, 40, 48] },
    
    // Pattern with Roman numerals
    { type: "roman", items: ["I", "II", "III", "_", "V"], missing: [3], options: ["II", "III", "IV", "VI"] },
    
    // Double color patterns
    { type: "color", items: ["🟥", "🟦", "🟩", "_", "_", "🟦"], missing: [3, 4], options: ["🟥", "🟩", "🟦", "🟪"] },
    
    // Alphabet sequence
    { type: "alphabet", items: ["A", "B", "_", "D", "_"], missing: [2, 4], options: ["B", "C", "D", "E"] },
    
    // Complex emoji pattern with logic
    { type: "emoji", items: ["😀", "😃", "😄", "_", "😂", "_"], missing: [3, 5], options: ["😃", "😅", "🤣", "😆"] },
    
    // Pattern with alternating prime and composite numbers
    { type: "numbers", items: [3, 4, 5, "_", 7, "_"], missing: [3, 5], options: [6, 9, 8, 10] },
    
    // Increasing difficulty in arithmetic progression
    { type: "arithmetic", items: [5, 10, 20, "_", 80, "_"], missing: [3, 5], options: [30, 40, 50, 60] },
  
    // Monkey emoji pattern
    { type: "emoji", items: ["🐵", "🙈", "🙉", "🙊", "🐵"], missing: [1, 3], options: ["🐵", "🙊", "🙉", "🙈"] },
  
    // Moon phases pattern
    { type: "emoji", items: ["🌑", "🌒", "🌓", "🌔", "🌕"], missing: [1, 3], options: ["🌑", "🌔", "🌓", "🌒"] }
  ];
  

const Timer = ({ time, maxTime }) => (
  <Progress value={(time / maxTime) * 100} className="w-full h-2" />
);

const colors = ['bg-red-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200'];

const ColorTile = ({ item, color, onClick, selected, correct, showCorrect }) => (
  <button
    className={`w-24 h-24 rounded-md m-2 focus:outline-none transition-all ${color} flex items-center justify-center text-lg font-semibold
      ${selected ? 'ring-4 ring-blue-500' : ''}
      ${correct && showCorrect ? 'bg-green-500 ring-4 ring-green-500' : ''}
      ${selected && !correct && showCorrect ? 'bg-red-500 ring-4 ring-red-500' : ''}
    `}
    onClick={onClick}
    disabled={showCorrect}
  >
    {item}
  </button>
);

const PatternDisplay = ({ pattern, currentMissingIndex, onAnswerSelect, userAnswer, showCorrect }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center space-x-4">
        {pattern.items.map((item, index) => (
          <div key={index} className="text-2xl">
            {pattern.missing.includes(index) ? (
              index === pattern.missing[currentMissingIndex] ? (
                <span className="w-16 h-16 inline-flex items-center justify-center border-2 border-gray-300 rounded text-3xl">?</span>
              ) : (
                <span className="w-16 h-16 inline-flex items-center justify-center text-xl">{item}</span>
              )
            ) : (
              <span className="w-16 h-16 inline-flex items-center justify-center text-xl">{item}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center">
        {pattern.options.map((option, index) => (
          <ColorTile
            key={index}
            item={option}
            color={colors[index]}
            onClick={() => onAnswerSelect(option)}
            selected={userAnswer === option}
            correct={option === pattern.items[pattern.missing[currentMissingIndex]]}
            showCorrect={showCorrect}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [currentMissingIndex, setCurrentMissingIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [time, setTime] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    let timer;
    if (time > 0 && !gameOver && !showCorrect) {
      timer = setTimeout(() => setTime(time - 1), 1000);
    } else if (time === 0 || showCorrect) {
      handleSubmit();
    }
    return () => clearTimeout(timer);
  }, [time, gameOver, showCorrect]);

  const handleAnswerSelect = (answer) => {
    if (!showCorrect) {
      setUserAnswer(answer);
    }
  };

  const handleSubmit = () => {
    const pattern = patterns[currentPattern];
    const correct = userAnswer === pattern.items[pattern.missing[currentMissingIndex]];

    setShowCorrect(true);

    if (correct) {
      setScore(score + 1);
      setFeedback("Correct!");
    } else {
      setLives(lives - 1);
      setFeedback(userAnswer ? "Incorrect." : "Time's up!");
    }

    setTimeout(() => {
      setFeedback(null);
      setShowCorrect(false);
      if (currentMissingIndex < pattern.missing.length - 1) {
        setCurrentMissingIndex(currentMissingIndex + 1);
      } else {
        if (currentPattern < patterns.length - 1 && lives > 0) {
          setCurrentPattern(currentPattern + 1);
          setCurrentMissingIndex(0);
        } else {
          setGameOver(true);
        }
      }
      setUserAnswer(null);
      setTime(15);
    }, 2000);
  };

  const restartGame = () => {
    setCurrentPattern(0);
    setCurrentMissingIndex(0);
    setUserAnswer(null);
    setScore(0);
    setLives(3);
    setTime(15);
    setGameOver(false);
    setFeedback(null);
    setShowCorrect(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Pattern Recognition Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!gameOver ? (
            <>
              <div className="mb-6">
                <Timer time={time} maxTime={15} />
              </div>
              <PatternDisplay
                pattern={patterns[currentPattern]}
                currentMissingIndex={currentMissingIndex}
                onAnswerSelect={handleAnswerSelect}
                userAnswer={userAnswer}
                showCorrect={showCorrect}
              />
              <div className="mt-6 flex justify-between items-center text-xl">
                <span>Score: {score}</span>
                <span>Lives: {"❤️".repeat(Math.max(0, lives))}</span>
              </div>
              {feedback && (
                <div className={`mt-4 text-center font-bold text-xl ${feedback === "Correct!" ? "text-green-500" : "text-red-500"}`}>
                  {feedback}
                </div>
              )}
              <div className="mt-4 text-center">
                Pattern: {currentPattern + 1} / {patterns.length}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-6">Your final score: {score}</p>
              <Button onClick={restartGame} className="w-full text-lg py-2">
                Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}