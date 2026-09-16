import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ActivePowerUp,
  Collectible,
  Costume,
  FloatingText,
  LevelConfig,
  Obstacle,
  Particle,
  PlayerState,
  PowerUpType,
} from '../types';
import { drawCartoonCharacter } from './characterRenderer';
import { drawCollectible, drawEnvironmentBackground, drawObstacle } from './environmentRenderer';
import { sound } from '../services/soundService';

interface GameCanvasProps {
  level: LevelConfig;
  costume: Costume;
  onGameOver: (score: number, coinsEarned: number, distance: number) => void;
  onVictory: (score: number, coinsEarned: number, stars: number) => void;
  onPause: () => void;
  isPaused: boolean;
}

const VIRTUAL_WIDTH = 1280;
const VIRTUAL_HEIGHT = 720;
const GROUND_Y = 610;

export const GameCanvas: React.FC<GameCanvasProps> = ({
  level,
  costume,
  onGameOver,
  onVictory,
  onPause,
  isPaused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // HUD and Reactive state
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [distance, setDistance] = useState<number>(0);
  const [activePowerUp, setActivePowerUp] = useState<ActivePowerUp | null>(null);
  const [selfieFlash, setSelfieFlash] = useState<boolean>(false);
  const [cleanlinessBonus, setCleanlinessBonus] = useState<number>(100);

  // Internal game engine references
  const gameStateRef = useRef({
    cameraX: 0,
    currentSpeed: level.baseSpeed,
    distanceMeters: 0,
    score: 0,
    coins: 0,
    lives: 3,
    activePowerUp: null as ActivePowerUp | null,
    cleanlinessBonus: 100,
    screenShake: 0,
    animationTick: 0,
    isFinished: false,
    player: {
      x: 180,
      y: GROUND_Y - 75,
      vy: 0,
      width: 48,
      height: 75,
      isGrounded: true,
      isJumping: false,
      isDucking: false,
      isInvincible: false,
      invincibleTimer: 0,
      runFrame: 0,
      facingDirection: 1,
    } as PlayerState,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    nextObstacleDist: 400,
    nextCollectibleDist: 200,
  });

  // Touch touch gesture coordinates
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Input triggers
  const triggerJump = useCallback(() => {
    const s = gameStateRef.current;
    if (s.isFinished || isPaused) return;

    if (level.spaceFlightMechanic) {
      // Space level: rocket thruster tap
      s.player.vy = -10;
      sound.playJump();
      // Thruster particles
      for (let i = 0; i < 6; i++) {
        s.particles.push({
          x: s.player.x + 10,
          y: s.player.y + s.player.height,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 5 + 3,
          size: Math.random() * 4 + 3,
          color: '#f97316',
          alpha: 1,
          life: 0,
          maxLife: 20,
        });
      }
      return;
    }

    if (s.player.isGrounded) {
      s.player.vy = -15.5;
      s.player.isGrounded = false;
      s.player.isJumping = true;
      s.player.isDucking = false;
      sound.playJump();

      // Jump dust puff
      for (let i = 0; i < 5; i++) {
        s.particles.push({
          x: s.player.x + 20,
          y: GROUND_Y,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 3,
          size: Math.random() * 4 + 2,
          color: '#e2e8f0',
          alpha: 0.8,
          life: 0,
          maxLife: 25,
        });
      }
    }
  }, [level.spaceFlightMechanic, isPaused]);

  const triggerDuck = useCallback((isDown: boolean) => {
    const s = gameStateRef.current;
    if (s.isFinished || isPaused) return;
    s.player.isDucking = isDown;
    if (isDown) {
      s.player.height = 42;
      s.player.y = GROUND_Y - 42;
    } else {
      s.player.height = 75;
      s.player.y = GROUND_Y - 75;
    }
  }, [isPaused]);

  const triggerMove = useCallback((deltaX: number) => {
    const s = gameStateRef.current;
    if (s.isFinished || isPaused) return;
    s.player.x = Math.max(80, Math.min(600, s.player.x + deltaX));
  }, [isPaused]);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        triggerJump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        triggerDuck(true);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        triggerMove(-30);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        triggerMove(30);
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault();
        onPause();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        triggerDuck(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerJump, triggerDuck, triggerMove, onPause]);

  // Touch & Swipe Event Handlers on Canvas
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const diffY = touch.clientY - touchStartRef.current.y;
    const diffX = touch.clientX - touchStartRef.current.x;

    if (diffY < -35) {
      triggerJump();
      touchStartRef.current = null;
    } else if (diffY > 35) {
      triggerDuck(true);
      touchStartRef.current = null;
    } else if (diffX > 40) {
      triggerMove(35);
      touchStartRef.current = null;
    } else if (diffX < -40) {
      triggerMove(-35);
      touchStartRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    triggerDuck(false);
    touchStartRef.current = null;
  };

  // Main 60 FPS Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const gameLoop = () => {
      const state = gameStateRef.current;

      if (!isPaused && !state.isFinished) {
        state.animationTick++;

        // Calculate current speed & modifier from power-ups
        let effectiveSpeed = state.currentSpeed;
        if (state.activePowerUp?.type === 'chai') {
          effectiveSpeed *= 1.6; // Chai Boost speedup
        } else if (state.activePowerUp?.type === 'namaste') {
          effectiveSpeed *= 0.5; // Obstacles slowed down
        } else if (state.activePowerUp?.type === 'rocket') {
          effectiveSpeed *= 2.0; // Rocket launch speed
        }

        // Advance Camera & Distance
        state.cameraX += effectiveSpeed;
        state.distanceMeters += effectiveSpeed * 0.05;

        // Passive score from distance
        state.score += Math.round(effectiveSpeed * 0.2);

        // Update active power-up timer
        if (state.activePowerUp) {
          state.activePowerUp.timeLeft -= 1 / 60;
          if (state.activePowerUp.timeLeft <= 0) {
            state.activePowerUp = null;
            setActivePowerUp(null);
          }
        }

        // Screen shake decay
        if (state.screenShake > 0) {
          state.screenShake *= 0.85;
          if (state.screenShake < 0.5) state.screenShake = 0;
        }

        // Invincibility timer decay
        if (state.player.isInvincible) {
          state.player.invincibleTimer -= 1 / 60;
          if (state.player.invincibleTimer <= 0) {
            state.player.isInvincible = false;
          }
        }

        // PHYSICS UPDATE
        if (level.spaceFlightMechanic) {
          // Space level anti-gravity physics
          state.player.y += state.player.vy;
          state.player.vy += 0.35; // Light gravity
          if (state.player.y > GROUND_Y - state.player.height) {
            state.player.y = GROUND_Y - state.player.height;
            state.player.vy = 0;
            state.player.isGrounded = true;
          } else if (state.player.y < 50) {
            state.player.y = 50;
            state.player.vy = 0;
          }
        } else {
          // Standard platform physics
          if (!state.player.isGrounded) {
            state.player.y += state.player.vy;
            state.player.vy += 0.72; // Gravity
            if (state.player.y >= GROUND_Y - state.player.height) {
              state.player.y = GROUND_Y - state.player.height;
              state.player.vy = 0;
              state.player.isGrounded = true;
              state.player.isJumping = false;
            }
          }
        }

        // DYNAMIC OBSTACLE SPAWNER
        if (state.distanceMeters >= state.nextObstacleDist * 0.05) {
          spawnRandomObstacle(state, level);
          const gap = Math.max(380, 750 - state.distanceMeters * 0.3);
          state.nextObstacleDist += gap + Math.random() * 250;
        }

        // DYNAMIC COLLECTIBLE SPAWNER
        if (state.distanceMeters >= state.nextCollectibleDist * 0.05) {
          spawnRandomCollectible(state, level);
          state.nextCollectibleDist += 220 + Math.random() * 180;
        }

        // MOVE & UPDATE OBSTACLES
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
          const obs = state.obstacles[i];
          obs.x -= effectiveSpeed;

          // Check Collision with Player
          if (
            !state.player.isInvincible &&
            checkAABBCollision(state.player, obs)
          ) {
            if (state.activePowerUp?.type === 'rocket') {
              // Rocket crushes obstacle with starburst!
              state.obstacles.splice(i, 1);
              createExplosionParticles(state, obs.x + obs.width / 2, obs.y + obs.height / 2, '#fde047');
              state.score += 250;
              sound.playHit();
              addFloatingText(state, obs.x, obs.y, '+250 CRUSH! 🚀', '#fde047');
              continue;
            }

            // Normal Hit!
            state.lives -= 1;
            setLives(state.lives);
            sound.playHit();
            state.screenShake = 16;
            state.player.isInvincible = true;
            state.player.invincibleTimer = 1.8; // 1.8s invulnerability
            addFloatingText(state, state.player.x, state.player.y - 20, 'OUCH! 💔', '#ef4444');

            if (state.lives <= 0) {
              state.isFinished = true;
              sound.playHit();
              onGameOver(state.score, state.coins, Math.round(state.distanceMeters));
              return;
            }
          }

          // Remove off-screen obstacles
          if (obs.x + obs.width < -100) {
            state.obstacles.splice(i, 1);
          }
        }

        // MOVE & UPDATE COLLECTIBLES
        for (let i = state.collectibles.length - 1; i >= 0; i--) {
          const col = state.collectibles[i];
          col.x -= effectiveSpeed;

          // Chai Boost magnet pull
          if (state.activePowerUp?.type === 'chai') {
            const dx = state.player.x - col.x;
            const dy = state.player.y - col.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 260) {
              col.x += (dx / dist) * 12;
              col.y += (dy / dist) * 12;
            }
          }

          // Check Collection
          if (!col.collected && checkAABBCollision(state.player, col)) {
            col.collected = true;
            createCollectionSparkles(state, col.x, col.y, '#eab308');

            if (col.type === 'coin') {
              state.coins += 1;
              state.score += 50;
              setCoins(state.coins);
              sound.playCoin();
              addFloatingText(state, col.x, col.y, '+50', '#eab308');
            } else if (col.type === 'chai_cup') {
              state.activePowerUp = { type: 'chai', duration: 7, timeLeft: 7 };
              setActivePowerUp(state.activePowerUp);
              sound.playChaiBoost();
              addFloatingText(state, col.x, col.y, '☕ CHAI SPEED!', '#f97316');
            } else if (col.type === 'namaste_lotus') {
              state.activePowerUp = { type: 'namaste', duration: 8, timeLeft: 8 };
              setActivePowerUp(state.activePowerUp);
              sound.playNamasteChime();
              addFloatingText(state, col.x, col.y, '🙏 NAMASTE PEACE!', '#eab308');
            } else if (col.type === 'camera_selfie') {
              sound.playSelfieCamera();
              state.score += 500;
              setSelfieFlash(true);
              setTimeout(() => setSelfieFlash(false), 200);
              addFloatingText(state, col.x, col.y, '📸 SELFIE BONUS! +500', '#38bdf8');
            } else if (col.type === 'rocket_fuel') {
              state.activePowerUp = { type: 'rocket', duration: 6, timeLeft: 6 };
              setActivePowerUp(state.activePowerUp);
              sound.playRocketBoost();
              addFloatingText(state, col.x, col.y, '🚀 ROCKET BOOST!', '#ef4444');
            } else if (col.type === 'clean_organic' || col.type === 'clean_recyclable') {
              state.score += 150;
              state.coins += 2;
              setCoins(state.coins);
              sound.playCoin();
              addFloatingText(state, col.x, col.y, '♻️ SWACHH +150', '#22c55e');
            } else if (col.type === 'cosmic_star') {
              state.score += 200;
              sound.playCoin();
              addFloatingText(state, col.x, col.y, '⭐ STAR +200', '#facc15');
            }

            state.collectibles.splice(i, 1);
          } else if (col.x + col.width < -100) {
            state.collectibles.splice(i, 1);
          }
        }

        // UPDATE PARTICLES
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const p = state.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          p.alpha = 1 - p.life / p.maxLife;
          if (p.life >= p.maxLife) {
            state.particles.splice(i, 1);
          }
        }

        // UPDATE FLOATING TEXTS
        for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
          const ft = state.floatingTexts[i];
          ft.y -= 1.4;
          ft.life -= 1 / 60;
          ft.opacity = Math.max(0, ft.life);
          if (ft.life <= 0) {
            state.floatingTexts.splice(i, 1);
          }
        }

        // CHECK VICTORY CONDITION (Reach Level Target Distance)
        if (state.distanceMeters >= level.targetDistance) {
          state.isFinished = true;
          sound.playVictory();
          // Calculate stars (1 star guaranteed, 2 stars for >= 15 coins, 3 stars for all 3 lives + 25 coins)
          let stars = 1;
          if (state.coins >= 15 || state.lives >= 2) stars = 2;
          if (state.lives === 3 && state.coins >= 25) stars = 3;
          onVictory(state.score, state.coins, stars);
          return;
        }

        // Sync React state for HUD
        setScore(state.score);
        setDistance(Math.min(level.targetDistance, Math.round(state.distanceMeters)));
        setActivePowerUp(state.activePowerUp ? { ...state.activePowerUp } : null);
        setCleanlinessBonus(state.cleanlinessBonus);
      }

      // RENDER PHASE
      ctx.save();
      // Apply Screen Shake if active
      if (state.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * state.screenShake;
        const shakeY = (Math.random() - 0.5) * state.screenShake;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Draw Parallax Background
      drawEnvironmentBackground({
        ctx,
        level,
        cameraX: state.cameraX,
        width: VIRTUAL_WIDTH,
        height: VIRTUAL_HEIGHT,
        animationTick: state.animationTick,
      });

      // 2. Draw Collectibles
      state.collectibles.forEach((col) => {
        drawCollectible(ctx, col, state.animationTick);
      });

      // 3. Draw Obstacles
      state.obstacles.forEach((obs) => {
        drawObstacle(ctx, obs, state.animationTick);
      });

      // 4. Draw Cartoon Player Character
      drawCartoonCharacter({
        ctx,
        player: state.player,
        costume,
        activePowerUp: state.activePowerUp?.type || null,
        animationTick: state.animationTick,
      });

      // 5. Draw Particles
      state.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 6. Draw Floating Texts
      state.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = ft.opacity;
        ctx.font = `bold ${ft.fontSize}px Fredoka, sans-serif`;
        ctx.fillStyle = ft.color;
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      // 7. Selfie camera flash white overlay
      if (selfieFlash) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT);
      }

      ctx.restore();

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationId);
  }, [level, costume, isPaused, onGameOver, onVictory, selfieFlash]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-950 select-none overflow-hidden">
      {/* 16:9 Aspect Ratio Responsive Canvas Container */}
      <div className="relative w-full max-w-[1280px] aspect-[16/9] shadow-2xl overflow-hidden rounded-xl border-4 border-amber-900/60 bg-amber-950">
        <canvas
          ref={canvasRef}
          width={VIRTUAL_WIDTH}
          height={VIRTUAL_HEIGHT}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full block cursor-pointer"
        />

        {/* IN-GAME TOP HUD BAR */}
        <div className="absolute top-0 left-0 right-0 p-3 sm:p-5 flex items-center justify-between pointer-events-none z-20">
          {/* Left: Score & Coins */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-amber-500/50 flex items-center gap-2 shadow-lg">
              <span className="text-amber-400 font-cartoon text-xs uppercase tracking-wider">Score</span>
              <span className="text-white font-cartoon text-lg sm:text-xl">{score}</span>
            </div>

            <div className="bg-amber-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border-2 border-yellow-500/50 flex items-center gap-1.5 shadow-lg">
              <span className="text-yellow-400 text-base">🪙</span>
              <span className="text-yellow-300 font-cartoon text-lg sm:text-xl">{coins}</span>
            </div>
          </div>

          {/* Center: Distance Progress Bar */}
          <div className="hidden sm:flex flex-col items-center max-w-xs w-full px-4">
            <div className="flex justify-between w-full text-xs font-cartoon text-amber-200 mb-1">
              <span>{level.name}</span>
              <span>{distance}m / {level.targetDistance}m</span>
            </div>
            <div className="w-full bg-slate-900/80 h-3.5 rounded-full p-0.5 border border-amber-500/40 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-green-500 transition-all duration-100"
                style={{ width: `${Math.min(100, (distance / level.targetDistance) * 100)}%` }}
              />
            </div>
          </div>

          {/* Right: Lives & Pause */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="bg-amber-950/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border-2 border-red-500/50 flex items-center gap-1 shadow-lg">
              {[1, 2, 3].map((heart) => (
                <span
                  key={heart}
                  className={`text-base sm:text-lg transition-transform ${
                    heart <= lives ? 'scale-100 text-red-500' : 'scale-75 opacity-25 text-gray-500'
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>

            <button
              id="pause-btn"
              onClick={() => {
                sound.playClick();
                onPause();
              }}
              className="bg-amber-600 hover:bg-amber-500 active:scale-95 text-white font-cartoon px-3.5 py-1.5 rounded-2xl border-2 border-amber-400 shadow-md flex items-center gap-1.5 cursor-pointer text-sm"
            >
              <span>⏸️</span>
              <span className="hidden sm:inline">Pause</span>
            </button>
          </div>
        </div>

        {/* ACTIVE POWER-UP INDICATOR PILL */}
        {activePowerUp && (
          <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 bg-amber-950/90 border-2 border-amber-400 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-2xl animate-bounce z-20 pointer-events-none">
            <span className="text-xl">
              {activePowerUp.type === 'chai'
                ? '☕'
                : activePowerUp.type === 'namaste'
                ? '🙏'
                : activePowerUp.type === 'rocket'
                ? '🚀'
                : '📸'}
            </span>
            <span className="text-amber-200 font-cartoon font-bold text-sm tracking-wide uppercase">
              {activePowerUp.type === 'chai'
                ? 'Chai Speed Boost!'
                : activePowerUp.type === 'namaste'
                ? 'Namaste Peace Power!'
                : activePowerUp.type === 'rocket'
                ? 'Rocket Overdrive!'
                : 'Selfie Flash!'}
            </span>
            <div className="w-12 bg-black/40 h-2 rounded-full overflow-hidden ml-1">
              <div
                className="bg-amber-400 h-full transition-all"
                style={{ width: `${(activePowerUp.timeLeft / activePowerUp.duration) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* MOBILE TOUCH VIRTUAL ON-SCREEN BUTTONS */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none sm:hidden z-20">
          {/* Left / Right directional buttons */}
          <div className="flex gap-2 pointer-events-auto">
            <button
              id="touch-left-btn"
              onTouchStart={() => triggerMove(-35)}
              onClick={() => triggerMove(-35)}
              className="w-14 h-14 rounded-2xl bg-amber-900/80 border-2 border-amber-400/80 text-amber-200 text-2xl flex items-center justify-center active:scale-90 active:bg-amber-600 shadow-xl"
            >
              ⬅️
            </button>
            <button
              id="touch-right-btn"
              onTouchStart={() => triggerMove(35)}
              onClick={() => triggerMove(35)}
              className="w-14 h-14 rounded-2xl bg-amber-900/80 border-2 border-amber-400/80 text-amber-200 text-2xl flex items-center justify-center active:scale-90 active:bg-amber-600 shadow-xl"
            >
              ➡️
            </button>
          </div>

          {/* Action Jump & Duck buttons */}
          <div className="flex gap-2 pointer-events-auto">
            <button
              id="touch-duck-btn"
              onTouchStart={() => triggerDuck(true)}
              onTouchEnd={() => triggerDuck(false)}
              className="w-14 h-14 rounded-2xl bg-amber-900/80 border-2 border-amber-400/80 text-amber-200 text-xl font-cartoon flex flex-col items-center justify-center active:scale-90 active:bg-amber-600 shadow-xl"
            >
              <span>⬇️</span>
              <span className="text-[10px] uppercase font-bold">Slide</span>
            </button>

            <button
              id="touch-jump-btn"
              onTouchStart={triggerJump}
              onClick={triggerJump}
              className="w-16 h-16 rounded-2xl bg-gradient-to-b from-orange-500 to-amber-600 border-2 border-yellow-300 text-white font-cartoon text-xl flex flex-col items-center justify-center active:scale-90 shadow-2xl"
            >
              <span>⬆️</span>
              <span className="text-xs uppercase font-bold">Jump</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper spawner functions
function spawnRandomObstacle(state: { obstacles: Obstacle[] }, level: LevelConfig) {
  const spawnX = VIRTUAL_WIDTH + 80;

  if (level.environment === 'space') {
    const isMeteor = Math.random() > 0.5;
    state.obstacles.push({
      x: spawnX,
      y: isMeteor ? GROUND_Y - 50 : GROUND_Y - 140 - Math.random() * 80,
      width: isMeteor ? 48 : 56,
      height: isMeteor ? 48 : 45,
      type: isMeteor ? 'space_meteor' : 'satellite_junk',
      frame: 0,
      passed: false,
    });
    return;
  }

  if (level.environment === 'train') {
    const types: Obstacle['type'][] = ['train_signal', 'luggage', 'steam_vent'];
    const selected = types[Math.floor(Math.random() * types.length)];
    const isHigh = selected === 'train_signal';
    state.obstacles.push({
      x: spawnX,
      y: isHigh ? GROUND_Y - 100 : GROUND_Y - 45,
      width: isHigh ? 36 : 48,
      height: isHigh ? 55 : 45,
      type: selected,
      frame: 0,
      passed: false,
    });
    return;
  }

  if (level.environment === 'cleancity') {
    const types: Obstacle['type'][] = ['banana_peel', 'mud_puddle', 'monkey'];
    const selected = types[Math.floor(Math.random() * types.length)];
    state.obstacles.push({
      x: spawnX,
      y: GROUND_Y - 40,
      width: selected === 'monkey' ? 44 : 50,
      height: 40,
      type: selected,
      frame: 0,
      passed: false,
    });
    return;
  }

  // Parliament / Default obstacles
  const types: Obstacle['type'][] = ['pothole', 'monkey', 'mic_tripod', 'chai_cart'];
  const selected = types[Math.floor(Math.random() * types.length)];
  state.obstacles.push({
    x: spawnX,
    y: GROUND_Y - 48,
    width: selected === 'chai_cart' ? 58 : 46,
    height: 48,
    type: selected,
    frame: 0,
    passed: false,
  });
}

function spawnRandomCollectible(state: { collectibles: Collectible[] }, level: LevelConfig) {
  const spawnX = VIRTUAL_WIDTH + 50;
  const isHighY = Math.random() > 0.45;
  const itemY = isHighY ? GROUND_Y - 125 : GROUND_Y - 50;

  // Power-Up chance: 25%
  const roll = Math.random();
  if (roll < 0.08) {
    state.collectibles.push({
      x: spawnX,
      y: itemY,
      width: 32,
      height: 32,
      type: 'chai_cup',
      value: 100,
      collected: false,
      bobOffset: Math.random() * 5,
    });
  } else if (roll < 0.15) {
    state.collectibles.push({
      x: spawnX,
      y: itemY,
      width: 34,
      height: 34,
      type: 'namaste_lotus',
      value: 100,
      collected: false,
      bobOffset: Math.random() * 5,
    });
  } else if (roll < 0.21) {
    state.collectibles.push({
      x: spawnX,
      y: itemY,
      width: 34,
      height: 34,
      type: 'camera_selfie',
      value: 500,
      collected: false,
      bobOffset: Math.random() * 5,
    });
  } else if (roll < 0.26) {
    state.collectibles.push({
      x: spawnX,
      y: itemY,
      width: 34,
      height: 34,
      type: 'rocket_fuel',
      value: 100,
      collected: false,
      bobOffset: Math.random() * 5,
    });
  } else {
    // Environmental special collectibles
    if (level.environment === 'cleancity') {
      const isOrganic = Math.random() > 0.5;
      state.collectibles.push({
        x: spawnX,
        y: itemY,
        width: 30,
        height: 30,
        type: isOrganic ? 'clean_organic' : 'clean_recyclable',
        value: 150,
        collected: false,
        bobOffset: Math.random() * 5,
      });
    } else if (level.environment === 'space') {
      state.collectibles.push({
        x: spawnX,
        y: itemY,
        width: 30,
        height: 30,
        type: 'cosmic_star',
        value: 200,
        collected: false,
        bobOffset: Math.random() * 5,
      });
    } else {
      // Golden Lotus Coin
      state.collectibles.push({
        x: spawnX,
        y: itemY,
        width: 28,
        height: 28,
        type: 'coin',
        value: 50,
        collected: false,
        bobOffset: Math.random() * 5,
      });
    }
  }
}

function checkAABBCollision(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean {
  // Add a 6px forgiving inner hitbox buffer for enjoyable family-friendly gameplay
  const buffer = 8;
  return (
    a.x + buffer < b.x + b.width - buffer &&
    a.x + a.width - buffer > b.x + buffer &&
    a.y + buffer < b.y + b.height - buffer &&
    a.y + a.height - buffer > b.y + buffer
  );
}

function addFloatingText(
  state: { floatingTexts: FloatingText[] },
  x: number,
  y: number,
  text: string,
  color: string
) {
  state.floatingTexts.push({
    id: Math.random().toString(),
    x,
    y,
    text,
    color,
    fontSize: 20,
    opacity: 1,
    life: 1.0,
  });
}

function createCollectionSparkles(
  state: { particles: Particle[] },
  x: number,
  y: number,
  color: string
) {
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * (Math.random() * 3 + 2),
      vy: Math.sin(angle) * (Math.random() * 3 + 2),
      size: Math.random() * 4 + 2,
      color,
      alpha: 1,
      life: 0,
      maxLife: 20,
    });
  }
}

function createExplosionParticles(
  state: { particles: Particle[] },
  x: number,
  y: number,
  color: string
) {
  for (let i = 0; i < 14; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: Math.random() * 5 + 3,
      color: i % 2 === 0 ? color : '#f97316',
      alpha: 1,
      life: 0,
      maxLife: 30,
    });
  }
}
