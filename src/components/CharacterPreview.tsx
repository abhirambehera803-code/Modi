import React, { useEffect, useRef } from 'react';
import { Costume, PlayerState } from '../types';
import { drawCartoonCharacter } from '../game/characterRenderer';

interface CharacterPreviewProps {
  costume: Costume;
  size?: number;
  animate?: boolean;
}

export const CharacterPreview: React.FC<CharacterPreviewProps> = ({
  costume,
  size = 140,
  animate = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;
    let animId: number;

    const dummyPlayer: PlayerState = {
      x: 35,
      y: 18,
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
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (animate) {
        tick++;
      }

      ctx.save();
      // Draw gentle circular podium shadow under character
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height - 18, 38, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw character
      drawCartoonCharacter({
        ctx,
        player: {
          ...dummyPlayer,
          x: canvas.width / 2 - 24,
          y: canvas.height - 18 - 75,
        },
        costume,
        activePowerUp: null,
        animationTick: tick,
      });

      ctx.restore();

      if (animate) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animate) cancelAnimationFrame(animId);
    };
  }, [costume, animate]);

  return (
    <div
      className="relative flex items-center justify-center rounded-2xl bg-amber-900/30 border-2 border-amber-600/40 p-2 shadow-inner"
      style={{ width: size, height: size }}
    >
      <canvas ref={canvasRef} width={size} height={size} className="block" />
    </div>
  );
};
