'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, Trophy, Share2, LightbulbOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GoogleAnalytics, sendGAEvent } from '@next/third-parties/google';

// --- GAME CONFIGURATION ---
const GRAVITY = 0.25; // Slower gravity (was 0.5)
const LAUNCH_SPEED_MIN = 14; // Higher jump (was 12)
const LAUNCH_SPEED_MAX = 18; // Higher jump
const HORIZONTAL_SPEED_MAX = 3; // Slower side-to-side (was 4)
const SPAWN_RATE = 1000; // Slower spawn (was 800)

interface FloatingItem {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  sliced: boolean;
  sliceAngle?: number;
  type: 'paddy' | 'ballot' | 'bomb' | 'road' | 'powercut';
}

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

const ITEM_EMOJIS = {
  paddy: '🌾',
  ballot: '🗳️',
  bomb: '💣',
  road: '🛣️',
  powercut: '💡'
};

const FAIL_MESSAGES = [
  "Ouch! Roadblock ahead!",
  "Power cut stopped the harvest!",
  "Opposition used a trap!",
  "Don't give up, the nation needs you!"
];

const FUNNY_MESSAGES = [
  'Voter Power! 💪',
  'Biryani for Everyone! 🍛',
  'Fast Internet loading... 🚀',
  'Digital Bangladesh 2.0! 💻',
  'No More Load Shedding! 💡',
  'Golden Harvest! 🌟'
];

const POLITICAL_RANKS = [
  { min: 0, max: 10, title: 'Tea Stall Talker' },
  { min: 11, max: 30, title: 'Union Parishad Candidate' },
  { min: 31, max: 70, title: 'Member of Parliament' },
  { min: 71, max: 150, title: 'Minister of Development' },
  { min: 151, max: Infinity, title: "The People's Leader" }
];

export default function PaddyProtector() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [funnyMessage, setFunnyMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [failText, setFailText] = useState('');

  const gameDataRef = useRef({
    items: [] as FloatingItem[],
    trail: [] as TrailPoint[],
    nextItemId: 0,
    lastSpawnTime: 0,
    animationFrameId: 0,
    audioContext: null as AudioContext | null,
    isSlicing: false
  });

  useEffect(() => {
    const stored = localStorage.getItem('paddyProtectorHighScore');
    if (stored) setHighScore(parseInt(stored));
  }, []);

  useEffect(() => {
    if (score > 0 && score % 10 === 0) {
      setFunnyMessage(FUNNY_MESSAGES[Math.floor(Math.random() * FUNNY_MESSAGES.length)]);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  }, [score]);

  const playSuccessSound = () => {
    const ctx = gameDataRef.current.audioContext;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    osc.start(); osc.stop(ctx.currentTime + 0.1);
  };

  const playFailSound = () => {
    const ctx = gameDataRef.current.audioContext;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
  };

  const startGame = () => {
    if (!gameDataRef.current.audioContext) {
      gameDataRef.current.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    setScore(0);
    setIsDark(false);
    setGameState('playing');
    gameDataRef.current.items = [];
    gameDataRef.current.trail = [];
    gameDataRef.current.lastSpawnTime = Date.now();
  };

  const endGame = () => {
    setGameState('gameover');
    setFailText(FAIL_MESSAGES[Math.floor(Math.random() * FAIL_MESSAGES.length)]);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('paddyProtectorHighScore', score.toString());
    }
    cancelAnimationFrame(gameDataRef.current.animationFrameId);
  };

  const spawnItem = (canvas: HTMLCanvasElement) => {
    const now = Date.now();
    if (now - gameDataRef.current.lastSpawnTime < SPAWN_RATE) return;

    gameDataRef.current.lastSpawnTime = now;
    const types: Array<'paddy' | 'ballot' | 'bomb' | 'road' | 'powercut'> = ['paddy', 'paddy', 'paddy', 'ballot', 'bomb', 'road', 'powercut'];
    const type = types[Math.floor(Math.random() * types.length)];

    gameDataRef.current.items.push({
      id: gameDataRef.current.nextItemId++,
      emoji: ITEM_EMOJIS[type],
      x: Math.random() * (canvas.width - 100) + 50,
      y: canvas.height + 50,
      vx: (Math.random() - 0.5) * HORIZONTAL_SPEED_MAX,
      vy: -(Math.random() * (LAUNCH_SPEED_MAX - LAUNCH_SPEED_MIN) + LAUNCH_SPEED_MIN),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      sliced: false,
      type
    });
  };

  const checkSlice = (x: number, y: number) => {
    const items = gameDataRef.current.items;
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (item.sliced) continue;
      const dx = x - item.x;
      const dy = y - item.y;
      if (Math.sqrt(dx * dx + dy * dy) < 50) {
        item.sliced = true;
        item.sliceAngle = Math.atan2(dy, dx);
        if (item.type === 'paddy' || item.type === 'ballot') {
          setScore(prev => prev + 1);
          playSuccessSound();
        } else if (item.type === 'powercut') {
            setIsDark(true);
            setTimeout(() => setIsDark(false), 2000);
            playFailSound();
        } else {
          playFailSound();
          endGame();
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (isDark) {
          ctx.fillStyle = 'rgba(0,0,0,0.85)';
          ctx.fillRect(0,0,canvas.width, canvas.height);
      }

      const now = Date.now();
      gameDataRef.current.trail = gameDataRef.current.trail.filter(p => now - p.timestamp < 300);

      if (gameDataRef.current.trail.length > 1) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(gameDataRef.current.trail[0].x, gameDataRef.current.trail[0].y);
        for (let i = 1; i < gameDataRef.current.trail.length; i++) {
          ctx.lineTo(gameDataRef.current.trail[i].x, gameDataRef.current.trail[i].y);
        }
        ctx.stroke();
      }

      spawnItem(canvas);
      const items = gameDataRef.current.items;
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.vy += GRAVITY;
        item.x += item.vx;
        item.y += item.vy;
        item.rotation += item.rotationSpeed;

        if (item.y > canvas.height + 100) { items.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        ctx.font = '55px Arial'; // Bigger emojis
        ctx.textAlign = 'center';
        
        if (item.sliced) {
            ctx.globalAlpha = 0.5;
            ctx.fillText(item.emoji, -10, 0);
            ctx.fillText(item.emoji, 10, 0);
        } else {
            ctx.fillText(item.emoji, 0, 0);
        }
        ctx.restore();
      }
      gameDataRef.current.animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(gameDataRef.current.animationFrameId);
    };
  }, [gameState, isDark]);

  const getRank = (s: number) => POLITICAL_RANKS.find(r => s >= r.min && s <= r.max)?.title || 'Citizen';

  return (
    <>
      <GoogleAnalytics gaId="G-GLC9ZDC7QV" />
      
      <div className="relative w-full h-screen overflow-hidden bg-emerald-50">
        <canvas
          ref={canvasRef}
          onPointerMove={(e) => {
              const rect = canvasRef.current?.getBoundingClientRect();
              if (rect) {
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  gameDataRef.current.trail.push({ x, y, timestamp: Date.now() });
                  checkSlice(x, y);
              }
          }}
          className="absolute inset-0 touch-none cursor-crosshair"
        />
  
        {isDark && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white text-center">
                    <LightbulbOff className="w-20 h-20 mx-auto animate-pulse" />
                    <h2 className="text-2xl font-bold">LOAD SHEDDING!</h2>
                </div>
            </div>
        )}
  
        {/* START SCREEN */}
        {gameState === 'start' && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-700/90 text-white p-6 text-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-black italic">DHANER SHISH<br/>HARVEST</h1>
              <p className="text-lg">Slice for Development, Avoid the Obstacles!</p>
              <Button onClick={startGame} className="bg-yellow-400 text-green-900 text-2xl px-10 py-8 font-black rounded-full hover:scale-110 transition-transform">
                START HARVESTING 🌾
              </Button>
            </div>
          </div>
        )}
  
        {/* PLAYING HUD */}
        {gameState === 'playing' && (
          <div className="absolute top-6 left-6 pointer-events-none">
            <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border-2 border-green-500">
              <p className="text-xs font-bold text-green-700">PADDY COLLECTED</p>
              <p className="text-4xl font-black text-green-900">{score}</p>
            </div>
          </div>
        )}
  
        {/* GAME OVER SCREEN */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white p-6 text-center z-50">
            <div className="bg-white text-gray-900 p-8 rounded-3xl max-w-sm w-full space-y-4">
              <h2 className="text-3xl font-black text-red-600">OH NO!</h2>
              <p className="text-gray-600 italic">"{failText}"</p>
              <div className="bg-green-100 p-4 rounded-xl">
                  <p className="text-sm font-bold text-green-800">YOUR RANK</p>
                  <p className="text-2xl font-black text-green-600 uppercase">{getRank(score)}</p>
              </div>
              <p className="text-5xl font-black">{score}</p>
              <Button onClick={startGame} className="w-full bg-green-600 text-white py-6 text-xl rounded-xl">TRY AGAIN 🔄</Button>
              <Button onClick={() => window.open(`https://wa.me/?text=I scored ${score} in the Paddy Harvest Game! Rank: ${getRank(score)}. Can you beat me?`)} variant="outline" className="w-full border-green-600 text-green-600">
                  <Share2 className="mr-2" /> Share Result
              </Button>
            </div>
          </div>
        )}
  
        {showMessage && (
          <div className="absolute bottom-20 w-full text-center animate-bounce pointer-events-none">
            <span className="bg-yellow-400 text-green-900 px-6 py-2 rounded-full font-black text-xl shadow-xl">{funnyMessage}</span>
          </div>
        )}
      </div>
    </>
  );
}
