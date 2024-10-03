import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardFooter, Button, Input, Label 
} from "@/components/ui/card";

// Components

const ChallengeMode = ({ table, setResult }) => {
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);

  useEffect(() => {
    const newProblems = Array.from({length: 20}, (_, i) => ({
      num1: table,
      num2: i + 1,
      userAnswer: null,
      correctAnswer: table * (i + 1)
    }));
    setProblems(newProblems);
    let timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        clearInterval(timer);
        setResult({ correct, incorrect });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [table, setResult]);

  const checkAnswer = () => {
    if (parseInt(userAnswer, 10) === problems[currentProblem].correctAnswer) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
    if (currentProblem + 1 < problems.length) {
      setCurrentProblem(currentProblem + 1);
      setUserAnswer('');
    } else {
      setResult({ correct, incorrect });
    }
  };

  if (timeLeft === 0) return <div>Time's up!</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Challenge: {table}x Table</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{problems[currentProblem]?.num1} x {problems[currentProblem]?.num2} = ?</p>
        <Input value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
        <Button onClick={checkAnswer} disabled={!userAnswer}>Submit</Button>
        <p>Time Left: {timeLeft}s</p>
      </CardContent>
    </Card>
  );
};

const PracticeMode = ({ table }) => {
  const [current, setCurrent] = useState(1);
  const [answer, setAnswer] = useState('');

  const check = () => {
    if (table * current === parseInt(answer, 10)) {
      alert('Correct!');
      if (current < 20) setCurrent(current + 1);
    } else {
      alert('Try again!');
    }
    setAnswer('');
  };

  return (
    <Card>
      <CardContent>
        <p>{table} x {current} = </p>
        <Input value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <Button onClick={check}>Check</Button>
      </CardContent>
    </Card>
  );
};

// Main App Component
export default function App() {
  const [mode, setMode] = useState('practice');
  const [table, setTable] = useState(2);
  const [result, setResult] = useState(null);

  const downloadResults = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(result)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "multiplication_results.txt";
    document.body.appendChild(element); 
    element.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Times Table Trainer</CardTitle>
        </CardHeader>
        <CardContent>
          <Label>Choose Table:</Label>
          <Input type="number" value={table} onChange={(e) => setTable(Number(e.target.value))} min="1" max="20" />
          <Button onClick={() => setMode(mode === 'practice' ? 'challenge' : 'practice')}>
            Switch to {mode === 'practice' ? 'Challenge' : 'Practice'} Mode
          </Button>
          {mode === 'practice' ? <PracticeMode table={table} /> : 
            !result ? <ChallengeMode table={table} setResult={setResult} /> : 
            <div>
              <p>Correct: {result.correct}</p>
              <p>Incorrect: {result.incorrect}</p>
              <Button onClick={downloadResults}>Download Results</Button>
              <Button onClick={() => setResult(null)}>Try Again</Button>
            </div>}
        </CardContent>
      </Card>
    </div>
  );
}