import { Collectible, LevelConfig, Obstacle } from '../types';

interface EnvironmentRenderOptions {
  ctx: CanvasRenderingContext2D;
  level: LevelConfig;
  cameraX: number;
  width: number;
  height: number;
  animationTick: number;
  obstacles: Obstacle[];
  collectibles: Collectible[];
}

export function drawEnvironmentBackground({
  ctx,
  level,
  cameraX,
  width,
  height,
  animationTick,
}: Omit<EnvironmentRenderOptions, 'obstacles' | 'collectibles'>) {
  const groundHeight = 110;
  const groundY = height - groundHeight;

  // 1. Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
  skyGrad.addColorStop(0, level.skyColor[0]);
  skyGrad.addColorStop(1, level.skyColor[1]);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, groundY);

  // 2. Parallax Layers according to level environment
  if (level.environment === 'space') {
    drawSpaceBackground(ctx, cameraX, width, groundY, animationTick);
  } else if (level.environment === 'train') {
    drawTrainBackground(ctx, cameraX, width, groundY, animationTick);
  } else if (level.environment === 'cleancity') {
    drawCleanCityBackground(ctx, cameraX, width, groundY, animationTick);
  } else if (level.environment === 'worldtour') {
    drawWorldTourBackground(ctx, cameraX, width, groundY, animationTick);
  } else {
    // Default: Parliament Dash
    drawParliamentBackground(ctx, level, cameraX, width, groundY, animationTick);
  }

  // 3. Ground / Road / Track
  drawGround(ctx, level, cameraX, width, height, groundY, animationTick);
}

function drawParliamentBackground(
  ctx: CanvasRenderingContext2D,
  level: LevelConfig,
  cameraX: number,
  width: number,
  groundY: number,
  animationTick: number
) {
  // Distant warm sun
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(width * 0.75, 90, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
  ctx.beginPath();
  ctx.arc(width * 0.75, 90, 70, 0, Math.PI * 2);
  ctx.fill();

  // Fluffy clouds (Parallax speed 0.1)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  const cloudOffset = (cameraX * 0.1 + animationTick * 0.2) % (width + 300);
  [
    { x: 100, y: 60, r: 24 },
    { x: 450, y: 80, r: 30 },
    { x: 800, y: 50, r: 28 },
    { x: 1150, y: 70, r: 32 },
  ].forEach((cloud) => {
    const cx = (cloud.x - cloudOffset + (width + 300) * 2) % (width + 300) - 100;
    ctx.beginPath();
    ctx.arc(cx, cloud.y, cloud.r, 0, Math.PI * 2);
    ctx.arc(cx + cloud.r * 0.7, cloud.y - 6, cloud.r * 0.8, 0, Math.PI * 2);
    ctx.arc(cx + cloud.r * 1.3, cloud.y, cloud.r * 0.7, 0, Math.PI * 2);
    ctx.fill();
  });

  // Layer 1: Distant City Skyline & Domes (Parallax speed 0.25)
  const skylineOffset = (cameraX * 0.25) % 600;
  ctx.fillStyle = '#fbcfe8';
  for (let i = -600; i < width + 600; i += 300) {
    const x = i - skylineOffset;
    // Parliament / Monument Dome Silhouette
    ctx.beginPath();
    ctx.arc(x + 150, groundY - 100, 50, Math.PI, 0);
    ctx.rect(x + 90, groundY - 100, 120, 100);
    ctx.fill();

    // Spire
    ctx.fillRect(x + 148, groundY - 170, 4, 30);
    ctx.beginPath();
    ctx.arc(x + 150, groundY - 170, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Layer 2: Cartoon India Gate Arch & Avenue Trees (Parallax speed 0.5)
  const archOffset = (cameraX * 0.5) % 800;
  ctx.fillStyle = '#fde68a';
  for (let i = -800; i < width + 800; i += 800) {
    const x = i - archOffset;
    // Cartoon India Gate
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x + 350, groundY - 140, 110, 140);
    ctx.fillStyle = '#fdba74';
    ctx.fillRect(x + 340, groundY - 155, 130, 20);
    ctx.fillRect(x + 335, groundY - 165, 140, 12);
    // Archway cutout
    ctx.fillStyle = level.skyColor[1];
    ctx.beginPath();
    ctx.arc(x + 405, groundY - 70, 26, Math.PI, 0);
    ctx.rect(x + 379, groundY - 70, 52, 70);
    ctx.fill();
  }

  // Cartoon Lush Trees along road (Parallax speed 0.7)
  const treeOffset = (cameraX * 0.7) % 250;
  for (let i = -250; i < width + 250; i += 180) {
    const tx = i - treeOffset;
    // Trunk
    ctx.fillStyle = '#78350f';
    ctx.fillRect(tx + 20, groundY - 50, 12, 50);
    // Green Foliage
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(tx + 26, groundY - 65, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(tx + 22, groundY - 72, 18, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawTrainBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  width: number,
  groundY: number,
  animationTick: number
) {
  // Vibrant Sky with colorful Kites
  const kiteColors = ['#f43f5e', '#eab308', '#06b6d4', '#8b5cf6'];
  [0, 1, 2].forEach((kIndex) => {
    const kx = ((kIndex * 380 - cameraX * 0.15 + animationTick * 0.8) % (width + 200) + width + 200) % (width + 200) - 50;
    const ky = 70 + Math.sin(animationTick * 0.05 + kIndex) * 15;
    ctx.save();
    ctx.translate(kx, ky);
    ctx.rotate(0.2 + Math.sin(animationTick * 0.1) * 0.1);
    ctx.fillStyle = kiteColors[kIndex % kiteColors.length];
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(14, 0);
    ctx.lineTo(0, 18);
    ctx.lineTo(-14, 0);
    ctx.closePath();
    ctx.fill();
    // Kite Tail
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.quadraticCurveTo(8, 30, 2, 45);
    ctx.stroke();
    ctx.restore();
  });

  // Distant Mountain Ranges (Parallax 0.2)
  const mountainOffset = (cameraX * 0.2) % 500;
  ctx.fillStyle = '#93c5fd';
  for (let i = -500; i < width + 500; i += 280) {
    const mx = i - mountainOffset;
    ctx.beginPath();
    ctx.moveTo(mx, groundY);
    ctx.lineTo(mx + 140, groundY - 110);
    ctx.lineTo(mx + 280, groundY);
    ctx.closePath();
    ctx.fill();
  }

  // Passing Train Station Canopies / Chai Stalls (Parallax 0.6)
  const stationOffset = (cameraX * 0.6) % 650;
  for (let i = -650; i < width + 650; i += 650) {
    const sx = i - stationOffset;
    // Station Pillar & Signboard
    ctx.fillStyle = '#334155';
    ctx.fillRect(sx + 100, groundY - 120, 10, 120);
    ctx.fillRect(sx + 300, groundY - 120, 10, 120);
    // Roof
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(sx + 70, groundY - 120);
    ctx.lineTo(sx + 340, groundY - 120);
    ctx.lineTo(sx + 320, groundY - 145);
    ctx.lineTo(sx + 90, groundY - 145);
    ctx.closePath();
    ctx.fill();

    // Station signboard: "DELHI EXPRESS"
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(sx + 140, groundY - 110, 130, 26);
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(sx + 140, groundY - 110, 130, 26);
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 12px Fredoka, sans-serif';
    ctx.fillText('DELHI EXPRESS', sx + 152, groundY - 93);
  }
}

function drawCleanCityBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  width: number,
  groundY: number,
  animationTick: number
) {
  // Eco Wind Turbines in distant background (Parallax 0.2)
  const turbineOffset = (cameraX * 0.2) % 400;
  for (let i = -400; i < width + 400; i += 350) {
    const tx = i - turbineOffset;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(tx + 80, groundY - 130, 4, 130);
    // Spinning Blades
    ctx.save();
    ctx.translate(tx + 82, groundY - 130);
    ctx.rotate(animationTick * 0.05);
    ctx.fillStyle = '#f8fafc';
    for (let b = 0; b < 3; b++) {
      ctx.rotate((Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.ellipse(0, 22, 4, 22, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Modern Eco Buildings & Solar Panels (Parallax 0.5)
  const buildingOffset = (cameraX * 0.5) % 550;
  for (let i = -550; i < width + 550; i += 220) {
    const bx = i - buildingOffset;
    ctx.fillStyle = '#86efac';
    ctx.fillRect(bx + 10, groundY - 150, 90, 150);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(bx + 110, groundY - 180, 100, 180);

    // Modern Windows
    ctx.fillStyle = '#f0fdf4';
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillRect(bx + 25 + c * 30, groundY - 135 + r * 30, 18, 18);
        ctx.fillRect(bx + 125 + c * 35, groundY - 165 + r * 35, 20, 20);
      }
    }
  }

  // Solar Street Lamps along sidewalk (Parallax 0.8)
  const lampOffset = (cameraX * 0.8) % 240;
  for (let i = -240; i < width + 240; i += 240) {
    const lx = i - lampOffset;
    ctx.fillStyle = '#334155';
    ctx.fillRect(lx + 40, groundY - 80, 5, 80);
    ctx.fillRect(lx + 30, groundY - 85, 25, 5);
    // Solar Panel on top
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(lx + 25, groundY - 92, 35, 7);
  }
}

function drawSpaceBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  width: number,
  groundY: number,
  animationTick: number
) {
  // Cosmic Starfield with twinkling stars
  const starOffset1 = (cameraX * 0.1) % 600;
  ctx.fillStyle = '#ffffff';
  for (let s = 0; s < 45; s++) {
    const sx = ((s * 47 - starOffset1) % (width + 100) + width + 100) % (width + 100);
    const sy = (s * 31) % (groundY - 30);
    const size = (s % 3) + 1.5;
    const alpha = 0.5 + Math.sin(animationTick * 0.1 + s) * 0.4;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // Distant glowing Blue Earth & Golden Moon
  ctx.save();
  // Earth
  const earthX = width * 0.25 - (cameraX * 0.05) % (width * 1.5);
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(earthX, 100, 48, 0, Math.PI * 2);
  ctx.fill();
  // Green continents
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(earthX - 10, 95, 20, 0, Math.PI * 2);
  ctx.arc(earthX + 16, 108, 16, 0, Math.PI * 2);
  ctx.fill();

  // Cosmic Nebula Cloud
  const nebulaGrad = ctx.createRadialGradient(width * 0.7, 120, 20, width * 0.7, 120, 180);
  nebulaGrad.addColorStop(0, 'rgba(192, 132, 252, 0.35)');
  nebulaGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.15)');
  nebulaGrad.addColorStop(1, 'rgba(236, 72, 153, 0)');
  ctx.fillStyle = nebulaGrad;
  ctx.beginPath();
  ctx.arc(width * 0.7, 120, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawWorldTourBackground(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  width: number,
  groundY: number,
  animationTick: number
) {
  // Sunset Sky with celebratory fireworks
  if (Math.floor(animationTick / 30) % 2 === 0) {
    const fX = (width * 0.4 + animationTick * 4) % width;
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(fX, 70, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.5;
    for (let a = 0; a < 8; a++) {
      const angle = (a * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(fX, 70);
      ctx.lineTo(fX + Math.cos(angle) * 16, 70 + Math.sin(angle) * 16);
      ctx.stroke();
    }
  }

  // World Monuments Carousel (Parallax 0.4)
  const landmarkOffset = (cameraX * 0.4) % 1200;
  for (let i = -1200; i < width + 1200; i += 1200) {
    const lx = i - landmarkOffset;

    // 1. Taj Mahal
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(lx + 200, groundY - 80, 35, Math.PI, 0);
    ctx.rect(lx + 155, groundY - 80, 90, 80);
    ctx.fill();
    // Minarets
    ctx.fillRect(lx + 130, groundY - 110, 8, 110);
    ctx.fillRect(lx + 260, groundY - 110, 8, 110);

    // 2. Eiffel Tower silhouette
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.moveTo(lx + 550, groundY - 180);
    ctx.lineTo(lx + 580, groundY);
    ctx.lineTo(lx + 520, groundY);
    ctx.closePath();
    ctx.fill();

    // 3. Statue of Liberty torch silhouette
    ctx.fillStyle = '#a7f3d0';
    ctx.fillRect(lx + 850, groundY - 140, 25, 140);
    ctx.beginPath();
    ctx.arc(lx + 862, groundY - 148, 12, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGround(
  ctx: CanvasRenderingContext2D,
  level: LevelConfig,
  cameraX: number,
  width: number,
  height: number,
  groundY: number,
  animationTick: number
) {
  // Ground Top Line / Curb
  if (level.environment === 'space') {
    // Cosmic Energy Platform
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, groundY, width, height - groundY);

    // Glowing cosmic energy rail
    const neonGrad = ctx.createLinearGradient(0, groundY, width, groundY);
    neonGrad.addColorStop(0, '#818cf8');
    neonGrad.addColorStop(0.5, '#c084fc');
    neonGrad.addColorStop(1, '#818cf8');
    ctx.fillStyle = neonGrad;
    ctx.fillRect(0, groundY, width, 8);

    // Star grid lines
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.25)';
    ctx.lineWidth = 1;
    const gridOffset = cameraX % 50;
    for (let x = -gridOffset; x < width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, groundY + 8);
      ctx.lineTo(x - 40, height);
      ctx.stroke();
    }
    return;
  }

  if (level.environment === 'train') {
    // Fast-moving Railway Track & Train Roof
    ctx.fillStyle = '#1e293b'; // Train top
    ctx.fillRect(0, groundY, width, height - groundY);

    // Train rivets & metal roof lines
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, groundY, width, 14);

    // Track sleepers / ties whooshing past
    ctx.fillStyle = '#0284c7';
    const tieOffset = cameraX % 60;
    for (let x = -tieOffset; x < width; x += 60) {
      ctx.fillRect(x, groundY + 4, 18, 6);
    }
    return;
  }

  // Default / Parliament / Clean City / World Tour: Road & Curb
  ctx.fillStyle = level.groundColor;
  ctx.fillRect(0, groundY, width, height - groundY);

  // Tricolor / Decorative Curb along road
  const curbOffset = cameraX % 60;
  const blockW = 20;
  for (let x = -curbOffset - 60; x < width + 60; x += blockW * 3) {
    // Saffron
    ctx.fillStyle = '#f97316';
    ctx.fillRect(x, groundY, blockW, 10);
    // White
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(x + blockW, groundY, blockW, 10);
    // Green
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(x + blockW * 2, groundY, blockW, 10);
  }

  // Dashed Road Line
  ctx.fillStyle = '#fef08a';
  const dashOffset = cameraX % 80;
  for (let x = -dashOffset; x < width; x += 80) {
    ctx.fillRect(x, groundY + 45, 45, 8);
  }
}

/**
 * Draw Obstacles
 */
export function drawObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle, animationTick: number) {
  ctx.save();
  const ox = obs.x;
  const oy = obs.y;
  const w = obs.width;
  const h = obs.height;

  switch (obs.type) {
    case 'pothole': {
      // Cartoon Pothole with water splash
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(ox + w / 2, oy + h - 8, w / 2, h / 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38bdf8'; // water reflection
      ctx.beginPath();
      ctx.ellipse(ox + w / 2, oy + h - 8, w / 2.8, h / 5, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'monkey': {
      // Playful cartoon monkey sitting/jumping
      const mcx = ox + w / 2;
      const mcy = oy + h / 2;
      // Body
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.arc(mcx, mcy + 6, 16, 0, Math.PI * 2);
      ctx.fill();
      // Face
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(mcx, mcy - 6, 12, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(mcx - 4, mcy - 8, 2.5, 0, Math.PI * 2);
      ctx.arc(mcx + 4, mcy - 8, 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Yellow Banana in hand
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(mcx + 12, mcy + 2, 7, 0, Math.PI);
      ctx.fill();
      break;
    }

    case 'mic_tripod': {
      // News reporter microphones & tripod
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      // Tripod legs
      ctx.beginPath();
      ctx.moveTo(ox + w / 2, oy + 12);
      ctx.lineTo(ox + 4, oy + h);
      ctx.moveTo(ox + w / 2, oy + 12);
      ctx.lineTo(ox + w - 4, oy + h);
      ctx.stroke();
      // Colorful Microphones (red, blue, green cubes with foam)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(ox + w / 2 - 8, oy + 4, 8, 10);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(ox + w / 2 + 1, oy + 2, 8, 10);
      break;
    }

    case 'chai_cart': {
      // Rolling cartoon wooden chai trolley
      ctx.fillStyle = '#b45309';
      ctx.fillRect(ox, oy + 10, w, h - 22);
      // Wheels
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(ox + 10, oy + h - 6, 8, 0, Math.PI * 2);
      ctx.arc(ox + w - 10, oy + h - 6, 8, 0, Math.PI * 2);
      ctx.fill();
      // Big Steaming Brass Kettle
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(ox + w / 2 - 10, oy, 20, 16);
      break;
    }

    case 'train_signal': {
      // Overhead railway signal gantry (Ducking obstacle)
      ctx.fillStyle = '#475569';
      ctx.fillRect(ox + w / 2 - 4, oy, 8, h);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(ox + w / 2, oy + 14, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(ox + w / 2, oy + 14, 5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'luggage': {
      // Stack of colorful travel suitcases
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(ox, oy + h - 22, w, 20);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(ox + 4, oy + h - 40, w - 8, 18);
      break;
    }

    case 'steam_vent': {
      // Train roof steam pressure vent
      ctx.fillStyle = '#64748b';
      ctx.fillRect(ox + 6, oy + h - 18, w - 12, 18);
      // Steaming cloud
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(ox + w / 2, oy + 8 + Math.sin(animationTick * 0.2) * 4, 14, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'banana_peel': {
      // Yellow banana peel on street
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(ox + w / 2, oy + h - 6, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'mud_puddle': {
      // Mud puddle
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.ellipse(ox + w / 2, oy + h - 6, w / 2, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'space_meteor': {
      // Glowing Space Meteor
      const mcx = ox + w / 2;
      const mcy = oy + h / 2;
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(mcx, mcy, w / 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(mcx - 4, mcy - 4, w / 4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'satellite_junk': {
      // Rotating cartoon satellite
      const scx = ox + w / 2;
      const scy = oy + h / 2;
      ctx.save();
      ctx.translate(scx, scy);
      ctx.rotate(animationTick * 0.04);
      // Satellite Body
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-10, -10, 20, 20);
      // Solar Wings
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-28, -6, 14, 12);
      ctx.fillRect(14, -6, 14, 12);
      ctx.restore();
      break;
    }

    default: {
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(ox, oy, w, h);
      break;
    }
  }
  ctx.restore();
}

/**
 * Draw Collectibles & Power-Ups
 */
export function drawCollectible(ctx: CanvasRenderingContext2D, col: Collectible, animationTick: number) {
  if (col.collected) return;
  ctx.save();

  const cx = col.x + col.width / 2;
  const cy = col.y + col.height / 2 + Math.sin(animationTick * 0.1 + col.bobOffset) * 5;

  switch (col.type) {
    case 'coin': {
      // Shiny Gold Lotus Coin
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Inner Lotus flower engraving
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e11d48';
      ctx.font = 'bold 11px Fredoka, sans-serif';
      ctx.fillText('₹', cx - 4, cy + 4);
      break;
    }

    case 'chai_cup': {
      // Steaming Cutting Chai Glass
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 10);
      ctx.lineTo(cx + 10, cy - 10);
      ctx.lineTo(cx + 7, cy + 12);
      ctx.lineTo(cx - 7, cy + 12);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Steam
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(cx, cy - 16, 4, 0, Math.PI);
      ctx.stroke();
      break;
    }

    case 'namaste_lotus': {
      // Golden Glowing Namaste Lotus
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(cx, cy, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '16px serif';
      ctx.fillText('🙏', cx - 8, cy + 6);
      break;
    }

    case 'camera_selfie': {
      // Camera / Selfie bonus
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cx - 12, cy - 8, 24, 18);
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, cy + 1, 6, 0, Math.PI * 2);
      ctx.fill();
      // Flash sparkle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx + 8, cy - 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'rocket_fuel': {
      // Rocket canister
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.roundRect(cx - 9, cy - 12, 18, 24, 4);
      ctx.fill();
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('🚀', cx - 6, cy + 5);
      break;
    }

    case 'clean_organic': {
      // Green recyclable apple / fruit
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('♻️', cx - 6, cy + 4);
      break;
    }

    case 'clean_recyclable': {
      // Blue clean bottle
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(cx - 6, cy - 12, 12, 22);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(cx - 4, cy - 16, 8, 5);
      break;
    }

    case 'cosmic_star': {
      // Pulsing Star
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('⭐', cx - 6, cy + 4);
      break;
    }

    default: {
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}
