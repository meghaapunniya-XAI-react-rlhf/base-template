import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

function generateQuestion(table) {
    const multiplicand = Math.floor(Math.random() * 10) + 1;
    return { multiplicand, multiplier: table, answer: multiplicand * table };
}

function TimesTableTrainer() {
    const [mode, setMode] = useState("practice");
    const [table, setTable] = useState(2);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [userAnswer, setUserAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [timer, setTimer] = useState(30);
    const [isRunning, setIsRunning] = useState(false);
    const [score, setScore] = useState({ correct: 0, incorrect: 0, skipped: 0 });
    const [challengeComplete, setChallengeComplete] = useState(false);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    useEffect(() => {
        setQuestions(Array.from({ length: 10 }, () => generateQuestion(table)));
        setCurrentQuestionIndex(0);
        setUserAnswer("");
        setFeedback("");
        setScore({ correct: 0, incorrect: 0, skipped: 0 });
        setAnsweredQuestions([]);
    }, [table]);

    useEffect(() => {
        if (mode === "challenge") {
            setTimer(30);
            setIsRunning(false);
            setChallengeComplete(false);
            setQuestions(Array.from({ length: 10 }, () => generateQuestion(table)));
            setCurrentQuestionIndex(0);
            setAnsweredQuestions([]);
        }
    }, [mode]);

    useEffect(() => {
        let interval;
        if (isRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsRunning(false);
            setChallengeComplete(true);
        }
        return () => clearInterval(interval);
    }, [isRunning, timer]);

    const handleAnswerSubmit = (e) => {
        e.preventDefault();
        const isCorrect = parseInt(userAnswer) === questions[currentQuestionIndex].answer;
        setFeedback(isCorrect ? "Correct! Well done!" : `Incorrect. The correct answer is ${questions[currentQuestionIndex].answer}.`);

        if (isCorrect) {
            setScore((prevScore) => ({
                ...prevScore,
                correct: prevScore.correct + 1,
            }));
        } else {
            setScore((prevScore) => ({
                ...prevScore,
                incorrect: prevScore.incorrect + 1,
            }));
        }

        setAnsweredQuestions([...answeredQuestions, currentQuestionIndex]);

        if (mode === "practice") {
            setTimeout(() => {
                setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
                setUserAnswer("");
                setFeedback("");
            }, 1500);
        }
    };

    const startChallenge = () => {
        setIsRunning(true); 
        setScore({ correct: 0, incorrect: 0, skipped: 0 });
        setTimer(30); 
        setCurrentQuestionIndex(0); 
        setFeedback(""); 
        setAnsweredQuestions([]); 
        setChallengeComplete(false);
        setQuestions(Array.from({ length: 10 }, () => generateQuestion(table))); 
    };

    const downloadResults = () => {
        const results = `Correct Answers: ${score.correct}\nIncorrect Answers: ${score.incorrect}\nSkipped Questions: ${score.skipped}\nScore: ${((score.correct / questions.length) * 100).toFixed(2)}%`;
        const blob = new Blob([results], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'times-table-results.txt';
        link.click();
    };

    const handlePrevQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
        setUserAnswer("");
        setFeedback("");
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex === questions.length - 1) {
            setChallengeComplete(true);
            setIsRunning(false);
        } else {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setUserAnswer("");
            setFeedback("");
            if (!answeredQuestions.includes(currentQuestionIndex)) {
                setScore((prevScore) => ({
                    ...prevScore,
                    skipped: prevScore.skipped + 1,
                }));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 mx-auto w-full max-w-md sm:max-w-xl">
                <Card className="px-4 py-10 bg-white shadow-lg rounded-2xl sm:p-20 transform hover:scale-105 transition-transform duration-300">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                            Times Table Trainer
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Label htmlFor="mode" className="text-lg font-semibold">Mode</Label>
                            <RadioGroup
                                id="mode"
                                value={mode}
                                onValueChange={setMode}
                                className="flex space-x-4 mt-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="practice" id="practice" />
                                    <Label htmlFor="practice" className="text-md">Practice</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="challenge" id="challenge" />
                                    <Label htmlFor="challenge" className="text-md">Challenge</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="table" className="text-lg font-semibold">Choose a table</Label>
                            <Select value={table.toString()} onValueChange={(value) => setTable(parseInt(value))}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue>{table}x Table</SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    {[...Array(20)].map((_, i) => (
                                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                                            {i + 1}x Table
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {mode === "challenge" && !isRunning && !challengeComplete && (
                            <Button onClick={startChallenge} className="w-full mb-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
                                Start Challenge
                            </Button>
                        )}
                        {mode === "challenge" && isRunning && (
                            <div className="mb-4">
                                <Progress value={(timer / 30) * 100} className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-blue-500"
                                        style={{ width: `${(timer / 30) * 100}%` }}
                                    ></div>
                                </Progress>
                                <p className="text-center mt-2 font-semibold">Time left: {timer} seconds</p>
                            </div>
                        )}
                        {(mode === 'practice' || (isRunning && mode === 'challenge')) && questions.length > 0 && (
                            <form onSubmit={handleAnswerSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="question" className="text-xl font-bold">
                                        {questions[currentQuestionIndex].multiplicand} x {questions[currentQuestionIndex].multiplier} = ?
                                    </Label>
                                    <Input
                                        id="question"
                                        type="number"
                                        value={userAnswer}
                                        onChange={(e) => setUserAnswer(e.target.value)}
                                        className="mt-2 text-lg"
                                        placeholder="Enter your answer"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
                                    Submit
                                </Button>
                            </form> )
                        }
                        {feedback && (
                            <div className="mt-4">
                                <p className="text-center font-semibold text-lg" style={{ color: feedback.startsWith("Correct") ? "green" : "red" }}>{feedback}</p>
                            </div>
                        )}
                        {mode === "challenge" && isRunning && (
                            <div className="flex justify-between mt-4">
                                <Button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full">
                                 <span className="text-xl"> &lt; </span>
                                </Button>
                                <Button onClick={handleNextQuestion} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full">
                                <span className="text-xl"> &gt; </span>
                                </Button>
                            </div>
                        )}
                        {challengeComplete && (
                            <div className="mt-4 bg-gradient-to-r from-yellow-100 to-yellow-200 p-4 rounded-lg">
                                <h3 className="text-2xl font-bold text-center mb-2 text-purple-600">Challenge Results</h3>
                                <p className="text-lg">Correct Answers: <span className="font-bold text-green-600">{score.correct}</span></p>
                                <p className="text-lg">Incorrect Answers: <span className="font-bold text-red-600">{score.incorrect}</span></p>
                                <p className="text-lg">Skipped Questions: <span className="font-bold text-yellow-600">{score.skipped}</span></p>
                                <p className="text-xl font-bold mt-2">
                                    Score: <span className="text-blue-600">{((score.correct / questions.length) * 100).toFixed(2)}%</span>
                                </p>
                                <Button onClick={startChallenge} className="w-full mt-4 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
                                    Try Again
                                </Button>
                                <Button onClick={downloadResults} className="w-full mt-2 bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105">
                                    Download Results
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default TimesTableTrainer;