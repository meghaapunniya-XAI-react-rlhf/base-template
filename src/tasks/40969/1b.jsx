import React, { useState } from 'react';
import { Slider, Button } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function NumberLine({ start, end, jumpStart, jumpEnd }) {
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex justify-between items-center w-full">
      {numbers.map((num, index) => (
        <div 
          key={num} 
          className={`w-8 h-8 rounded-full flex items-center justify-center 
            ${num >= jumpStart && num <= jumpEnd ? 'bg-blue-500 text-white' : 'bg-gray-200'}
            ${index === 0 || index === numbers.length - 1 ? 'font-bold' : ''}`}
        >
          {num}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(10);
  const [jumpStart, setJumpStart] = useState(1);
  const [jumpEnd, setJumpEnd] = useState(5);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [jumps, setJumps] = useState(0);

  const handleJump = () => {
    if (currentPosition === jumpEnd) {
      setCurrentPosition(jumpStart);
    } else {
      setCurrentPosition(prev => Math.min(prev + 1, jumpEnd));
    }
    setJumps(prev => prev + 1);
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-100 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle>Interactive Number Line</CardTitle>
          <CardDescription>Learn numbers with jumping!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">Start</label>
                <Slider 
                  defaultValue={[start]} 
                  max={20} 
                  min={1} 
                  onValueChange={(value) => setStart(value[0])} 
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">End</label>
                <Slider 
                  defaultValue={[end]} 
                  max={20} 
                  min={start + 1} 
                  onValueChange={(value) => setEnd(value[0])} 
                />
              </div>
            </div>
            <NumberLine start={start} end={end} jumpStart={jumpStart} jumpEnd={jumpEnd} />
            <div className="grid grid-cols-2 gap-4">
              <Input 
                type="number" 
                value={jumpStart} 
                onChange={(e) => setJumpStart(Math.max(start, Math.min(end, Number(e.target.value))))} 
                placeholder="Jump Start" 
              />
              <Input 
                type="number" 
                value={jumpEnd} 
                onChange={(e) => setJumpEnd(Math.max(start, Math.min(end, Number(e.target.value))))} 
                placeholder="Jump End" 
              />
            </div>
            <Button onClick={handleJump}>Jump!</Button>
            <p>Current Position: {currentPosition}</p>
            <p>Number of Jumps: {jumps}</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <CardTitle>How to Use</CardTitle>
          <CardDescription>
            - Adjust the **Start** and **End** sliders to set your number line range.
            - Set **Jump Start** and **Jump End** within the line's range.
            - Click **Jump!** to move along the number line.
            - Watch the number line highlight your journey!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;