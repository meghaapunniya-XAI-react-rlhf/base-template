import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function App() {
  const [table, setTable] = useState(2);
  const [number, setNumber] = useState(1);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [mode, setMode] = useState('practice');
  const [timeLeft, setTimeLeft] = useState(30);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isChallengeActive, setIsChallengeActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isChallengeActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsChallengeActive(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isChallengeActive]);

  const checkAnswer = () => {
    const correctAnswer = table * number;
    if (parseInt(answer) === correctAnswer) {
      setIsCorrect(true);
      setCorrectCount(c => c + 1);
    } else {
      setIsCorrect(false);
      setIncorrectCount(c => c + 1);
    }
    if (mode === 'challenge') {
      setNumber((n) => (n < 20 ? n + 1 : 1));
    }
  };

  const nextQuestion = () => {
    setNumber((n) => (n < 20 ? n + 1 : 1));
    setAnswer('');
    setIsCorrect(null);
  };

  const prevQuestion = () => {
    setNumber((n) => (n > 1 ? n - 1 : 20));
    setAnswer('');
    setIsCorrect(null);
  };

  const startChallenge = () => {
    setIsChallengeActive(true);
    setTimeLeft(30);
    setCorrectCount(0);
    setIncorrectCount(0);
    setNumber(1);
  };

  const downloadResults = () => {
    const results = `Score: ${correctCount} correct, ${incorrectCount} incorrect in 30 seconds`;
    const blob = new Blob([results], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'times_table_results.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-4 sm:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Times Table Trainer</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={table.toString()} onValueChange={(value) => setTable(parseInt(value))} className="flex flex-wrap gap-2 mb-4">
            {[...Array(20)].map((_, i) => 
              <RadioGroupItem key={i+1} value={(i+1).toString()} id={`table-${i+1}`}>
                <Label htmlFor={`table-${i+1}`}>{i+1}</Label>
              </RadioGroupItem>
            )}
          </RadioGroup>
          <div className="flex justify-between items-center mb-4">
            <Button onClick={prevQuestion} disabled={mode === 'challenge' && !isChallengeActive}>Prev</Button>
            <div className="text-4xl">{table} x {number} = </div>
            <Button onClick={nextQuestion} disabled={mode === 'challenge' && !isChallengeActive}>Next</Button>
          </div>
          <div className="mb-4">
            <Input 
              type="number" 
              value={answer} 
              onChange={(e) => setAnswer(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder="Enter answer"
              className="text-center"
            />
          </div>
          {isCorrect === true && <p className="text-green-500 text-center">Correct!</p>}
          {isCorrect === false && <p className="text-red-500 text-center">Try again!</p>}
          <Button onClick={checkAnswer} className="w-full mt-2">Check Answer</Button>
          <div className="mt-4 flex justify-center">
            <Button onClick={() => setMode('practice')} variant={mode === 'practice' ? 'default' : 'outline'}>Practice</Button>
            <Button onClick={() => setMode('challenge')} variant={mode === 'challenge' ? 'default' : 'outline'} className="ml-2">Challenge</Button>
          </div>
          {mode === 'challenge' && isChallengeActive && (
            <p className="text-center mt-2">Time Left: {timeLeft}s</p>
          )}
        </CardContent>
        <CardFooter>
          {mode === 'challenge' && !isChallengeActive && (
            <div>
              <p className="text-center mb-2">
                You got {correctCount} correct and {incorrectCount} incorrect in 30 seconds!
              </p>
              <Button onClick={startChallenge} className="w-full mb-2">Try Again</Button>
              <Button onClick={downloadResults} className="w-full">Download Results</Button>
            </div>
          )}
          {mode === 'challenge' && !isChallengeActive && timeLeft === 30 && (
            <Button onClick={startChallenge} className="w-full">Start Challenge</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;