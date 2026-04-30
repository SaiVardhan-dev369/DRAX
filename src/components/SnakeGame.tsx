import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, Play, RotateCcw } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const TICK_RATE = 150; // ms

// Center of the grid
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const directionRef = useRef(direction);
  const lastRenderedDirRef = useRef(direction); // Prevents double-turn self-collision

  // Ref to hold active game state for the interval closure
  const stateRef = useRef({ snake, food, isPlaying, isGameOver, score });

  useEffect(() => {
    stateRef.current = { snake, food, isPlaying, isGameOver, score };
  }, [snake, food, isPlaying, isGameOver, score]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        return newFood;
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    lastRenderedDirRef.current = INITIAL_DIRECTION;
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPlaying(true);
  }, [generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
        if (stateRef.current.isPlaying) e.preventDefault();
      }

      if (!stateRef.current.isPlaying && !stateRef.current.isGameOver && (e.key === ' ' || e.key === 'Enter')) {
        setIsPlaying(true);
        return;
      }

      if (stateRef.current.isGameOver && (e.key === ' ' || e.key === 'Enter')) {
        resetGame();
        return;
      }

      const { x: lastX, y: lastY } = lastRenderedDirRef.current;
      let newDir = { ...directionRef.current };

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastY !== 1) newDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastY !== -1) newDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastX !== 1) newDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastX !== -1) newDir = { x: 1, y: 0 };
          break;
      }

      directionRef.current = newDir;
      setDirection(newDir);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetGame]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const moveSnake = () => {
      const { snake, food, score } = stateRef.current;
      const head = snake[0];
      const dir = directionRef.current;
      
      const newHead = {
        x: head.x + dir.x,
        y: head.y + dir.y,
      };

      // Wrap around walls (Neon portal effect)
      if (newHead.x < 0) newHead.x = GRID_SIZE - 1;
      if (newHead.x >= GRID_SIZE) newHead.x = 0;
      if (newHead.y < 0) newHead.y = GRID_SIZE - 1;
      if (newHead.y >= GRID_SIZE) newHead.y = 0;

      // Check collision with self
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        setIsPlaying(false);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [newHead, ...snake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(score + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      setSnake(newSnake);
      lastRenderedDirRef.current = dir;
    };

    const intervalId = setInterval(moveSnake, TICK_RATE);
    return () => clearInterval(intervalId);
  }, [isPlaying, isGameOver, highScore, generateFood]);

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Score Header */}
      <div className="flex w-full max-w-md justify-between items-end mb-4 px-2">
        <div className="flex flex-col">
          <span className="text-cyan-500/70 text-xs font-bold uppercase tracking-widest mb-1">Score</span>
          <span className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] leading-none">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-fuchsia-500/70 text-xs font-bold uppercase tracking-widest items-center gap-1 flex mb-1">
            <Trophy className="w-3 h-3" /> High
          </span>
          <span className="text-2xl font-bold text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)] leading-none">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative bg-gray-950 p-2 rounded-xl border border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.15)] flex justify-center w-full max-w-md aspect-square">
        
        {/* The Grid Array */}
        <div 
          className="grid w-full h-full bg-gray-900 border border-gray-800 relative z-0 overflow-hidden" 
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`, gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {/* Subtle grid background pattern */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)', 
                 backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%` 
               }}></div>

          {/* Render Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className="z-10"
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                }}
              >
                <div className={`w-full h-full rounded-[2px] transition-all duration-75
                    ${isHead 
                      ? 'bg-cyan-300 shadow-[0_0_12px_#67e8f9] scale-110 z-20 relative' 
                      : 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.6)] opacity-90 scale-95'
                    }`}
                />
              </div>
            );
          })}

          {/* Render Food */}
          <div
            className="z-10 flex items-center justify-center animate-pulse"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
            }}
          >
            <div className="w-[80%] h-[80%] rounded-full bg-fuchsia-500 shadow-[0_0_15px_#ec4899] rotate-45 transform" />
          </div>
        </div>

        {/* Overlays */}
        {!isPlaying && !isGameOver && (
          <div className="absolute inset-0 z-30 bg-gray-950/60 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="flex items-center gap-3 px-8 py-4 bg-cyan-500/10 border border-cyan-400 text-cyan-300 rounded-full hover:bg-cyan-500 hover:text-white hover:shadow-[0_0_30px_#22d3ee] transition-all group font-bold tracking-widest uppercase"
            >
              <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" /> Start Game
            </button>
            <p className="mt-4 text-cyan-500/60 text-sm font-mono text-center">
              Use ARROW KEYS or WASD to move<br/>Collect neon nodes
            </p>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 z-30 bg-gray-950/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center">
            <h2 className="text-4xl font-black text-rose-500 drop-shadow-[0_0_20px_#f43f5e] mb-2 uppercase tracking-widest">
              System Failure
            </h2>
            <p className="text-gray-300 font-mono mb-8">Final Score: <span className="text-cyan-400 font-bold">{score}</span></p>
            
            <button
              onClick={resetGame}
              className="flex items-center gap-3 px-8 py-4 bg-fuchsia-500/10 border border-fuchsia-400 text-fuchsia-300 rounded-full hover:bg-fuchsia-500 hover:text-white hover:shadow-[0_0_30px_#d946ef] transition-all group font-bold tracking-widest uppercase"
            >
              <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" /> Reboot System
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
