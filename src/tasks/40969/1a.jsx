import React, { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription, CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const NumberLine = ({ start, end, jump, currentPosition }) => {
  const numbers = Array.from({length: end - start + 1}, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative w-full max-w-2xl">
        {numbers.map(num => (
          <div 
            key={num} 
            className={`absolute ${num === currentPosition ? 'text-blue-500' : ''}`} 
            style={{ 
              left: `${((num - start) / (end - start)) * 100}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {num}
          </div>
        ))}
        <div className="h-1 bg-gray-300 w-full"></div>
        <div 
          className="absolute h-4 w-4 bg-blue-500 rounded-full" 
          style={{ 
            left: `${((currentPosition - start) / (end - start)) * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
        ></div>
      </div>
    </div>
  );
};

function App() {
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(20);
  const [jumpStart, setJumpStart] = useState(1);
  const [jumpEnd, setJumpEnd] = useState(20);
  const [current, setCurrent] = useState(1);
  const [jumps, setJumps] = useState(0);

  const handleJump = (direction) => {
    let newPosition = current + (direction * (jumpEnd - jumpStart + 1));
    if (newPosition <= end && newPosition >= start) {
      setCurrent(newPosition);
      setJumps(prev => prev + 1);
    }
  };

  useEffect(() => {
    setCurrent(start); // Reset current position if start or end changes
    setJumps(0);
  }, [start, end]);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Number Line</CardTitle>
          <CardDescription>Learn about number sequences dynamically!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Slider 
              value={[start]} 
              onValueChange={(value) => setStart(value[0])} 
              min={1} max={20} step={1}
              className="col-span-1"
            />
            <Slider 
              value={[end]} 
              onValueChange={(value) => setEnd(value[0])} 
              min={1} max={20} step={1}
              className="col-span-1"
            />
          </div>
          <NumberLine start={start} end={end} jump={jumpEnd - jumpStart} currentPosition={current} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Input type="number" value={jumpStart} onChange={(e) => setJumpStart(Number(e.target.value))} min={start} max={end} />
            <Input type="number" value={jumpEnd} onChange={(e) => setJumpEnd(Number(e.target.value))} min={start} max={end} />
          </div>
          <div className="mt-4 flex justify-between">
            <Button onClick={() => handleJump(-1)}>Jump Backward</Button>
            <Button onClick={() => handleJump(1)}>Jump Forward</Button>
          </div>
          <p>Current Position: {current}</p>
          <p>Number of Jumps: {jumps}</p>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            How to use: Select your start and end points, choose where to jump from and to, then click to jump!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;