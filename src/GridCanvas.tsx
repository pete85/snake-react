import React, { useEffect, useRef, useState } from 'react';
import { appConfig } from './app-config.ts';

type Direction = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight' | null;
type Position = { x: number, y: number };

type GridCanvasProps = {
    setCount: React.Dispatch<React.SetStateAction<number>>;
    setLevel: React.Dispatch<React.SetStateAction<number>>;
    startTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
};

const SnakeGame: React.FC<GridCanvasProps> = ({ setCount, setLevel, startTimer, stopTimer, resetTimer }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [direction, setDirection] = useState<Direction>(null);
    const [snake, setSnake] = useState<Position[]>([{ x: 20, y: 20 }]);
    const [food, setFood] = useState<Position | null>(null);
    const [specialFood, setSpecialFood] = useState<Position | null>(null);
    const [foodCount, setFoodCount] = useState(0);
    const [speed, setSpeed] = useState(appConfig.gameStartSpeed);
    const [gameOver, setGameOver] = useState(false);

    const cellSize = appConfig.cellSize;
    const canvasSize = appConfig.canvasSize;

    // Draw the snake, food, and special food on the canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Clear previous drawing
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw the snake
                ctx.fillStyle = 'blue';
                snake.forEach((segment) => {
                    ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
                });

                // Draw the food
                if (food) {
                    ctx.fillStyle = 'green';
                    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
                }

                // Draw the special food
                if (specialFood) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(specialFood.x * cellSize, specialFood.y * cellSize, cellSize, cellSize);
                }
            }
        }
    }, [snake, food, specialFood]);

    // Handle movement on arrow key press
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                if (!direction) {
                    // Start movement and extend the snake to 3 segments
                    setDirection(event.key as Direction);
                    setSnake([
                        { x: 20, y: 20 },
                        { x: 19, y: 20 },
                        { x: 18, y: 20 },
                    ]);
                    resetTimer(); // Reset the timer before starting
                    startTimer(); // Start the timer when the snake starts moving
                } else if (
                    (event.key === 'ArrowUp' && direction !== 'ArrowDown') ||
                    (event.key === 'ArrowDown' && direction !== 'ArrowUp') ||
                    (event.key === 'ArrowLeft' && direction !== 'ArrowRight') ||
                    (event.key === 'ArrowRight' && direction !== 'ArrowLeft')
                ) {
                    // Update direction if not opposite of current direction
                    setDirection(event.key as Direction);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction]);

    // Game loop
    useEffect(() => {
        if (direction) {
            const interval = setInterval(() => {
                setSnake((prevSnake) => {
                    const newSnake = [...prevSnake];
                    const head = newSnake[0];

                    // Calculate new head position based on the direction
                    let newHead: Position;
                    switch (direction) {
                        case 'ArrowUp':
                            newHead = { x: head.x, y: head.y - 1 };
                            break;
                        case 'ArrowDown':
                            newHead = { x: head.x, y: head.y + 1 };
                            break;
                        case 'ArrowLeft':
                            newHead = { x: head.x - 1, y: head.y };
                            break;
                        case 'ArrowRight':
                        default:
                            newHead = { x: head.x + 1, y: head.y };
                            break;
                    }

                    // Check for collisions with the canvas edges or itself
                    if (
                        newHead.x < 0 ||
                        newHead.y < 0 ||
                        newHead.x * cellSize >= canvasSize ||
                        newHead.y * cellSize >= canvasSize ||
                        newSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
                    ) {
                        // Set gameOver flag instead of directly resetting the game
                        setGameOver(true);
                        return prevSnake;
                    }

                    // Check if the snake eats the food
                    if (food && newHead.x === food.x && newHead.y === food.y) {
                        newSnake.unshift(newHead); // Grow the snake by adding new head
                        setFood(null); // Remove the food after eating
                        setCount((prev) => prev + 1); // Increment the score by 1
                        setFoodCount((prev) => prev + 1);
                    } else if (specialFood && newHead.x === specialFood.x && newHead.y === specialFood.y) {
                        newSnake.unshift(newHead); // Grow the snake by adding new head
                        setSpecialFood(null); // Remove the special food after eating
                        setCount((prev) => prev + 3); // Increment the score by 3
                    } else {
                        // Add new head to snake and remove the tail
                        newSnake.unshift(newHead);
                        newSnake.pop();
                    }

                    return newSnake;
                });
            }, speed); // Use dynamic speed

            return () => clearInterval(interval);
        }
    }, [direction, food, specialFood, setCount, speed]);

    // Reset the game when gameOver is true
    useEffect(() => {
        if (gameOver) {
            setTimeout(() => {
                resetGame();
            }, 0);
        }
    }, [gameOver]);

    // Place food on the canvas after reset or when the game starts
    useEffect(() => {
        const placeFood = () => {
            const x = Math.floor(Math.random() * (canvasSize / cellSize));
            const y = Math.floor(Math.random() * (canvasSize / cellSize));
            setFood({ x, y });
        };

        placeFood(); // Place initial food

        const foodInterval = setInterval(placeFood, appConfig.foodInterval);

        return () => clearInterval(foodInterval);
    }, [gameOver]); // Run food placement when the game resets

    // Place special food every 5th regular food eaten
    useEffect(() => {
        if (foodCount > 0 && foodCount % 5 === 0) {
            const x = Math.floor(Math.random() * (canvasSize / cellSize));
            const y = Math.floor(Math.random() * (canvasSize / cellSize));
            setSpecialFood({ x, y });

            const timeout = setTimeout(() => {
                setSpecialFood(null);
            }, appConfig.specialFoodInterval); // Special food disappears after 8 seconds

            return () => clearTimeout(timeout);
        }
    }, [foodCount]);

    // Increase speed every minute
    useEffect(() => {
        const speedInterval = setInterval(() => {
            setSpeed((prevSpeed) => Math.max(prevSpeed - 20, 50)); // Increase speed by reducing interval time
            setLevel((prevLevel) => prevLevel + 1);
        }, appConfig.levelInterval);

        return () => clearInterval(speedInterval);
    }, [setLevel]);

    // Reset the game function
    const resetGame = () => {
        setDirection(null);
        setSnake([{ x: 20, y: 20 }]);
        setFood(null);
        setSpecialFood(null);
        setFoodCount(0);
        setSpeed(appConfig.gameStartSpeed);
        setCount(0);
        setLevel(1);
        stopTimer();
        resetTimer();
        setGameOver(false); // Reset the gameOver flag

        // Place new food after game reset
        const x = Math.floor(Math.random() * (canvasSize / cellSize));
        const y = Math.floor(Math.random() * (canvasSize / cellSize));
        setFood({ x, y });
    };

    return (
        <canvas
            ref={canvasRef}
            width={canvasSize}
            height={canvasSize}
            style={{ border: '1px solid #000' }}
        />
    );
};

export default SnakeGame;
