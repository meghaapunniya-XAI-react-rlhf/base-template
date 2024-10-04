import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Bird = ({ birdPosition }) => {
    return (
        <img
            src={"https://media.geeksforgeeks.org/wp-content/uploads/20231211115925/flappy_bird_by_jubaaj_d93bpnj.gif"}
            alt="bird"
            className="absolute w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] select-none"
            style={{
                left: `${birdPosition.x}%`,
                top: `${birdPosition.y}%`,
            }}
            draggable={true}
        />
    );
};

const Pipes = ({ pipePosition }) => {
    return (
        <img
            src={'https://media.geeksforgeeks.org/wp-content/uploads/20231211115753/6d2a698f31595a1.png'}
            alt="pipe"
            className="absolute w-[60px] sm:w-[100px] h-full"
            style={{
                left: `${pipePosition.x}%`,
                top: `${pipePosition.y}%`,
            }}
            draggable={true}
        />
    );
};

const App = () => {
    const [birdPosition, setBirdPosition] = useState({ x: 10, y: 50 });
    const [pipes, setPipes] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [firstGame, setFirstGame] = useState(true);

    const jumpSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2043/2043-preview.mp3');
    const gameOverSound = new Audio('https://assets.mixkit.co/active_storage/sfx/470/470-preview.mp3');

    const startGame = () => {
        setFirstGame(false);
        setGameOver(false);
        setGameStarted(true);
        setScore(0);
        setBirdPosition({ x: 10, y: 50 });
        setPipes([]);
    };

    const jump = () => {
        if (!gameOver && gameStarted) {
            setBirdPosition((prev) => ({
                ...prev,
                y: Math.max(prev.y - 15, 0), // Prevent bird from going out of the top
            }));
            jumpSound.play();
        }
    };

    const checkCollision = () => {
        const birdTop = birdPosition.y;
        const birdBottom = birdPosition.y + 10;
        const birdLeft = birdPosition.x;
        const birdRight = birdPosition.x + 10;

        pipes.forEach((pipe) => {
            const pipeTop = pipe.y;
            const pipeBottom = pipe.y + 75;
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + 15;

            const isColliding =
                birdRight > pipeLeft &&
                birdLeft < pipeRight &&
                birdBottom > pipeTop &&
                birdTop < pipeBottom;

            if (isColliding) {
                gameOverSound.play();
                setGameOver(true);
                setGameStarted(false);
            }
            if (birdLeft > pipeRight && !pipe.passed) {
                setScore((prevScore) => prevScore + 1);
                pipe.passed = true;
            }
        });

        if (birdBottom > 100 || birdTop < 0) {
            setGameOver(true);
            setGameStarted(false);
        }
    };

    useEffect(() => {
        checkCollision();
    }, [birdPosition, pipes, gameOver]);

    useEffect(() => {
        const gravity = setInterval(() => {
            if (gameStarted && !gameOver) {
                setBirdPosition((prev) => ({
                    ...prev,
                    y: Math.min(prev.y + 1, 90), // Prevent bird from falling below the bottom
                }));
                checkCollision();
            }
        }, 30);

        const pipeGenerator = setInterval(() => {
            if (!gameOver && gameStarted) {
                setPipes((prev) => [
                    ...prev,
                    { x: 100, y: Math.floor(Math.random() * 50), passed: false },
                ]);
            }
        }, 2000);

        const pipeMove = setInterval(() => {
            if (!gameOver && gameStarted) {
                setPipes((prev) =>
                    prev.map((pipe) => ({ ...pipe, x: pipe.x - 1 })).filter((pipe) => pipe.x > -15)
                );
            }
        }, 30);

        return () => {
            clearInterval(gravity);
            clearInterval(pipeGenerator);
            clearInterval(pipeMove);
        };
    }, [gameOver, gameStarted]);

    return (
        <div className='flex flex-col justify-center items-center h-screen px-4'>
            <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent mb-4'>Flappy Bird</h1>

            <div
                className={`relative w-full max-w-[600px] aspect-[3/4] shadow-2xl rounded-md overflow-hidden transition-all duration-500 
                ${gameOver ? 'bg-gradient-to-b from-[#ff6347] to-[#8b4513]' : 'bg-gradient-to-b from-[#63b3ed] to-[#68d391]'}`}
                onClick={jump}
            >
                {gameStarted ? (
                    <>
                        <Bird birdPosition={birdPosition} />
                        {pipes.map((pipe, index) => (
                            <Pipes key={index} pipePosition={pipe} />
                        ))}
                        <div className="absolute top-5 left-5 text-xl sm:text-2xl font-bold text-white">
                            Score: {score}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        {firstGame ? (
                            <Button className="bg-red-400 text-white hover:bg-red-600 font-semibold text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out" onClick={startGame}>
                                Start Game
                            </Button>
                        ) : (
                            <div className="text-center">
                                <div className="text-xl sm:text-2xl font-bold text-white mb-4">
                                    Game Over!
                                </div>
                                <Button className="bg-teal-400 text-white hover:bg-teal-600 font-semibold text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-md transition-all duration-200 ease-in-out" onClick={startGame}>
                                    Restart Game
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;