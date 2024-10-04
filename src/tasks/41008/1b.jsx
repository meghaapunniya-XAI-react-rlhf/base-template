import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";

const BIRD_SIZE = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [birdY, setBirdY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let animationFrameId;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const updateGame = () => {
      // Update bird position
      setVelocity(prev => prev + GRAVITY);
      setBirdY(prev => Math.min(prev + velocity, canvas.height - BIRD_SIZE));

      // Update and generate pipes
      setPipes(prevPipes => {
        let newPipes = prevPipes.map(pipe => ({...pipe, x: pipe.x - 2}));
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < canvas.width - 200) {
          const newPipe = {
            x: canvas.width,
            height: Math.random() * (canvas.height - PIPE_GAP * 2) + PIPE_GAP,
          };
          newPipes.push(newPipe);
        }
        if (newPipes[0] && newPipes[0].x + PIPE_WIDTH <= 0) {
          newPipes.shift();
          setScore(prev => prev + 1);
        }
        return newPipes;
      });

      // Check collision
      if (pipes.some(pipe => 
        birdY < pipe.height || birdY + BIRD_SIZE > pipe.height + PIPE_GAP ||
        (pipe.x < BIRD_SIZE && pipe.x + PIPE_WIDTH > 0)
      ) || birdY + BIRD_SIZE >= canvas.height) {
        setGameOver(true);
        return;
      }

      // Draw everything
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'yellow';
      ctx.fillRect(50, birdY, BIRD_SIZE, BIRD_SIZE);
      pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + PIPE_GAP, PIPE_WIDTH, canvas.height);
      });

      animationFrameId = requestAnimationFrame(updateGame);
    };

    updateGame();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, gameOver, birdY, velocity, pipes]);

  const jump = () => {
    if (!gameOver) setVelocity(JUMP_STRENGTH);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setBirdY(200);
    setVelocity(0);
    setPipes([{ x: 300, height: 200 }]);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-300 sm:bg-blue-400">
      {!gameStarted ? (
        <Button onClick={startGame}>Start Game</Button>
      ) : gameOver ? (
        <div>
          <p>Game Over! Score: {score}</p>
          <Button onClick={startGame}>Restart</Button>
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          width="300" 
          height="500" 
          onClick={jump}
          className="border border-black bg-blue-100"
        />
      )}
      {gameStarted && !gameOver && <p>Score: {score}</p>}
    </div>
  );
}

export default App;