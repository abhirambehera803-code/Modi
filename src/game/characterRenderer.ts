import { Costume, PlayerState, PowerUpType } from '../types';

interface RenderCharacterOptions {
  ctx: CanvasRenderingContext2D;
  player: PlayerState;
  costume: Costume;
  activePowerUp: PowerUpType | null;
  animationTick: number;
}

export function drawCartoonCharacter({
  ctx,
  player,
  costume,
  activePowerUp,
  animationTick,
}: RenderCharacterOptions) {
  ctx.save();

  // Handle invincibility blink effect
  if (player.isInvincible && Math.floor(animationTick / 4) % 2 === 0) {
    ctx.globalAlpha = 0.4;
  }

  const px = player.x;
  const py = player.y;
  const w = player.width;
  const h = player.height;

  // Center coordinate of character bounding box
  const cx = px + w / 2;
  const bottomY = py + h;

  // Bobbing rhythm for running
  const runPhase = (animationTick * 0.2) % (Math.PI * 2);
  const bobY = player.isGrounded && !player.isDucking ? Math.sin(runPhase * 2) * 3 : 0;

  // 1. Draw Active Power-Up Auras behind character
  if (activePowerUp === 'chai') {
    ctx.save();
    // Warm fiery speed aura
    const gradient = ctx.createRadialGradient(cx, py + h / 2, 10, cx, py + h / 2, 55);
    gradient.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
    gradient.addColorStop(0.7, 'rgba(251, 146, 60, 0.2)');
    gradient.addColorStop(1, 'rgba(251, 146, 60, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, py + h / 2, 55, 0, Math.PI * 2);
    ctx.fill();

    // Speed trails behind
    ctx.strokeStyle = 'rgba(251, 146, 60, 0.6)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 35, py + 20 + Math.sin(animationTick * 0.5) * 6);
    ctx.lineTo(cx - 65, py + 20);
    ctx.moveTo(cx - 30, py + 45 + Math.cos(animationTick * 0.5) * 6);
    ctx.lineTo(cx - 75, py + 45);
    ctx.stroke();
    ctx.restore();
  } else if (activePowerUp === 'namaste') {
    ctx.save();
    // Peaceful golden calming mandala ripples
    const auraRadius = 45 + Math.sin(animationTick * 0.1) * 8;
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(cx, py + h / 2, auraRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(253, 224, 71, 0.4)';
    ctx.beginPath();
    ctx.arc(cx, py + h / 2, auraRadius + 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else if (activePowerUp === 'rocket') {
    ctx.save();
    // Huge rocket strapped behind or underneath
    const rocketX = cx - 22;
    const rocketY = py + h * 0.45;

    // Rocket Body
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.roundRect(rocketX - 25, rocketY - 14, 45, 26, 8);
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Rocket Nosecone
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(rocketX + 20, rocketY - 14);
    ctx.lineTo(rocketX + 38, rocketY - 1);
    ctx.lineTo(rocketX + 20, rocketY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rocket Fins
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(rocketX - 20, rocketY - 14);
    ctx.lineTo(rocketX - 32, rocketY - 24);
    ctx.lineTo(rocketX - 10, rocketY - 14);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rocketX - 20, rocketY + 12);
    ctx.lineTo(rocketX - 32, rocketY + 22);
    ctx.lineTo(rocketX - 10, rocketY + 12);
    ctx.closePath();
    ctx.fill();

    // Fire & Exhaust
    const flameFlicker = Math.random() * 12;
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(rocketX - 25, rocketY - 9);
    ctx.lineTo(rocketX - 45 - flameFlicker, rocketY - 1);
    ctx.lineTo(rocketX - 25, rocketY + 7);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(rocketX - 25, rocketY - 5);
    ctx.lineTo(rocketX - 36 - flameFlicker * 0.6, rocketY - 1);
    ctx.lineTo(rocketX - 25, rocketY + 3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 2. Ducking / Sliding modifications
  if (player.isDucking) {
    drawDuckingCharacter(ctx, cx, bottomY, costume, animationTick);
    ctx.restore();
    return;
  }

  // 3. Normal / Running / Jumping character rendering
  const charHeadY = py + 20 + bobY;
  const torsoY = py + 38 + bobY;

  // Backpack / Accessories behind torso
  if (costume.capeOrAccessory === 'yoga_mat') {
    ctx.save();
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.roundRect(cx - 24, torsoY + 2, 10, 24, 4);
    ctx.fill();
    ctx.strokeStyle = '#4c1d95';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  } else if (costume.capeOrAccessory === 'camera_strap') {
    ctx.save();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 12, torsoY - 4);
    ctx.lineTo(cx + 14, torsoY + 20);
    ctx.stroke();
    ctx.restore();
  }

  // LEGS ANIMATION
  ctx.save();
  ctx.fillStyle = costume.pantsColor;
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;

  if (player.isJumping) {
    // Jump pose: legs tucked forward
    // Left Leg
    ctx.beginPath();
    ctx.roundRect(cx - 14, bottomY - 18, 9, 14, 4);
    ctx.fill();
    ctx.stroke();

    // Right Leg
    ctx.beginPath();
    ctx.roundRect(cx + 4, bottomY - 15, 9, 12, 4);
    ctx.fill();
    ctx.stroke();

    // Shoes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(cx - 8, bottomY - 4, 8, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 10, bottomY - 3, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Running cycle legs
    const leg1Swing = Math.sin(runPhase) * 12;
    const leg2Swing = Math.sin(runPhase + Math.PI) * 12;

    // Back leg (Leg 2)
    ctx.beginPath();
    ctx.roundRect(cx + 2 + leg2Swing * 0.4, bottomY - 22, 9, 20, 4);
    ctx.fill();
    ctx.stroke();

    // Back Shoe
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(cx + 7 + leg2Swing * 0.7, bottomY - 2, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Front leg (Leg 1)
    ctx.fillStyle = costume.pantsColor;
    ctx.beginPath();
    ctx.roundRect(cx - 12 + leg1Swing * 0.5, bottomY - 22, 9, 20, 4);
    ctx.fill();
    ctx.stroke();

    // Front Shoe
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(cx - 7 + leg1Swing * 0.8, bottomY - 2, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // TORSO (Kurta + Jacket)
  ctx.save();
  // Base Kurta
  ctx.fillStyle = costume.kurtaColor;
  ctx.beginPath();
  ctx.roundRect(cx - 16, torsoY - 5, 32, 28, 6);
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Nehru Jacket / Vest
  ctx.fillStyle = costume.jacketColor;
  ctx.beginPath();
  ctx.roundRect(cx - 15, torsoY - 5, 30, 24, [6, 6, 2, 2]);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Jacket buttons & pocket square
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(cx, torsoY + 2, 1.8, 0, Math.PI * 2);
  ctx.arc(cx, torsoY + 9, 1.8, 0, Math.PI * 2);
  ctx.arc(cx, torsoY + 16, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Little pocket fold on left chest
  ctx.fillStyle = '#f87171';
  ctx.fillRect(cx - 10, torsoY + 2, 5, 2);
  ctx.restore();

  // ARMS & HANDS (or special poses for power-ups)
  ctx.save();
  if (activePowerUp === 'namaste') {
    // Folded hands 🙏 in front
    ctx.fillStyle = costume.jacketColor;
    ctx.beginPath();
    ctx.roundRect(cx - 4, torsoY + 2, 16, 8, 4);
    ctx.fill();

    // Hands
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.ellipse(cx + 12, torsoY + 4, 6, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.stroke();
  } else if (activePowerUp === 'selfie') {
    // Holding camera/phone out smiling
    ctx.fillStyle = costume.jacketColor;
    ctx.beginPath();
    ctx.roundRect(cx + 2, torsoY + 1, 16, 8, 4);
    ctx.fill();

    // Hand & Phone
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(cx + 18, torsoY + 4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Smartphone
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(cx + 16, torsoY - 14, 12, 18);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(cx + 17, torsoY - 13, 10, 14);

    // Camera Flash Star
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx + 22, torsoY - 16, 5 + Math.sin(animationTick * 0.5) * 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (activePowerUp === 'chai') {
    // Holding a glass of cutting chai!
    ctx.fillStyle = costume.jacketColor;
    ctx.beginPath();
    ctx.roundRect(cx + 2, torsoY + 4, 14, 8, 4);
    ctx.fill();

    // Glass of Chai
    ctx.fillStyle = '#b45309'; // Chai tea color
    ctx.beginPath();
    ctx.moveTo(cx + 16, torsoY + 2);
    ctx.lineTo(cx + 24, torsoY + 2);
    ctx.lineTo(cx + 22, torsoY + 14);
    ctx.lineTo(cx + 18, torsoY + 14);
    ctx.closePath();
    ctx.fill();

    // Glass rim
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Steam spirals
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx + 20, torsoY - 4 - (animationTick % 10), 3, 0, Math.PI);
    ctx.stroke();
  } else {
    // Normal running arm swing
    const armSwing = Math.sin(runPhase) * 14;
    ctx.fillStyle = costume.jacketColor;

    // Back arm
    ctx.beginPath();
    ctx.roundRect(cx - 16 - armSwing * 0.4, torsoY + 2, 7, 14, 3);
    ctx.fill();

    // Front arm
    ctx.beginPath();
    ctx.roundRect(cx + 8 + armSwing * 0.5, torsoY + 2, 7, 14, 3);
    ctx.fill();

    // Hand
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(cx + 12 + armSwing * 0.5, torsoY + 17, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // HEAD & CARTOON FACE
  ctx.save();
  // Head base
  ctx.fillStyle = '#fed7aa'; // Warm cartoon skin tone
  ctx.beginPath();
  ctx.arc(cx, charHeadY, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Silver/White Combed Hair
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  // Hair contour
  ctx.arc(cx, charHeadY - 4, 18, Math.PI * 0.85, Math.PI * 2.15);
  ctx.fill();
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // White Full Beard & Moustache (Signature cartoon feature)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  // Flowing rounded cartoon beard
  ctx.moveTo(cx - 15, charHeadY + 2);
  ctx.bezierCurveTo(cx - 16, charHeadY + 18, cx - 8, charHeadY + 22, cx, charHeadY + 22);
  ctx.bezierCurveTo(cx + 8, charHeadY + 22, cx + 16, charHeadY + 18, cx + 15, charHeadY + 2);
  ctx.bezierCurveTo(cx + 10, charHeadY + 8, cx - 10, charHeadY + 8, cx - 15, charHeadY + 2);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Moustache
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.ellipse(cx - 5, charHeadY + 4, 7, 3.5, -0.15, 0, Math.PI * 2);
  ctx.ellipse(cx + 5, charHeadY + 4, 7, 3.5, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Cheerful Cartoon Eyes & Eyebrows
  // Left Eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(cx - 5, charHeadY - 2, 2.5, 0, Math.PI * 2);
  ctx.fill();
  // Eye reflection dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - 6, charHeadY - 3, 1, 0, Math.PI * 2);
  ctx.fill();

  // Right Eye (winking if selfie mode, otherwise cheerful)
  if (activePowerUp === 'selfie') {
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx + 6, charHeadY - 1, 3.5, Math.PI * 0.1, Math.PI * 0.9);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(cx + 6, charHeadY - 2, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx + 5, charHeadY - 3, 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Eyebrows (white/silver)
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 8, charHeadY - 7);
  ctx.lineTo(cx - 2, charHeadY - 6);
  ctx.moveTo(cx + 3, charHeadY - 6);
  ctx.lineTo(cx + 9, charHeadY - 7);
  ctx.stroke();

  // Cheerful Smile
  ctx.strokeStyle = '#b91c1c';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(cx, charHeadY + 6, 4, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Cartoon Spectacles (Thin silver/dark rounded frames)
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.8;
  // Left lens
  ctx.beginPath();
  ctx.roundRect(cx - 10, charHeadY - 6, 8, 8, 3);
  ctx.stroke();
  // Right lens
  ctx.beginPath();
  ctx.roundRect(cx + 2, charHeadY - 6, 8, 8, 3);
  ctx.stroke();
  // Bridge
  ctx.beginPath();
  ctx.moveTo(cx - 2, charHeadY - 2);
  ctx.lineTo(cx + 2, charHeadY - 2);
  ctx.stroke();

  // Headwear Render if Costume has one
  if (costume.headwear === 'pagri') {
    // Festive Royal Pagri / Turban
    ctx.fillStyle = costume.headwearColor || '#e11d48';
    ctx.beginPath();
    ctx.ellipse(cx, charHeadY - 12, 19, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#9f1239';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pagri folds & golden brooch
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(cx, charHeadY - 14, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Turra / Kalgi feather
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(cx, charHeadY - 14);
    ctx.lineTo(cx - 4, charHeadY - 25);
    ctx.lineTo(cx + 1, charHeadY - 17);
    ctx.fill();
  } else if (costume.headwear === 'headband') {
    // Yoga Headband
    ctx.fillStyle = costume.headwearColor || '#f59e0b';
    ctx.beginPath();
    ctx.roundRect(cx - 17, charHeadY - 10, 34, 6, 3);
    ctx.fill();
  } else if (costume.headwear === 'space_helmet') {
    // Astronaut Space Bubble Helmet
    ctx.fillStyle = 'rgba(147, 197, 253, 0.4)';
    ctx.beginPath();
    ctx.arc(cx, charHeadY - 1, 23, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Helmet shine reflection
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx + 10, charHeadY - 10, 8, -Math.PI * 0.4, 0);
    ctx.stroke();
  } else if (costume.headwear === 'safari_hat') {
    // Explorer Safari Sun Hat
    ctx.fillStyle = costume.headwearColor || '#92400e';
    // Brim
    ctx.beginPath();
    ctx.ellipse(cx, charHeadY - 12, 23, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Crown
    ctx.beginPath();
    ctx.roundRect(cx - 14, charHeadY - 24, 28, 14, 5);
    ctx.fill();
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.restore();
  ctx.restore();
}

/**
 * Cartoon character crouching / sliding low under obstacles
 */
function drawDuckingCharacter(
  ctx: CanvasRenderingContext2D,
  cx: number,
  bottomY: number,
  costume: Costume,
  animationTick: number
) {
  ctx.save();
  const duckH = 26;
  const duckY = bottomY - duckH;

  // Dust cloud under sliding character
  ctx.fillStyle = 'rgba(217, 119, 6, 0.3)';
  const dustShift = (animationTick * 5) % 20;
  ctx.beginPath();
  ctx.arc(cx - 24 - dustShift, bottomY - 4, 6, 0, Math.PI * 2);
  ctx.arc(cx - 16, bottomY - 3, 5, 0, Math.PI * 2);
  ctx.fill();

  // Torso / Slide Body
  ctx.fillStyle = costume.jacketColor;
  ctx.beginPath();
  ctx.roundRect(cx - 22, duckY + 4, 38, 18, 8);
  ctx.fill();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Legs extended back
  ctx.fillStyle = costume.pantsColor;
  ctx.beginPath();
  ctx.roundRect(cx - 30, duckY + 10, 16, 12, 4);
  ctx.fill();

  // Head tucked forward low
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(cx + 12, duckY + 10, 14, 0, Math.PI * 2);
  ctx.fill();

  // White hair & beard
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx + 12, duckY + 13, 11, 0, Math.PI);
  ctx.fill();

  // Spectacles
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(cx + 8, duckY + 6, 7, 7, 2);
  ctx.stroke();

  // Cheerful wink/focus eye
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(cx + 12, duckY + 9, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
