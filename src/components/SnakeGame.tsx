import React, { useState, useRef, useEffect, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving UP initially
const TICK_RATE_MS = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const dirRef = useRef(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Make sure food doesn't spawn ON the snake
      const isOnSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    dirRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setHasStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Prevent scrolling when playing
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key) && !gameOver) {
        e.preventDefault();
      }

      if (!hasStarted && !gameOver && ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
         setHasStarted(true);
      }

      switch (key) {
        case 'arrowup':
        case 'w':
          if (dirRef.current.y === 0) dirRef.current = { x: 0, y: -1 }; break;
        case 'arrowdown':
        case 's':
          if (dirRef.current.y === 0) dirRef.current = { x: 0, y: 1 }; break;
        case 'arrowleft':
        case 'a':
          if (dirRef.current.x === 0) dirRef.current = { x: -1, y: 0 }; break;
        case 'arrowright':
        case 'd':
          if (dirRef.current.x === 0) dirRef.current = { x: 1, y: 0 }; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, hasStarted]);

  useEffect(() => {
    if (gameOver || !hasStarted) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const newHead = {
          x: head.x + dirRef.current.x,
          y: head.y + dirRef.current.y
        };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // remove tail if no food eaten
        }

        return newSnake;
      });
    }, TICK_RATE_MS);

    return () => clearInterval(interval);
  }, [gameOver, hasStarted, food, generateFood]);

  return (
    <div className="flex flex-col items-center group">
      <div className="flex justify-between items-end w-full max-w-[500px] mb-4 px-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Session Score</span>
          <span className="text-2xl font-mono font-bold text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.6)]">
            {score.toString().padStart(5, '0')}
          </span>
        </div>
        <div className="text-xs font-mono text-slate-500 hidden sm:flex gap-4">
          <div className="px-3 py-1.5 bg-[#05050a] border border-slate-800 rounded shadow-sm"><span className="text-slate-300">W/A/S/D</span> MOVE</div>
        </div>
      </div>

      <div className="w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] relative bg-[#0a0a12] border-4 border-slate-900 shadow-[0_0_100px_rgba(0,0,0,1),0_0_20px_rgba(163,230,53,0.1)] rounded-sm overflow-hidden">
        
        {/* Scanlines Effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none z-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)', backgroundSize: '100% 4px' }}></div>
        <div className="absolute top-2 left-3 text-[9px] font-mono text-lime-400/40 z-10 pointer-events-none">CPU_TEMP: 42°C // MEM_LOAD: 12%</div>

        {/* Snake rendering */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={index}
              className={`absolute transition-all duration-75 ${
                isHead 
                  ? 'bg-lime-400 shadow-[0_0_15px_#39ff14] z-10' 
                  : 'bg-lime-500/90 shadow-[0_0_5px_rgba(163,230,53,0.5)]'
              }`}
              style={{ 
                left: `${(segment.x / GRID_SIZE) * 100}%`, 
                top: `${(segment.y / GRID_SIZE) * 100}%`,
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                borderRadius: isHead ? '2px' : '0px'
              }}
            />
          );
        })}

        {/* Food rendering */}
        <div
          className="absolute bg-fuchsia-500 shadow-[0_0_20px_#d946ef] rounded-full animate-pulse z-0"
          style={{ 
            left: `${(food.x / GRID_SIZE) * 100}%`, 
            top: `${(food.y / GRID_SIZE) * 100}%`,
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            transform: 'scale(0.8)'
          }}
        />

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px] z-20">
            <div className="text-lime-400 font-bold tracking-widest animate-pulse drop-shadow-[0_0_8px_rgba(163,230,53,0.8)] text-lg sm:text-xl font-mono">
              PRESS ANY KEY
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-[#0a0a12]/90 flex flex-col items-center justify-center backdrop-blur-sm z-20">
            <h3 className="text-3xl sm:text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-indigo-500 drop-shadow-[0_0_10px_rgba(192,38,211,0.5)] mb-2">
              SYSTEM FAILURE
            </h3>
            <p className="text-slate-400 mb-8 font-mono tracking-widest text-sm">
              SCORE: <span className="text-lime-400 ml-2">{score}</span>
            </p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold tracking-[0.2em] rounded shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-all font-sans text-xs"
            >
              REBOOT
            </button>
          </div>
        )}
      </div>
      
      <div className="flex sm:hidden gap-4 mt-6">
        <div className="px-4 py-2 bg-[#05050a] border border-slate-800 rounded shadow-sm text-xs font-mono text-slate-500"><span className="text-slate-300">W/A/S/D</span> MOVE</div>
      </div>
    </div>
  );
}
