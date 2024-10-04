// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const PIPE_WIDTH = 52;
const GRAVITY = 0.25;
const JUMP_VELOCITY = -4.6;
const PIPE_SPEED = 2;

const useGameLogic = () => {
  const [birdPos, setBirdPos] = useState({ x: 50, y: 150 });
  const [pipes, setPipes] = useState([{ x: 400, gapY: 200 }]);
  const [isGameOver, setIsGameOver] = useState(true);
  const [score, setScore] = useState(0);
  const birdRef = useRef(null);

  useEffect(() => {
    let timeId;
    if (!isGameOver) {
      timeId = setInterval(() => {
        setBirdPos(prev => {
          let newY = prev.y + GRAVITY;
          if (newY > 300 - BIRD_HEIGHT || newY < 0) {  // Assuming ground height
            setIsGameOver(true);
          }
          return { ...prev, y: newY };
        });
        setPipes(prevPipes => 
          prevPipes.map(pipe => ({
            ...pipe,
            x: pipe.x - PIPE_SPEED
          }))
        );
      }, 24);

      // Check for collision or scoring
      if (birdRef.current) {
        const birdRect = birdRef.current.getBoundingClientRect();
        pipes.forEach(pipe => {
          if (pipe.x < birdRect.left + BIRD_WIDTH && 
              pipe.x + PIPE_WIDTH > birdRect.left) {
            if (birdRect.top < pipe.gapY || birdRect.bottom > pipe.gapY + 100) { // 100 is gap size
              setIsGameOver(true);
            } else if (pipe.x + PIPE_WIDTH === birdRect.left) {
              setScore(prevScore => prevScore + 1);
            }
          }
        });
      }
    }

    return () => clearInterval(timeId);
  }, [isGameOver, pipes]);

  useEffect(() => {
    if (!isGameOver && pipes[pipes.length - 1].x < 300) {
      const gapY = Math.random() * 200 + 50; // Random gap position
      setPipes(prev => [...prev, { x: 500, gapY }]);
    }
  }, [pipes, isGameOver]);

  const jump = () => {
    if (isGameOver) {
      resetGame();
    } else {
      setBirdPos(prev => ({ ...prev, y: prev.y + JUMP_VELOCITY }));
    }
  };

  const resetGame = () => {
    setBirdPos({ x: 50, y: 150 });
    setPipes([{ x: 400, gapY: 200 }]);
    setScore(0);
    setIsGameOver(false);
  };

  return { birdPos, pipes, isGameOver, jump, score };
};

function App() {
  const { birdPos, pipes, isGameOver, jump, score } = useGameLogic();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-400">
      <div 
        className="relative bg-blue-500 w-80 h-96 border border-black overflow-hidden"
        onClick={jump}
        tabIndex="0"
        onKeyDown={(e) => e.key === ' ' && jump()}
      >
        {!isGameOver ? (
          <>
            <div ref={birdRef} style={{ 
              left: birdPos.x, 
              top: birdPos.y, 
              position: 'absolute',
              width: BIRD_WIDTH, 
              height: BIRD_HEIGHT, 
              background: 'yellow' // Placeholder for bird graphic
            }}></div>
            {pipes.map((pipe, idx) => (
              <div key={idx} style={{ 
                left: pipe.x, 
                position: 'absolute',
                width: PIPE_WIDTH,
                top: 0,
                height: pipe.gapY,
                background: 'green' // Placeholder for pipe graphic
              }}></div>
            ))}
          </>
        ) : (
          <div className="text-center p-4">
            <h1 className="text-2xl">Game Over</h1>
            <p>Score: {score}</p>
            <Button onClick={resetGame}>Restart</Button>
          </div>
        )}
      </div>
      <p className="mt-2">Score: {score}</p>
    </div>
  );
}

export default App;