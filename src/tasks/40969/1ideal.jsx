import React, { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NumberLine = ({ start, end, jumpStart, jumpEnd }) => {
    const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    return (
        <div className="relative h-16 w-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-300"></div>
            {numbers.map((num) => (
                <div
                    key={num}
                    className="absolute top-0 h-3 w-0.5 bg-gray-500"
                    style={{ left: `${((num - start) / (end - start)) * 100}%` }}
                >
                    <span className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs">
                        {num}
                    </span>
                </div>
            ))}
            {jumpStart !== null && jumpEnd !== null && (
                <div
                    className="absolute top-0 h-3 bg-green-500 transition-all duration-500"
                    style={{
                        left: `${((jumpStart - start) / (end - start)) * 100}%`,
                        width: `${((jumpEnd - jumpStart) / (end - start)) * 100}%`,
                    }}
                ></div>
            )}
        </div>
    );
};

const Frog = ({ position, isJumping }) => (
    <div
        className={`absolute top-4 w-8 h-8 transition-all duration-500 ${isJumping ? "animate-jump" : ""
            }`}
        style={{ left: `${position}%` }}
    >
        🐸
    </div>
);

export default function App() {
    const [lineStart, setLineStart] = useState(1);
    const [lineEnd, setLineEnd] = useState(10);
    const [jumpStart, setJumpStart] = useState("");
    const [jumpEnd, setJumpEnd] = useState("");
    const [jumpCount, setJumpCount] = useState(0);
    const [frogPosition, setFrogPosition] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(null);

    useEffect(() => {
        if (jumpStart !== "") {
            const start = Number(jumpStart);
            setCurrentPosition(start);
            setFrogPosition(calculateFrogPosition(start));
            setJumpCount(0);
        }
    }, [jumpStart, lineStart, lineEnd]);

    const calculateFrogPosition = (position) => {
        return ((position - lineStart) / (lineEnd - lineStart)) * 100;
    };

    const handleLineChange = (values) => {
        setLineStart(values[0]);
        setLineEnd(values[1]);
        setJumpStart("");
        setJumpEnd("");
        setCurrentPosition(null);
        setFrogPosition(0);
        setJumpCount(0);
    };

    const handleJumpStartChange = (value) => {
        const numValue = Number(value);
        if (value === "" || (numValue >= lineStart && numValue <= lineEnd)) {
            setJumpStart(value);
            if (currentPosition === null) {
                setCurrentPosition(numValue);
                setFrogPosition(calculateFrogPosition(numValue));
            }
        }
    };

    const handleJumpEndChange = (value) => {
        const numValue = Number(value);
        if (value === "" || (numValue >= lineStart && numValue <= lineEnd)) {
            setJumpEnd(value);
        }
    };

    const handleJump = () => {
        if (currentPosition !== null && jumpEnd !== "" && currentPosition !== Number(jumpEnd)) {
            setJumpCount(0);
            jumpToEnd(currentPosition);
        }
    };

    const jumpToEnd = (position) => {
        if (position !== Number(jumpEnd)) {
            const direction = Number(jumpEnd) > position ? 1 : -1;
            const nextPosition = position + direction;

            setIsJumping(true);

            setTimeout(() => {
                setCurrentPosition(nextPosition);
                setFrogPosition(calculateFrogPosition(nextPosition));
                setJumpCount(prevCount => prevCount + 1);
                setIsJumping(false);

                setTimeout(() => {

                    if (nextPosition !== Number(jumpEnd)) {
                        jumpToEnd(nextPosition);
                    }
                }, 250); // Half of the animation duration
            }, 500);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Number Line Jump Tutorial
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Step 1: Set the Number Line</h2>
                        <Slider
                            min={1}
                            max={20}
                            step={1}
                            value={[lineStart, lineEnd]}
                            onValueChange={handleLineChange}
                            className="w-full"
                        />
                    </div>

                    <div className="relative">
                        <NumberLine
                            start={lineStart}
                            end={lineEnd}
                            jumpStart={Number(jumpStart) || null}
                            jumpEnd={Number(jumpEnd) || null}
                        />
                        <Frog position={frogPosition} isJumping={isJumping} />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Step 2: Set Jump Points</h2>
                        <div className="flex space-x-2">
                            <Input
                                type="number"
                                placeholder="Start"
                                value={jumpStart}
                                onChange={(e) => handleJumpStartChange(e.target.value)}
                                className="w-24"
                            />
                            <Input
                                type="number"
                                placeholder="End"
                                value={jumpEnd}
                                onChange={(e) => handleJumpEndChange(e.target.value)}
                                className="w-24"
                            />
                            <Button
                                onClick={handleJump}
                                disabled={!jumpStart || !jumpEnd || jumpStart === jumpEnd || isJumping}
                            >
                                Jump!
                            </Button>
                        </div>
                    </div>

                    {jumpStart !== '' && jumpEnd !== 0 ? <div className="text-center flex justify-around">
                        <p className="text-lg"><strong>Current Position:</strong> {currentPosition}</p>
                        <p className="text-lg"><strong>Number of Jumps:</strong> {jumpCount}</p>
                    </div>
                        : <></>}

                    <div className="bg-blue-100 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold mb-2">How to Use:</h2>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Set the start and end of the number line using the slider.</li>
                            <li>Enter the starting point to move the frog to that position.</li>
                            <li>Enter the ending point for your jump.</li>
                            <li>Click "Jump!" to see the frog automatically jump to the end point.</li>
                            <li>Watch the frog move and observe its current position!</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>

            <style jsx="true" global="true">{`
          @keyframes jump {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .animate-jump {
            animation: jump 0.5s ease-in-out;
          }
        `}</style>
        </div>
    );
}

